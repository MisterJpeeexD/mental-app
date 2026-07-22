package com.example.demo.controller;

import com.example.demo.dto.ProfessionalResponseDTO;
import com.example.demo.service.ProfessionalService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/professionals")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ProfessionalController {

    private final ProfessionalService professionalService;

    @GetMapping
    public ResponseEntity<List<ProfessionalResponseDTO>> getAllProfessionals() {
        return ResponseEntity.ok(professionalService.getActiveProfessionals());
    }
}
