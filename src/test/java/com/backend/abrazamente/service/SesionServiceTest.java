package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.SesionRequestDTO;
import com.backend.abrazamente.dto.SesionResponseDTO;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.model.Profesional;
import com.backend.abrazamente.model.SesionTerapia;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.repository.ProfesionalRepository;
import com.backend.abrazamente.repository.SesionTerapiaRepository;
import com.backend.abrazamente.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SesionServiceTest {

    @Mock
    private SesionTerapiaRepository sesionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ProfesionalRepository profesionalRepository;

    @Mock
    private TeamsMeetingService teamsMeetingService;

    @InjectMocks
    private SesionService sesionService;

    private Usuario usuarioMock;
    private Profesional profesionalMock;
    private SesionRequestDTO requestMock;
    private String userEmail = "test@abrazamente.cl";

    @BeforeEach
    void setUp() {
        usuarioMock = new Usuario();
        usuarioMock.setId(UUID.randomUUID());
        usuarioMock.setEmail(userEmail);
        usuarioMock.setNombres("Juan");
        usuarioMock.setApellidos("Perez");

        Usuario usuarioPro = new Usuario();
        usuarioPro.setNombres("Dr. House");
        usuarioPro.setApellidos("");

        profesionalMock = new Profesional();
        profesionalMock.setId(UUID.randomUUID());
        profesionalMock.setUsuario(usuarioPro);

        requestMock = new SesionRequestDTO(
                profesionalMock.getId(),
                OffsetDateTime.now().plusDays(1),
                "Notas de prueba"
        );
    }

    @Test
    void agendarSesion_Exito() {
        // Arrange
        when(usuarioRepository.findByEmail(userEmail)).thenReturn(Optional.of(usuarioMock));
        when(profesionalRepository.findById(profesionalMock.getId())).thenReturn(Optional.of(profesionalMock));
        when(teamsMeetingService.createMeeting(anyString(), any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn("https://teams.mock.url");

        when(sesionRepository.save(any(SesionTerapia.class))).thenAnswer(i -> {
            SesionTerapia s = i.getArgument(0);
            s.setId(UUID.randomUUID());
            return s;
        });

        // Act
        SesionResponseDTO response = sesionService.agendarSesion(userEmail, requestMock);

        // Assert
        assertNotNull(response);
        assertEquals("PENDIENTE", response.estado());
        assertEquals("https://teams.mock.url", response.teamsMeetingUrl());
        verify(teamsMeetingService, times(1)).createMeeting(anyString(), any(), any());
        verify(sesionRepository, times(1)).save(any(SesionTerapia.class));
    }

    @Test
    void agendarSesion_UsuarioNoEncontrado_LanzaExcepcion() {
        // Arrange
        when(usuarioRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RecursoNoEncontradoException.class, () -> {
            sesionService.agendarSesion(userEmail, requestMock);
        });

        verify(teamsMeetingService, never()).createMeeting(anyString(), any(), any());
        verify(sesionRepository, never()).save(any(SesionTerapia.class));
    }

    @Test
    void agendarSesion_ProfesionalNoEncontrado_LanzaExcepcion() {
        // Arrange
        when(usuarioRepository.findByEmail(userEmail)).thenReturn(Optional.of(usuarioMock));
        when(profesionalRepository.findById(profesionalMock.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RecursoNoEncontradoException.class, () -> {
            sesionService.agendarSesion(userEmail, requestMock);
        });

        verify(teamsMeetingService, never()).createMeeting(anyString(), any(), any());
        verify(sesionRepository, never()).save(any(SesionTerapia.class));
    }
}
