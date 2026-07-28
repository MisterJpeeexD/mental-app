package com.example.demo.controller;

import com.example.demo.dto.ProductoRequestDTO;
import com.example.demo.dto.ProductoResponseDTO;
import com.example.demo.service.ProductoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@AllArgsConstructor
public class ProductoController {

    private final ProductoService service;

    @PostMapping
    public ProductoResponseDTO crearProducto(@RequestBody ProductoRequestDTO request) {
        return service.crearProducto(request);
    }

    @GetMapping
    public List<ProductoResponseDTO> obtenerProductos() {
        return service.obtenerProductos();
    }

    @GetMapping("/{id}")
    public ProductoResponseDTO productoById(@PathVariable Long id) {
        return service.productoById(id);
    }

    @DeleteMapping("/{id}")
    public ProductoResponseDTO eliminarProducto(@PathVariable Long id) {
        return service.eliminarProducto(id);
    }
}
