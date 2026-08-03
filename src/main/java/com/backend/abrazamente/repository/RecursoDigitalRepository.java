package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.RecursoDigital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;

public interface RecursoDigitalRepository extends JpaRepository<RecursoDigital, Integer> {
    // Query Method
    @EntityGraph(attributePaths = {"categorias"})
    List<RecursoDigital> findAll();
    
    List<RecursoDigital> findByTitulo(String titulo);
    boolean existsByUrlContenido(String urlContenido);
}
