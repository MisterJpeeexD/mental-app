package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.ForoTema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForoTemaRepository extends JpaRepository<ForoTema, Integer> {
    List<ForoTema> findByForoId(Integer forumId);
}