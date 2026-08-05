package com.backend.abrazamente.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;

@Builder
public record UsuarioResponseDTO(
        Integer id,
        String nombres,
        String apellidos,
        String email,
        String run,
        LocalDate fechaNacimiento,
        String genero,
        String estadoCivil,
        String telefono,
        String ciudad,
        String estado,
        Set<String> roles,
        OffsetDateTime fechaCreacion
) {
}
