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
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient;

    private final String youtubeApiKey;
    private final String spotifyClientId;
    private final String spotifyClientSecret;

    private static final String OPENLIBRARY_API = "https://openlibrary.org/search.json?q=";
    private static final String YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=";
    private static final String SPOTIFY_TOKEN_API = "https://accounts.spotify.com/api/token";
    private static final String SPOTIFY_SEARCH_API = "https://api.spotify.com/v1/search?type=episode&limit=";

    @org.springframework.beans.factory.annotation.Autowired
    public RecursoSyncService(RecursoDigitalRepository recursoRepository,
                              CategoriaRecursoRepository categoriaRepository,
                              @org.springframework.beans.factory.annotation.Value("${youtube.api-key}") String youtubeApiKey,
                              @org.springframework.beans.factory.annotation.Value("${spotify.client-id}") String spotifyClientId,
                              @org.springframework.beans.factory.annotation.Value("${spotify.client-secret}") String spotifyClientSecret) {
        this.recursoRepository = recursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.youtubeApiKey = youtubeApiKey;
        this.spotifyClientId = spotifyClientId;
        this.spotifyClientSecret = spotifyClientSecret;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }
    
    // Constructor para inyectar HttpClient (útil para tests)
    public RecursoSyncService(RecursoDigitalRepository recursoRepository,
                              CategoriaRecursoRepository categoriaRepository,
                              HttpClient httpClient,
                              String youtubeApiKey,
                              String spotifyClientId,
                              String spotifyClientSecret) {
        this.recursoRepository = recursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.httpClient = httpClient;
        this.youtubeApiKey = youtubeApiKey;
        this.spotifyClientId = spotifyClientId;
        this.spotifyClientSecret = spotifyClientSecret;
    }

    @Transactional
    public void sincronizarLibros(String tema, int limite) {
        try {
            String queryEncoded = java.net.URLEncoder.encode(tema, java.nio.charset.StandardCharsets.UTF_8);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENLIBRARY_API + queryEncoded + "&limit=" + limite))
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

                    // Evitamos duplicados por URL o por Título
                    String urlLibro = "https://openlibrary.org" + key;
                    if (!recursoRepository.existsByUrlContenido(urlLibro) && !recursoRepository.existsByTitulo(titulo)) {
                        RecursoDigital recurso = new RecursoDigital();
                        recurso.setTitulo(titulo);
                        recurso.setAutor(autor);
                        recurso.setTipoContenido("Libros");
                        recurso.setUrlContenido("https://openlibrary.org" + key);
                        
                        if (!coverId.isEmpty() && !coverId.equals("null")) {
                            recurso.setImagenPortadaUrl("https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg");
                        }
                        
                        recurso.setDescripcion("Libro seleccionado de OpenLibrary sobre " + tema + " para acompañamiento clínico.");
                        recurso.setEsPremium(false);
                        recurso.setPrecio(BigDecimal.ZERO);
                        recurso.setDuracionMinutos(15 + (int)(Math.random() * 45));
                        recurso.setVistas(500 + (int)(Math.random() * 3500));
                        recurso.setCodigoAfiliado("OPENLIB-" + tema.toUpperCase().replace(" ", ""));
                        recurso.setUrlAfiliado(recurso.getUrlContenido());
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

    @Transactional
    public void sincronizarVideos(String tema, int limite) {
        if ("mock-youtube-api-key".equals(youtubeApiKey)) {
            log.warn("Saltando sincronización de YouTube por falta de API key real.");
            return;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(YOUTUBE_API + limite + "&q=" + tema.replace(" ", "%20") + "&key=" + youtubeApiKey))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode items = root.path("items");

                CategoriaRecurso categoria = getOrCreateCategoria("Videos", "Material audiovisual educativo");

                for (JsonNode item : items) {
                    JsonNode snippet = item.path("snippet");
                    String videoId = item.path("id").path("videoId").asText("");
                    if (videoId.isEmpty() || videoId.equals("null")) continue;

                    String titulo = snippet.path("title").asText("Sin título");
                    String autor = snippet.path("channelTitle").asText("Canal desconocido");
                    String url = "https://www.youtube.com/watch?v=" + videoId;
                    
                    if (!recursoRepository.existsByUrlContenido(url)) {
                        RecursoDigital recurso = new RecursoDigital();
                        recurso.setTitulo(titulo);
                        recurso.setAutor(autor);
                        recurso.setTipoContenido("Video");
                        recurso.setUrlContenido(url);
                        recurso.setImagenPortadaUrl(snippet.path("thumbnails").path("high").path("url").asText(""));
                        recurso.setDescripcion(snippet.path("description").asText(""));
                        recurso.setEsPremium(false);
                        recurso.setPrecio(BigDecimal.ZERO);
                        recurso.getCategorias().add(categoria);

                        recursoRepository.save(recurso);
                        log.info("Sincronizado video: {}", titulo);
                    }
                }
            } else {
                log.error("Error al consultar YouTube API: {}", response.statusCode());
            }
        } catch (Exception e) {
            log.error("Excepcion al sincronizar videos", e);
        }
    }

    private String getSpotifyAccessToken() throws Exception {
        String auth = java.util.Base64.getEncoder().encodeToString((spotifyClientId + ":" + spotifyClientSecret).getBytes());
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SPOTIFY_TOKEN_API))
                .header("Authorization", "Basic " + auth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                .build();
                
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            return root.path("access_token").asText();
        }
        throw new RuntimeException("No se pudo obtener token de Spotify: " + response.statusCode());
    }

    @Transactional
    public void sincronizarPodcasts(String tema, int limite) {
        if ("mock-spotify-client-id".equals(spotifyClientId)) {
            log.warn("Saltando sincronización de Spotify por falta de credenciales reales.");
            return;
        }

        try {
            String token = getSpotifyAccessToken();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SPOTIFY_SEARCH_API + limite + "&q=" + tema.replace(" ", "%20")))
                    .header("Authorization", "Bearer " + token)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode items = root.path("episodes").path("items");

                CategoriaRecurso categoria = getOrCreateCategoria("Podcasts", "Episodios de audio y entrevistas");

                for (JsonNode item : items) {
                    if (item.isNull()) continue;
                    
                    String titulo = item.path("name").asText("Sin título");
                    String externalUrl = item.path("external_urls").path("spotify").asText("");
                    
                    if (!recursoRepository.existsByUrlContenido(externalUrl) && !externalUrl.isEmpty()) {
                        RecursoDigital recurso = new RecursoDigital();
                        recurso.setTitulo(titulo);
                        recurso.setAutor("Spotify Podcast");
                        recurso.setTipoContenido("Podcast");
                        recurso.setUrlContenido(externalUrl);
                        
                        JsonNode images = item.path("images");
                        if (images.isArray() && images.size() > 0) {
                            recurso.setImagenPortadaUrl(images.get(0).path("url").asText(""));
                        }
                        
                        recurso.setDescripcion(item.path("description").asText(""));
                        recurso.setEsPremium(false);
                        recurso.setPrecio(BigDecimal.ZERO);
                        recurso.getCategorias().add(categoria);

                        recursoRepository.save(recurso);
                        log.info("Sincronizado podcast: {}", titulo);
                    }
                }
            } else {
                log.error("Error al consultar Spotify API: {}", response.statusCode());
            }
        } catch (Exception e) {
            log.error("Excepcion al sincronizar podcasts", e);
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
