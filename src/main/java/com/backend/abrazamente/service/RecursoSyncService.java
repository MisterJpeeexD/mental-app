package com.backend.abrazamente.service;

import com.backend.abrazamente.model.CategoriaRecurso;
import com.backend.abrazamente.model.RecursoDigital;
import com.backend.abrazamente.repository.CategoriaRecursoRepository;
import com.backend.abrazamente.repository.RecursoDigitalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@Slf4j
public class RecursoSyncService {

    private final RecursoDigitalRepository recursoRepository;
    private final CategoriaRecursoRepository categoriaRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    private static final String OPENLIBRARY_API = "https://openlibrary.org/search.json?q=";

    public RecursoSyncService(RecursoDigitalRepository recursoRepository,
                              CategoriaRecursoRepository categoriaRepository,
                              ObjectMapper objectMapper) {
        this.recursoRepository = recursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }
    
    // Constructor para inyectar HttpClient (útil para tests)
    public RecursoSyncService(RecursoDigitalRepository recursoRepository,
                              CategoriaRecursoRepository categoriaRepository,
                              ObjectMapper objectMapper,
                              HttpClient httpClient) {
        this.recursoRepository = recursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
    }

    @Transactional
    public void sincronizarLibros(String tema, int limite) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENLIBRARY_API + tema + "&limit=" + limite))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode docs = root.path("docs");

                CategoriaRecurso categoria = getOrCreateCategoria("Libros", "Libros y literatura obtenida de APIs publicas");

                for (JsonNode doc : docs) {
                    String titulo = doc.path("title").asText("Sin título");
                    String autor = doc.path("author_name").isArray() ? doc.path("author_name").get(0).asText("Autor desconocido") : "Autor desconocido";
                    String key = doc.path("key").asText("");
                    String coverId = doc.path("cover_i").asText("");

                    // Evitamos duplicados
                    if (!recursoRepository.existsByUrlContenido("https://openlibrary.org" + key)) {
                        RecursoDigital recurso = new RecursoDigital();
                        recurso.setTitulo(titulo);
                        recurso.setAutor(autor);
                        recurso.setTipoContenido("Libros");
                        recurso.setUrlContenido("https://openlibrary.org" + key);
                        
                        if (!coverId.isEmpty() && !coverId.equals("null")) {
                            recurso.setImagenPortadaUrl("https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg");
                        }
                        
                        recurso.setDescripcion("Libro obtenido de OpenLibrary sobre " + tema);
                        recurso.setEsPremium(false);
                        recurso.setPrecio(BigDecimal.ZERO);
                        recurso.getCategorias().add(categoria);

                        recursoRepository.save(recurso);
                        log.info("Sincronizado libro: {}", titulo);
                    }
                }
            } else {
                log.error("Error al consultar OpenLibrary API: {}", response.statusCode());
            }

        } catch (Exception e) {
            log.error("Excepcion al sincronizar libros", e);
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
