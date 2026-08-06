package com.backend.abrazamente.controller;

import com.backend.abrazamente.dto.EspecialidadDTO;
import com.backend.abrazamente.dto.ProfesionalPublicoDTO;
import com.backend.abrazamente.dto.UsuarioPublicoDTO;
import com.backend.abrazamente.model.Profesional;
import com.backend.abrazamente.repository.ProfesionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalRepository profesionalRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProfesionalPublicoDTO>> obtenerTodos() {
        List<ProfesionalPublicoDTO> resultado = profesionalRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(resultado);
    }

    private ProfesionalPublicoDTO toDTO(Profesional p) {
        UsuarioPublicoDTO usuario = p.getUsuario() == null
                ? null
                : new UsuarioPublicoDTO(
                        p.getUsuario().getId(),
                        p.getUsuario().getNombres(),
                        p.getUsuario().getApellidos(),
                        p.getUsuario().getGenero());
        EspecialidadDTO especialidad = p.getEspecialidadPrincipal() == null
                ? null
                : new EspecialidadDTO(p.getEspecialidadPrincipal().getId(), p.getEspecialidadPrincipal().getNombre());
        return new ProfesionalPublicoDTO(
                p.getId(),
                p.getLicenciaProfesional(),
                p.getDescripcionProfesional(),
                p.getEsVoluntario(),
                p.getTarifaSesion(),
                p.getBiografiaProfesional(),
                p.getAnosExperiencia(),
                p.getIdiomas(),
                p.getEstado(),
                usuario,
                especialidad);
    }
}
