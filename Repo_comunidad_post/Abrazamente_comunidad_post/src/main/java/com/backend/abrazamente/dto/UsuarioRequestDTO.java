package com.backend.abrazamente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UsuarioRequestDTO(
        @NotBlank(message = "Es obligatorio entregar los nombres")
        @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres")
        String nombres,

        @NotBlank(message = "Es obligatorio entregar los apellidos")
        @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
        String apellidos,

        @NotBlank(message = "El RUT es obligatorio")
        @Pattern(regexp = "^(?:\\d{1,2}\\.?\\d{3}\\.?\\d{3}-[0-9Kk])$", message = "El formato del RUT no es válido")
        String run,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        LocalDate fechaNacimiento,

        @NotBlank(message = "El género es obligatorio")
        @Pattern(regexp = "masculino|femenino|otro|prefiero_no_decir", message = "El género seleccionado no es válido")
        String genero,

        @Pattern(regexp = "^$|soltero|casado|divorciado|viudo|otro", message = "El estado civil seleccionado no es válido")
        String estadoCivil,

        @NotBlank(message = "Es obligatorio entregar el email")
        @Email(message = "Formato de email incorrecto")
        @Size(max = 255, message = "El email no puede superar 255 caracteres")
        String email,

        @NotBlank(message = "Es obligatoria la contraseña")
        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "La contraseña debe incluir al menos una letra y un número")
        String password,

        @Pattern(regexp = "^$|^\\+?[0-9 ]{8,20}$", message = "El teléfono debe contener entre 8 y 20 dígitos")
        String telefono,

        @NotBlank(message = "Es obligatorio entregar la ciudad")
        @Size(max = 100, message = "La ciudad no puede superar 100 caracteres")
        String ciudad
) {
}
