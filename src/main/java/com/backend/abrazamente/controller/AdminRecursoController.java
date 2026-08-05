package com.backend.abrazamente.controller;

import com.backend.abrazamente.service.RecursoSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/recursos")
@RequiredArgsConstructor
public class AdminRecursoController {

    private final RecursoSyncService recursoSyncService;

    // Endpoint administrativo de sincronizacion
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> sincronizarRecursos(@RequestParam(defaultValue = "ansiedad") String tema,
                                                                   @RequestParam(defaultValue = "5") int limite) {
        recursoSyncService.sincronizarLibros(tema, limite);
        recursoSyncService.sincronizarVideos(tema, limite);
        recursoSyncService.sincronizarPodcasts(tema, limite);
        
        return ResponseEntity.ok(Map.of(
            "mensaje", "Sincronización iniciada con éxito",
            "tema", tema,
            "limite", limite
        ));
    }
}
