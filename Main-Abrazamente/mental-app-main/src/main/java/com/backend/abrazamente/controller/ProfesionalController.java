package com.backend.abrazamente.controller;

import com.backend.abrazamente.model.Profesional;
import com.backend.abrazamente.repository.ProfesionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalRepository profesionalRepository;

    @GetMapping
    public ResponseEntity<List<Profesional>> obtenerTodos() {
        return ResponseEntity.ok(profesionalRepository.findAll());
    }
}
