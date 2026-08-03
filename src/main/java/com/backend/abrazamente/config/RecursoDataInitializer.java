package com.backend.abrazamente.config;

import com.backend.abrazamente.model.CategoriaRecurso;
import com.backend.abrazamente.model.RecursoDigital;
import com.backend.abrazamente.repository.CategoriaRecursoRepository;
import com.backend.abrazamente.repository.RecursoDigitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RecursoDataInitializer implements ApplicationRunner {

    private final CategoriaRecursoRepository categoriaRepository;
    private final RecursoDigitalRepository recursoRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (recursoRepository.count() == 0) {
            CategoriaRecurso catLibros = getOrCreateCategoria("Libros", "Libros y literatura");
            CategoriaRecurso catPodcast = getOrCreateCategoria("Podcast", "Audios y charlas");
            CategoriaRecurso catGuias = getOrCreateCategoria("Guias", "Guías prácticas");
            
            // Recurso 1 - Amazon Book
            RecursoDigital r1 = new RecursoDigital();
            r1.setTitulo("El Hombre en Busca de Sentido");
            r1.setDescripcion("El psiquiatra Viktor Frankl reflexiona sobre su experiencia en los campos de concentración y su enfoque psicoterapéutico (Logoterapia).");
            r1.setTipoContenido("Libros");
            r1.setAutor("Viktor E. Frankl");
            r1.setUrlContenido("https://www.amazon.com/Hombre-Busca-Sentido-Man-Search/dp/8425432022");
            r1.setImagenPortadaUrl("https://m.media-amazon.com/images/I/71u9sDkHnCL._SY522_.jpg");
            r1.setEsPremium(true);
            r1.setPrecio(new BigDecimal("12.99"));
            r1.getCategorias().add(catLibros);
            
            // Recurso 2 - Podcast Spotify
            RecursoDigital r2 = new RecursoDigital();
            r2.setTitulo("Entiende Tu Mente");
            r2.setDescripcion("Podcast de psicología en español. En cada episodio hablan de un tema diferente que te ayuda a entenderte mejor.");
            r2.setTipoContenido("Podcast");
            r2.setAutor("Molo Cebrián, Luis Muiño, Mónica González");
            r2.setUrlContenido("https://open.spotify.com/show/0w10v525yT2lKikA1W9a8Q");
            r2.setImagenPortadaUrl("https://i.scdn.co/image/ab6765630000ba8a7c295ce86f8ce226c457f583");
            r2.setEsPremium(false);
            r2.getCategorias().add(catPodcast);

            // Recurso 3 - IA Tool (ChatGPT Prompting Guide)
            RecursoDigital r3 = new RecursoDigital();
            r3.setTitulo("Guía de Prompts para Autoconocimiento");
            r3.setDescripcion("Una guía con ejemplos de prompts para usar herramientas de IA como ChatGPT para journaling y reflexión guiada.");
            r3.setTipoContenido("Guias");
            r3.setAutor("Abrazamente");
            r3.setUrlContenido("https://chat.openai.com/");
            r3.setImagenPortadaUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400");
            r3.setEsPremium(false);
            r3.getCategorias().add(catGuias);

            // Recurso 4 - Amazon Book
            RecursoDigital r4 = new RecursoDigital();
            r4.setTitulo("Hábitos Atómicos");
            r4.setDescripcion("Cambios pequeños, resultados extraordinarios. Un método sencillo para desarrollar buenos hábitos y romper los malos.");
            r4.setTipoContenido("Libros");
            r4.setAutor("James Clear");
            r4.setUrlContenido("https://www.amazon.com/H%C3%A1bitos-At%C3%B3micos-Atomic-Habits-Spanish/dp/1984852924");
            r4.setImagenPortadaUrl("https://m.media-amazon.com/images/I/81Iwi4Bf25L._SY522_.jpg");
            r4.setEsPremium(true);
            r4.setPrecio(new BigDecimal("14.99"));
            r4.getCategorias().add(catLibros);

            recursoRepository.saveAll(List.of(r1, r2, r3, r4));
        }
    }

    private CategoriaRecurso getOrCreateCategoria(String nombre, String descripcion) {
        return categoriaRepository.findByNombre(nombre).orElseGet(() -> {
            CategoriaRecurso cat = new CategoriaRecurso();
            cat.setNombre(nombre);
            cat.setDescripcion(descripcion);
            return categoriaRepository.save(cat);
        });
    }
}
