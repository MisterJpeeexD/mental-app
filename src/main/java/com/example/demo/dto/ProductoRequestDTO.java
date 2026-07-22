package com.example.demo.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductoRequestDTO(
        @NotBlank(message = "Nombre is required") String nombre,
        String descripcion,
        @NotNull(message = "Precio is required")
        @DecimalMin(value = "0.0", message = "Precio must be zero or greater") Double precio,
        @NotNull(message = "Stock is required")
        @Min(value = 0, message = "Stock must be zero or greater") Integer stock,
        String categoria
) {
}
