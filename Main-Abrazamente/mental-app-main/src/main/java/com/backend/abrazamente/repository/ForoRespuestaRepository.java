package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.ForoRespuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForoRespuestaRepository extends JpaRepository<ForoRespuesta, Integer> {
    List<ForoRespuesta> findByTemaId(Integer temaId);
}