package com.example.demo.dto;

import lombok.Builder;

@Builder
public record ProductoResponseDTO(
        Long id,
        String nombre,
        Integer stock
) {
}
