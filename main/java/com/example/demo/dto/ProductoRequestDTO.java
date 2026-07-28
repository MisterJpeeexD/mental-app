package com.example.demo.dto;

public record ProductoRequestDTO(
        String nombre,
        String descripcion,
        Double precio,
        Integer stock,
        String categoria
) {
}
