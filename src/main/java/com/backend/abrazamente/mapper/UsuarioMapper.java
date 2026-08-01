package com.backend.abrazamente.mapper;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toModel(UsuarioRequestDTO request) {
        if (request == null) return null;

        Usuario usuario = new Usuario();
        usuario.setNombres(request.nombres());
        usuario.setApellidos(request.apellidos());
        usuario.setCiudad(request.ciudad());
        usuario.setEmail(request.email());
        usuario.setPasswordHash(request.password()); // Mapea la contraseña
        usuario.setTelefono(request.telefono());
        return usuario;
    }

    public UsuarioResponseDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;

        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .ciudad(usuario.getCiudad())
                .estado(usuario.getEstado())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }
}