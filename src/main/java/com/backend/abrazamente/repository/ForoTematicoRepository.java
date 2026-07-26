package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.ForoTematico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ForoTematicoRepository extends JpaRepository<ForoTematico, Integer> {
    // Query Method
    List<ForoTematico> findByNombre(String nombre);
    List<ForoTematico> findByCategoria(String categoria);
}
