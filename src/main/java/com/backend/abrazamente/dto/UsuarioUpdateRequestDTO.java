package com.backend.abrazamente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UsuarioUpdateRequestDTO(
        @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres")
        String nombres,

        @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
        String apellidos,

        @Email(message = "Formato de email incorrecto")
        @Size(max = 255, message = "El email no puede superar 255 caracteres")
        String email,

        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "La contraseña debe incluir al menos una letra y un número")
        String password,

        @Pattern(regexp = "^$|^\\+?[0-9 ]{8,20}$", message = "El teléfono debe contener entre 8 y 20 dígitos")
        String telefono,

        @Size(max = 100, message = "La ciudad no puede superar 100 caracteres")
        String ciudad,

        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        LocalDate fechaNacimiento,

        @Pattern(regexp = "masculino|femenino|otro|prefiero_no_decir", message = "El género seleccionado no es válido")
        String genero,

        @Pattern(regexp = "^$|soltero|casado|divorciado|viudo|otro", message = "El estado civil seleccionado no es válido")
        String estadoCivil
) {
}
