package com.backend.abrazamente.controller;

import com.backend.abrazamente.service.RecursoSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/recursos")
@RequiredArgsConstructor
public class AdminRecursoController {

    private final RecursoSyncService recursoSyncService;

    // Solo un administrador podría ejecutar esto en un entorno real
    // @PreAuthorize("hasRole('ADMIN')") 
    @PostMapping("/sync")
    public ResponseEntity<String> sincronizarRecursos(@RequestParam(defaultValue = "ansiedad") String tema,
                                                      @RequestParam(defaultValue = "5") int limite) {
        recursoSyncService.sincronizarLibros(tema, limite);
        return ResponseEntity.ok("Sincronización iniciada para el tema: " + tema);
    }
}
