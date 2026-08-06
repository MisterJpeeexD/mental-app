package com.backend.abrazamente.controller;

import com.backend.abrazamente.model.RecursoDigital;
import com.backend.abrazamente.service.RecursoDigitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recursos-digitales")
@RequiredArgsConstructor
public class RecursoDigitalController {

    private final RecursoDigitalService recursoService;

    @GetMapping
    public ResponseEntity<List<RecursoDigital>> obtenerTodos() {
        return ResponseEntity.ok(recursoService.obtenerTodos());
    }
}
