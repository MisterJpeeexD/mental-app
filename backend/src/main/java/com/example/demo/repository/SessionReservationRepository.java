package com.example.demo.repository;

import com.example.demo.model.SessionReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionReservationRepository extends JpaRepository<SessionReservation, Long> {
    List<SessionReservation> findByUserId(Long userId);
    List<SessionReservation> findByProfessionalId(Long professionalId);
}
