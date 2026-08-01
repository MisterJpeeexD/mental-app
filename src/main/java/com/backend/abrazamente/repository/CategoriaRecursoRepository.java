package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.CategoriaRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoriaRecursoRepository extends JpaRepository<CategoriaRecurso, Integer> {
    Optional<CategoriaRecurso> findByNombre(String nombre);
}