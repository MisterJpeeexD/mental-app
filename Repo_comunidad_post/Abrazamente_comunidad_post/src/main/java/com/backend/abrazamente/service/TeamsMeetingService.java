package com.backend.abrazamente.service;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.models.OnlineMeeting;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class TeamsMeetingService {

    private final String tenantId;
    private final String clientId;
    private final String clientSecret;
    private final String userId;

    public TeamsMeetingService(
            @Value("${microsoft.graph.tenant-id}") String tenantId,
            @Value("${microsoft.graph.client-id}") String clientId,
            @Value("${microsoft.graph.client-secret}") String clientSecret,
            @Value("${microsoft.graph.user-id}") String userId) {
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.userId = userId;
    }

    /**
     * Crea una reunión en Microsoft Teams vía Graph API.
     * @param subject Asunto de la reunión
     * @param start Fecha y hora de inicio
     * @param end Fecha y hora de término
     * @return URL de acceso (joinWebUrl) a la reunión de Teams
     */
    public String createMeeting(String subject, OffsetDateTime start, OffsetDateTime end) {
        // Validación de credenciales mock
        if ("mock-tenant-id".equals(tenantId) || "mock-client-id".equals(clientId)) {
            // Si no hay credenciales reales configuradas, devolver un mock de la URL
            return "https://teams.microsoft.com/l/meetup-join/19%3ameeting_" 
                    + UUID.randomUUID().toString().replace("-", "") 
                    + "%40thread.v2/0?context=%7b%22Tid%22%3a%22" + tenantId + "%22%7d";
        }

        try {
            ClientSecretCredential credential = new ClientSecretCredentialBuilder()
                    .tenantId(tenantId)
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .build();

            GraphServiceClient graphClient = new GraphServiceClient(credential);

            OnlineMeeting meeting = new OnlineMeeting();
            meeting.setStartDateTime(start);
            meeting.setEndDateTime(end);
            meeting.setSubject(subject);

            OnlineMeeting createdMeeting = graphClient.users().byUserId(userId).onlineMeetings()
                    .post(meeting);

            return createdMeeting.getJoinWebUrl();

        } catch (Exception e) {
            // En caso de fallo (por ej. credenciales incorrectas), lanzamos una RuntimeException
            // Esto prevendrá que la sesión se guarde en base de datos si falla la creación en Teams.
            throw new RuntimeException("Error al comunicarse con Microsoft Graph API para crear la reunión de Teams", e);
        }
    }
}
