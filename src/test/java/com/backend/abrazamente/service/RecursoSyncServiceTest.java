package com.backend.abrazamente.service;

import com.backend.abrazamente.model.CategoriaRecurso;
import com.backend.abrazamente.model.RecursoDigital;
import com.backend.abrazamente.repository.CategoriaRecursoRepository;
import com.backend.abrazamente.repository.RecursoDigitalRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RecursoSyncServiceTest {

    @Mock
    private RecursoDigitalRepository recursoRepository;

    @Mock
    private CategoriaRecursoRepository categoriaRepository;

    @Mock
    private HttpClient httpClient;

    @Mock
    private HttpResponse<String> httpResponse;

    private RecursoSyncService syncService;

    @BeforeEach
    void setUp() {
        syncService = new RecursoSyncService(recursoRepository, categoriaRepository, new ObjectMapper(), httpClient, "mock-youtube-key", "mock-spotify-id", "mock-spotify-secret");
    }

    @Test
    void sincronizarLibros_Exito() throws Exception {
        // Arrange
        String jsonResponse = "{ \"docs\": [ { \"title\": \"Test Book\", \"author_name\": [\"Test Author\"], \"key\": \"/works/OL123W\", \"cover_i\": 12345 } ] }";
        
        when(httpResponse.statusCode()).thenReturn(200);
        when(httpResponse.body()).thenReturn(jsonResponse);
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
                
        CategoriaRecurso catMock = new CategoriaRecurso();
        catMock.setNombre("Libros");
        when(categoriaRepository.findByNombre("Libros")).thenReturn(Optional.of(catMock));
        when(recursoRepository.existsByUrlContenido("https://openlibrary.org/works/OL123W")).thenReturn(false);

        // Act
        syncService.sincronizarLibros("mindfulness", 1);

        // Assert
        ArgumentCaptor<RecursoDigital> captor = ArgumentCaptor.forClass(RecursoDigital.class);
        verify(recursoRepository, times(1)).save(captor.capture());
        
        RecursoDigital saved = captor.getValue();
        assertEquals("Test Book", saved.getTitulo());
        assertEquals("Test Author", saved.getAutor());
        assertEquals("https://openlibrary.org/works/OL123W", saved.getUrlContenido());
        assertEquals("https://covers.openlibrary.org/b/id/12345-M.jpg", saved.getImagenPortadaUrl());
    }

    @Test
    void sincronizarLibros_RecursoYaExiste_NoGuardaDuplicado() throws Exception {
        // Arrange
        String jsonResponse = "{ \"docs\": [ { \"title\": \"Test Book\", \"key\": \"/works/OL123W\" } ] }";
        
        when(httpResponse.statusCode()).thenReturn(200);
        when(httpResponse.body()).thenReturn(jsonResponse);
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
                
        CategoriaRecurso catMock = new CategoriaRecurso();
        catMock.setNombre("Libros");
        when(categoriaRepository.findByNombre("Libros")).thenReturn(Optional.of(catMock));
        
        // Simular que ya existe
        when(recursoRepository.existsByUrlContenido("https://openlibrary.org/works/OL123W")).thenReturn(true);

        // Act
        syncService.sincronizarLibros("mindfulness", 1);

        // Assert
        // Como ya existe, no deberia llamar a save()
        verify(recursoRepository, never()).save(any(RecursoDigital.class));
    }
}
