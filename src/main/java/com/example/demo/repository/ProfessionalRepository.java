package com.example.demo.repository;

import com.example.demo.model.Professional;
import com.example.demo.model.enums.ProfessionalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, Long> {
    List<Professional> findByEstado(ProfessionalStatus estado);
}
