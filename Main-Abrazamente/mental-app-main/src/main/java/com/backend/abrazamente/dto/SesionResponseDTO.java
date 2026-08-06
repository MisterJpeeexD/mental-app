package com.backend.abrazamente.dto;

import java.time.OffsetDateTime;

public record SesionResponseDTO(
        Integer id,
        Integer usuarioId,
        String usuarioNombre,
        Integer profesionalId,
        String profesionalNombre,
        OffsetDateTime fechaHora,
        String estado,
        String teamsMeetingUrl,
        String notas
) {}
