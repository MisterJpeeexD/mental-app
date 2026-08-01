package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.dto.UsuarioUpdateRequestDTO;
import com.backend.abrazamente.exception.ConflictoException;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.exception.ValidacionNegocioException;
import com.backend.abrazamente.mapper.UsuarioMapper;
import com.backend.abrazamente.model.Rol;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.model.UsuarioRol;
import com.backend.abrazamente.repository.RolRepository;
import com.backend.abrazamente.repository.UsuarioRepository;
import com.backend.abrazamente.validation.RutUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private static final String ROL_USUARIO = "usuario";

    private final UsuarioRepository repository;
    private final RolRepository rolRepository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO request) {
        String email = request.email().trim().toLowerCase();
        String run = RutUtils.normalizar(request.run());

        if (!RutUtils.esValido(run)) {
            throw new ValidacionNegocioException("El RUT ingresado no es válido");
        }
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new ConflictoException("Ya existe una cuenta asociada a ese correo electrónico");
        }
        if (repository.existsByRun(run)) {
            throw new ConflictoException("Ya existe una cuenta asociada a ese RUT");
        }

        Rol rolUsuario = rolRepository.findByNombre(ROL_USUARIO)
                .orElseThrow(() -> new RecursoNoEncontradoException("El rol base de usuario no está configurado"));

        Usuario usuario = mapper.toModel(request);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));

        UsuarioRol asignacion = new UsuarioRol();
        asignacion.setUsuario(usuario);
        asignacion.setRol(rolUsuario);
        usuario.getUsuarioRoles().add(asignacion);

        return mapper.toDTO(repository.save(usuario));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> obtenerUsuarios() {
        return repository.findAllWithRoles()
            .stream()
            .map(mapper::toDTO)
            .toList();
}
    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO usuarioById(Integer id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
        return mapper.toDTO(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO usuarioByEmail(String email) {
        Usuario usuario = repository.findByEmailWithRoles(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        return mapper.toDTO(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponseDTO actualizarUsuario(Integer id, UsuarioUpdateRequestDTO request) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));

        if (request.nombres() != null) usuario.setNombres(request.nombres().trim());
        if (request.apellidos() != null) usuario.setApellidos(request.apellidos().trim());
        if (request.fechaNacimiento() != null) usuario.setFechaNacimiento(request.fechaNacimiento());
        if (request.genero() != null) usuario.setGenero(request.genero());
        if (request.estadoCivil() != null) usuario.setEstadoCivil(valorOpcional(request.estadoCivil()));
        if (request.telefono() != null) usuario.setTelefono(valorOpcional(request.telefono()));
        if (request.ciudad() != null) usuario.setCiudad(request.ciudad().trim());

        if (request.email() != null && !request.email().isBlank()) {
            String nuevoEmail = request.email().trim().toLowerCase();
            repository.findByEmailIgnoreCase(nuevoEmail)
                    .filter(otro -> !otro.getId().equals(id))
                    .ifPresent(otro -> { throw new ConflictoException("El correo electrónico ya está en uso"); });
            usuario.setEmail(nuevoEmail);
        }

        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        return mapper.toDTO(repository.save(usuario));
    }

    @Override
    @Transactional
    public void eliminarUsuario(Integer id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
        repository.delete(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> findByCiudad(String ciudad) {
        return repository.findByCiudadIgnoreCase(ciudad).stream().map(mapper::toDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> buscarByNombre(String nombre) {
        return repository.buscarByNombre(nombre).stream().map(mapper::toDTO).toList();
    }

    private String valorOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
