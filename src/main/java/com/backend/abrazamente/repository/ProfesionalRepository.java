package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.Profesional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfesionalRepository extends JpaRepository<Profesional, Integer> {
}
