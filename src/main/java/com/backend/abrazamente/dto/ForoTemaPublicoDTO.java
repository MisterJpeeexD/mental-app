package com.backend.abrazamente.dto;

import java.time.OffsetDateTime;

public record ForoTemaPublicoDTO(
        Integer id,
        ForoResumenDTO foro,
        UsuarioPublicoDTO usuario,
        String titulo,
        String contenido,
        Integer numeroRespuestas,
        Integer vistas,
        OffsetDateTime fechaCreacion
) {
}
