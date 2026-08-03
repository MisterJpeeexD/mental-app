package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.SesionTerapia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SesionTerapiaRepository extends JpaRepository<SesionTerapia, Integer> {
    List<SesionTerapia> findByUsuarioIdOrderByFechaHoraDesc(Integer usuarioId);
    List<SesionTerapia> findByProfesionalIdOrderByFechaHoraDesc(Integer profesionalId);
}
