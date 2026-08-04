package com.backend.abrazamente.config;

import com.backend.abrazamente.repository.*;
import com.backend.abrazamente.service.RecursoSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CloudDataSeeder implements CommandLineRunner {

    private final RecursoSyncService syncService;
    private final ProfesionalRepository profesionalRepository;
    private final ForoTematicoRepository foroTematicoRepository;
    private final RecursoDigitalRepository recursoDigitalRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("=== VERIFICANDO BASE DE DATOS EN NUBE (MIGRACIONES FLYWAY SQL V1..V5 ACTIVAS) ===");

        // Sincronización automática de libros reales vía API si la tabla está baja de registros
        if (recursoDigitalRepository.count() < 30) {
            String[] temas = {"ansiedad", "salud mental", "autoestima", "depresion", "mindfulness"};
            for (String tema : temas) {
                try {
                    syncService.sincronizarLibros(tema, 8);
                } catch (Exception e) {
                    log.warn("No se pudo sincronizar tema {}: {}", tema, e.getMessage());
                }
            }
        }

        log.info("=== BASE DE DATOS OK: TOTAL RECURSOS = {}, PROFESIONALES = {}, FOROS = {} ===",
                recursoDigitalRepository.count(), profesionalRepository.count(), foroTematicoRepository.count());
    }
}
