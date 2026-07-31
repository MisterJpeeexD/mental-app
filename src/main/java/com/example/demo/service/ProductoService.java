package com.example.demo.service;

import com.example.demo.dto.ProductoRequestDTO;
import com.example.demo.dto.ProductoResponseDTO;

import java.util.List;

public interface ProductoService {
    ProductoResponseDTO crearProducto(ProductoRequestDTO request);
    List<ProductoResponseDTO> obtenerProductos();
    ProductoResponseDTO productoById(Long id);
    ProductoResponseDTO eliminarProducto(Long id);
}
