package com.example.demo.service;

import com.example.demo.dto.ProductoRequestDTO;
import com.example.demo.dto.ProductoResponseDTO;
import com.example.demo.mapper.ProductoMapper;
import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository repository;
    private final ProductoMapper mapper;

    @Override
    public ProductoResponseDTO crearProducto(ProductoRequestDTO request) {
        Producto producto = mapper.toModel(request);
        Producto saved = repository.save(producto);
        return mapper.toDTO(saved);
    }

    @Override
    public List<ProductoResponseDTO> obtenerProductos() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public ProductoResponseDTO productoById(Long id) {
        Producto producto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return mapper.toDTO(producto);
    }

    @Override
    public ProductoResponseDTO eliminarProducto(Long id) {
        Producto producto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        repository.delete(producto);
        return mapper.toDTO(producto);
    }
}
