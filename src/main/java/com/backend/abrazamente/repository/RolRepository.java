package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    // Retorna Optional para evitar manejar listas de un solo elemento
    Optional<Rol> findByNombre(String nombre);
}
