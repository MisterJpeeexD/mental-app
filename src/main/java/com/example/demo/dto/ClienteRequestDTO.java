package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClienteRequestDTO(
        @NotBlank(message = "Nombre is required") String nombre,
        @NotBlank(message = "Apellido is required") String apellido,
        @NotBlank(message = "Correo is required") @Email(message = "Correo should be valid") String correo,
        String telefono,
        String direccion
) {
}
