package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.exception.ConflictoException;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.exception.ValidacionNegocioException;
import com.backend.abrazamente.mapper.UsuarioMapper;
import com.backend.abrazamente.model.Rol;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.model.UsuarioRol;
import com.backend.abrazamente.repository.RolRepository;
import com.backend.abrazamente.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private UsuarioMapper mapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private UsuarioRequestDTO requestValido() {
        return new UsuarioRequestDTO(
                "Juan",
                "Perez",
                "11.111.111-1",
                LocalDate.of(1995, 3, 10),
                "masculino",
                "soltero",
                "juan@example.com",
                "Password123",
                "+56 9 1234 5678",
                "Santiago"
        );
    }

    @Test
    void crearUsuario_RutInvalido_LanzaValidacion() {
        UsuarioRequestDTO request = new UsuarioRequestDTO(
                "Juan", "Perez", "11.111.111-2", LocalDate.of(1995, 3, 10),
                "masculino", "soltero", "juan@example.com", "Password123",
                "+56 9 1234 5678", "Santiago");

        assertThrows(ValidacionNegocioException.class, () -> usuarioService.crearUsuario(request));
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void crearUsuario_EmailDuplicado_LanzaConflicto() {
        when(repository.existsByEmailIgnoreCase("juan@example.com")).thenReturn(true);

        assertThrows(ConflictoException.class, () -> usuarioService.crearUsuario(requestValido()));
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void crearUsuario_RutDuplicado_LanzaConflicto() {
        when(repository.existsByEmailIgnoreCase("juan@example.com")).thenReturn(false);
        when(repository.existsByRun("11111111-1")).thenReturn(true);

        assertThrows(ConflictoException.class, () -> usuarioService.crearUsuario(requestValido()));
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void crearUsuario_RolBaseFaltante_LanzaRecursoNoEncontrado() {
        when(repository.existsByEmailIgnoreCase("juan@example.com")).thenReturn(false);
        when(repository.existsByRun("11111111-1")).thenReturn(false);
        when(rolRepository.findByNombre("usuario")).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> usuarioService.crearUsuario(requestValido()));
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void crearUsuario_Exito_AsignaRolUsuarioYPersiste() {
        Rol rol = new Rol(1, "usuario", "Rol base", null, "activo", null);
        Usuario usuario = new Usuario();
        usuario.setEmail("juan@example.com");

        when(repository.existsByEmailIgnoreCase("juan@example.com")).thenReturn(false);
        when(repository.existsByRun("11111111-1")).thenReturn(false);
        when(rolRepository.findByNombre("usuario")).thenReturn(Optional.of(rol));
        when(mapper.toModel(any(UsuarioRequestDTO.class))).thenReturn(usuario);
        when(passwordEncoder.encode("Password123")).thenReturn("$2a$10$hash");
        when(repository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario saved = invocation.getArgument(0);
            saved.setId(99);
            return saved;
        });
        when(mapper.toDTO(any(Usuario.class))).thenReturn(UsuarioResponseDTO.builder()
                .id(99).nombres("Juan").apellidos("Perez").email("juan@example.com")
                .run("11111111-1").fechaNacimiento(LocalDate.of(1995, 3, 10))
                .genero("masculino").estadoCivil("soltero").ciudad("Santiago")
                .telefono("+56 9 1234 5678").estado("activo").roles(java.util.Set.of("usuario"))
                .build());

        UsuarioResponseDTO response = usuarioService.crearUsuario(requestValido());

        assertNotNull(response);
        assertEquals(99, response.id());
        assertEquals("usuario", response.roles().stream().findFirst().orElse(null));
        assertEquals("$2a$10$hash", usuario.getPasswordHash());

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).save(captor.capture());
        Usuario guardado = captor.getValue();
        assertEquals(1, guardado.getUsuarioRoles().size());
        UsuarioRol asignacion = guardado.getUsuarioRoles().iterator().next();
        assertEquals(rol, asignacion.getRol());
        assertEquals(usuario, asignacion.getUsuario());
    }
}
