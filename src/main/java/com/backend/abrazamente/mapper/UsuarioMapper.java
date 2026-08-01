package com.backend.abrazamente.mapper;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.validation.RutUtils;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UsuarioMapper {

    public Usuario toModel(UsuarioRequestDTO request) {
        if (request == null) return null;

        Usuario usuario = new Usuario();
        usuario.setNombres(request.nombres().trim());
        usuario.setApellidos(request.apellidos().trim());
        usuario.setRun(RutUtils.normalizar(request.run()));
        usuario.setFechaNacimiento(request.fechaNacimiento());
        usuario.setGenero(request.genero());
        usuario.setEstadoCivil(normalizarOpcional(request.estadoCivil()));
        usuario.setCiudad(request.ciudad().trim());
        usuario.setEmail(request.email().trim().toLowerCase());
        usuario.setTelefono(normalizarOpcional(request.telefono()));
        return usuario;
    }

    public UsuarioResponseDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;

        Set<String> roles = usuario.getUsuarioRoles() == null
                ? Set.of()
                : usuario.getUsuarioRoles().stream()
                    .filter(usuarioRol -> usuarioRol.getRol() != null)
                    .map(usuarioRol -> usuarioRol.getRol().getNombre())
                    .collect(Collectors.toUnmodifiableSet());

        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .run(usuario.getRun())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .genero(usuario.getGenero())
                .estadoCivil(usuario.getEstadoCivil())
                .telefono(usuario.getTelefono())
                .ciudad(usuario.getCiudad())
                .estado(usuario.getEstado())
                .roles(roles)
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }

    private String normalizarOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
