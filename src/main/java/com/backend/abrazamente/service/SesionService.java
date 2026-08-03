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
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SesionService {

    private final SesionTerapiaRepository sesionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;

    @Transactional
    public SesionResponseDTO agendarSesion(String userEmail, SesionRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        Profesional profesional = profesionalRepository.findById(request.profesionalId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesional no encontrado"));

        SesionTerapia sesion = new SesionTerapia();
        sesion.setUsuario(usuario);
        sesion.setProfesional(profesional);
        sesion.setFechaHora(request.fechaHora());
        sesion.setNotas(request.notas());
        sesion.setEstado("PENDIENTE");
        
        // Mock de generacion de URL de Teams para el prototipo
        // En una implementacion real, esto llamaria a Microsoft Graph API
        String mockTeamsUrl = "https://teams.microsoft.com/l/meetup-join/19%3ameeting_" 
                + UUID.randomUUID().toString().replace("-", "") 
                + "%40thread.v2/0?context=%7b%22Tid%22%3a%22mock-tenant-id%22%2c%22Oid%22%3a%22mock-object-id%22%7d";
        sesion.setTeamsMeetingUrl(mockTeamsUrl);

        SesionTerapia saved = sesionRepository.save(sesion);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<SesionResponseDTO> obtenerMisSesiones(String userEmail) {
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        return sesionRepository.findByUsuarioIdOrderByFechaHoraDesc(usuario.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SesionResponseDTO mapToDTO(SesionTerapia sesion) {
        return new SesionResponseDTO(
                sesion.getId(),
                sesion.getUsuario().getId(),
                sesion.getUsuario().getNombres() + " " + sesion.getUsuario().getApellidos(),
                sesion.getProfesional().getId(),
                sesion.getProfesional().getUsuario().getNombres() + " " + sesion.getProfesional().getUsuario().getApellidos(),
                sesion.getFechaHora(),
                sesion.getEstado(),
                sesion.getTeamsMeetingUrl(),
                sesion.getNotas()
        );
    }
}
