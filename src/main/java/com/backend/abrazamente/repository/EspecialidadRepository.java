package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Integer>{
    // Query Method
    List<Especialidad> findByNombre(String nombre);
}


