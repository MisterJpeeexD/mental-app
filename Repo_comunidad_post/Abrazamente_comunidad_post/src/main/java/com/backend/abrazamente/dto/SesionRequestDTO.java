package com.backend.abrazamente.dto;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public record SesionRequestDTO(
        @NotNull Integer profesionalId,
        @NotNull OffsetDateTime fechaHora,
        String notas
) {}
