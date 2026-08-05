package com.backend.abrazamente.dto;

public record UsuarioPublicoDTO(
        Integer id,
        String nombres,
        String apellidos,
        String genero
) {
}
