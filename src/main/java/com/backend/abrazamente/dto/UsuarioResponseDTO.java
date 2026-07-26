package com.backend.abrazamente.dto;

import lombok.Builder;
import java.time.OffsetDateTime;

@Builder
public record UsuarioResponseDTO(
        Integer id,
        String nombres,
        String apellidos,
        String email,
        String telefono,
        String ciudad,
        String estado,
        OffsetDateTime fechaCreacion
) {
}