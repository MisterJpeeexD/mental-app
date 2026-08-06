package com.backend.abrazamente.dto;

import java.time.LocalDateTime;

public record ErrorResponse(
        LocalDateTime fecha,
        Integer status,
        String mensaje
) {
}
