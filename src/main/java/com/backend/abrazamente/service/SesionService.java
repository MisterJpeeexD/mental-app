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
    private final TeamsMeetingService teamsMeetingService;

    @Transactional
    public SesionResponseDTO agendarSesion(String userEmail, SesionRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        Profesional profesional = profesionalRepository.findById(request.profesionalId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesional no encontrado"));

        SesionTerapia sesion = new SesionTerapia();
        sesion.setUsuario(usuario);
        sesion.setProfesional(profesional);
        sesion.setFechaHora(request.fechaHora());
        sesion.setNotas(request.notas());
        sesion.setEstado("PENDIENTE");
        
        // Llamada real al servicio de integracion con Teams
        String titulo = "Sesión Terapéutica - " + usuario.getNombres() + " y " + profesional.getUsuario().getNombres();
        String teamsUrl = teamsMeetingService.createMeeting(titulo, request.fechaHora(), request.fechaHora().plusHours(1));
        
        sesion.setTeamsMeetingUrl(teamsUrl);

        SesionTerapia saved = sesionRepository.save(sesion);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<SesionResponseDTO> obtenerMisSesiones(String userEmail) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(userEmail)
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
