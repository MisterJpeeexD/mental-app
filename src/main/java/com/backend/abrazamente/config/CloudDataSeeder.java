package com.backend.abrazamente.config;

import com.backend.abrazamente.model.*;
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
        log.info("=== INICIANDO POBLAMIENTO EXTENDIDO DE MAS DE 50 RECURSOS EN NUBE ===");

        // 1. Sincronizar más de 50 a 80 libros reales de OpenLibrary a través de varios temas de salud mental
        String[] temas = {"ansiedad", "salud mental", "autoestima", "depresion", "mindfulness", "bienestar", "psicologia", "estres"};
        for (String tema : temas) {
            try {
                syncService.sincronizarLibros(tema, 10);
            } catch (Exception e) {
                log.warn("No se pudo sincronizar tema {}: {}", tema, e.getMessage());
            }
        }

        // 2. Asegurar Temáticas de Foros
        if (foroTematicoRepository.count() < 6) {
            String[][] forosData = {
                {"Ansiedad y Crisis de Pánico", "Estrategias de regulación somática y contención emocional", "Salud Mental"},
                {"Depresión y Rumiación", "Comprensión del estado de ánimo bajo y acompañamiento mutuo", "Acompañamiento"},
                {"Autoestima y Amor Propio", "Reestructuración cognitiva y hábitos de autocompasión", "Bienestar"},
                {"Mindfulness y Meditación", "Prácticas de atención plena y reducción de estrés", "Mindfulness"},
                {"Relaciones y Vínculos Sanos", "Límites personales, comunicación no violenta y parejas", "Relaciones"},
                {"Insomnio y Descanso", "Higiene del sueño, relajación muscular y rutina nocturna", "Bienestar"}
            };

            for (String[] f : forosData) {
                if (foroTematicoRepository.findByNombre(f[0]).isEmpty()) {
                    ForoTematico ft = new ForoTematico();
                    ft.setNombre(f[0]);
                    ft.setDescripcion(f[1]);
                    ft.setCategoria(f[2]);
                    ft.setNumeroMiembros(40 + (int)(Math.random() * 200));
                    foroTematicoRepository.save(ft);
                }
            }
        }

        log.info("=== POBLADO EN NUBE COMPLETADO: TOTAL RECURSOS = {}, PROFESIONALES = {}, FOROS = {} ===",
                recursoDigitalRepository.count(), profesionalRepository.count(), foroTematicoRepository.count());
    }
}
