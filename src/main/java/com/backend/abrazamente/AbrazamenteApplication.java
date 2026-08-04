package com.backend.abrazamente;

import com.backend.abrazamente.service.RecursoSyncService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AbrazamenteApplication {

    public static void main(String[] args) {
        SpringApplication.run(AbrazamenteApplication.class, args);
    }

    @Bean
    public CommandLineRunner autoCloudSync(RecursoSyncService syncService) {
        return args -> {
            try {
                syncService.sincronizarLibros("ansiedad", 10);
                syncService.sincronizarLibros("salud mental", 5);
            } catch (Exception e) {
                System.err.println("Error en autosincronización nube: " + e.getMessage());
            }
        };
    }
}
