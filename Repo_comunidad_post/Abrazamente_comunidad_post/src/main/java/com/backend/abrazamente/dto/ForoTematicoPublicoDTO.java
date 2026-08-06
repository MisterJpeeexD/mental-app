package com.backend.abrazamente.dto;

public record ForoTematicoPublicoDTO(
        Integer id,
        String nombre,
        String descripcion,
        String categoria,
        String reglasModeracion,
        Integer numeroMiembros
) {
}
