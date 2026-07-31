package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.mapper.UsuarioMapper;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder; // Inyección para encriptación de contraseñas

    @Override
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO request) {
        Usuario usuario = mapper.toModel(request);
        // Encriptar la contraseña antes de guardar
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));

        Usuario guardado = repository.save(usuario);
        return mapper.toDTO(guardado);
    }

    @Override
    public List<UsuarioResponseDTO> obtenerUsuarios() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public UsuarioResponseDTO usuarioById(Integer id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
        return mapper.toDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO actualizarUsuario(Integer id, UsuarioRequestDTO request) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));

        usuario.setNombres(request.nombres());
        usuario.setApellidos(request.apellidos());
        usuario.setEmail(request.email());
        usuario.setTelefono(request.telefono());
        usuario.setCiudad(request.ciudad());

        // Opcional: Si se envía una nueva contraseña, encriptarla
        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        Usuario actualizado = repository.save(usuario);
        return mapper.toDTO(actualizado);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
        repository.delete(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> findByCiudad(String ciudad) {
        return repository.findByCiudad(ciudad)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public List<UsuarioResponseDTO> buscarByNombre(String nombre) {
        // Se corrige el nombre del metodo según la interfaz del repositorio
        return repository.buscarByNombre(nombre)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}