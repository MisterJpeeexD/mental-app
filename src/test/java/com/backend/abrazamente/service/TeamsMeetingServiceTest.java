package com.backend.abrazamente.service;

import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class TeamsMeetingServiceTest {

    @Test
    void createMeeting_MockCredentials_RetornaMockUrl() {
        // Arrange
        TeamsMeetingService service = new TeamsMeetingService(
                "mock-tenant-id", "mock-client-id", "mock-secret", "mock-user-id"
        );

        // Act
        String url = service.createMeeting("Sesion de prueba", OffsetDateTime.now(), OffsetDateTime.now().plusHours(1));

        // Assert
        assertNotNull(url);
        assertTrue(url.startsWith("https://teams.microsoft.com/l/meetup-join/"));
        assertTrue(url.contains("mock-tenant-id"));
    }

    @Test
    void createMeeting_RealCredentials_ErrorApiGraph() {
        // Arrange
        // Pasamos credenciales "reales" (no mock), lo que intentara conectarse a Azure
        TeamsMeetingService service = new TeamsMeetingService(
                "real-tenant-id", "real-client-id", "real-secret", "real-user-id"
        );

        // Act & Assert
        // Como las credenciales son invalidas y no estamos mockeando al GraphServiceClient 
        // (ya que se instancia dentro del metodo), deberia lanzar una RuntimeException
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            service.createMeeting("Sesion de prueba", OffsetDateTime.now(), OffsetDateTime.now().plusHours(1));
        });

        assertTrue(exception.getMessage().contains("Error al comunicarse con Microsoft Graph API"));
    }
}
