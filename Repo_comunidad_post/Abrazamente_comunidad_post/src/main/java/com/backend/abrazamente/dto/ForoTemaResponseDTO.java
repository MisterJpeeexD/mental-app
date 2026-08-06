package com.backend.abrazamente.dto;

import java.time.OffsetDateTime;

public record ForoTemaResponseDTO(
        Integer id,
        Integer foroId,
        String foroNombre,
        Integer autorId,
        String autor,
        String iniciales,
        String titulo,
        String contenido,
        Integer numeroRespuestas,
        Integer vistas,
        boolean anonimo,
        OffsetDateTime fechaCreacion
) {
}
