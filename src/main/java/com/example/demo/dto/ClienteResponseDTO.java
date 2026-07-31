package com.example.demo.dto;

import lombok.Builder;

@Builder
public record ClienteResponseDTO(
        Long id_cliente,
        String nombre,
        String correo
) {
}
