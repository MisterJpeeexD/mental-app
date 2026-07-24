package com.backend.abrazamente.mapper;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toModel(UsuarioRequestDTO request){
        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setApellido(request.apellido());
        usuario.setDireccion(request.direccion());
        usuario.setCorreo(request.correo());
        usuario.setTelefono(request.telefono());
        return usuario;
    }

    public UsuarioResponseDTO toDTO(Usuario usuario){
        return UsuarioResponseDTO.builder()
                .id_usuario(usuario.getId_usuario())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .build();
    }

}