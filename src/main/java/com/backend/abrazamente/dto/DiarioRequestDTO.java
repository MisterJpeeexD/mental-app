package com.backend.abrazamente.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * El cliente solo manda contenido y, opcionalmente, la fecha. El usuario sale
 * del token, nunca del cuerpo de la petición.
 */
public record DiarioRequestDTO(
        @NotBlank(message = "El contenido no puede estar vacío")
        @Size(max = 5000, message = "El contenido no puede superar los 5000 caracteres")
        String contenido,
        LocalDate fechaEntrada
) {
}
