package com.backend.abrazamente.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ForoTemaRequestDTO(
        @NotNull Integer foroId,
        @NotBlank @Size(max = 255) String titulo,
        @NotBlank String contenido,
        boolean anonimo
) {
}
