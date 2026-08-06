package com.backend.abrazamente.controller;

import com.backend.abrazamente.dto.SesionRequestDTO;
import com.backend.abrazamente.dto.SesionResponseDTO;
import com.backend.abrazamente.service.SesionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sesiones")
@AllArgsConstructor
public class SesionController {

    private final SesionService sesionService;

    @PostMapping
    public ResponseEntity<SesionResponseDTO> agendarSesion(
            @Valid @RequestBody SesionRequestDTO request,
            Authentication authentication) {
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(sesionService.agendarSesion(authentication.getName(), request));
    }

    @GetMapping("/mis-sesiones")
    public ResponseEntity<List<SesionResponseDTO>> obtenerMisSesiones(
            Authentication authentication) {
        
        return ResponseEntity.ok(sesionService.obtenerMisSesiones(authentication.getName()));
    }
}
