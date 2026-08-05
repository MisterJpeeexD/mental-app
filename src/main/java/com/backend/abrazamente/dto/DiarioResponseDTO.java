package com.backend.abrazamente.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Builder
public record DiarioResponseDTO(
        Integer id,
        String contenido,
        LocalDate fechaEntrada,
        String estadoPrivacidad,
        OffsetDateTime creadoEn
) {
}
