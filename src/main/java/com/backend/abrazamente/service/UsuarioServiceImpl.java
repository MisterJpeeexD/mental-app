package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.mapper.UsuarioMapper;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;

    // Métodos
    @Override
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO request) {
        Usuario usuario = mapper.toModel(request);
        repository.save(usuario);
        return mapper.toDTO(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> obtenerUsuarios() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO) // usuario -> mapper.toDTO(usuario)
                .toList();
    }

    @Override
    public UsuarioResponseDTO usuarioById(Long id_usuario) {
        Usuario usuario = repository.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapper.toDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO actualizarUsuario(Long id_usuario, UsuarioRequestDTO request){
        Usuario usuario = repository.findById(id_usuario).orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        usuario.setNombre(request.nombre());
        usuario.setDireccion(request.direccion());
        usuario.setTelefono(request.telefono());
        usuario.setCorreo(request.correo());
        usuario.setApellido(request.apellido());
        Usuario actualizado = repository.save(usuario);
        return mapper.toDTO(actualizado);
    }

    @Override
    public UsuarioResponseDTO eliminarUsuario(Long id_usuario){
        Usuario usuario = repository.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        repository.delete(usuario);
        return mapper.toDTO(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> findByDireccion(String direccion) {
        return repository.findByDireccion(direccion)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public List<UsuarioResponseDTO> buscarByNombre(String nombre) {
        return repository.buscarByNombre(nombre)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }


}