package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.DiarioEmocional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Todas las consultas filtran por usuario: no hay forma de leer el diario ajeno
 * aunque se conozca el id de una entrada.
 */
public interface DiarioEmocionalRepository extends JpaRepository<DiarioEmocional, Integer> {

    List<DiarioEmocional> findByUsuarioIdOrderByFechaEntradaDesc(Integer usuarioId);

    Optional<DiarioEmocional> findByUsuarioIdAndFechaEntrada(Integer usuarioId, LocalDate fechaEntrada);

    Optional<DiarioEmocional> findByIdAndUsuarioId(Integer id, Integer usuarioId);
}
