package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.RecursoDigital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecursoDigitalRepository extends JpaRepository<RecursoDigital, Integer> {
    // Query Method
    List<RecursoDigital> findByTitulo(String titulo);
}
