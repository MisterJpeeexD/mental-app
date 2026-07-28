package com.example.demo.controller;

import com.example.demo.dto.ProfessionalResponseDTO;
import com.example.demo.model.Professional;
import com.example.demo.model.enums.ProfessionalStatus;
import com.example.demo.repository.ProfessionalRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professionals")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ProfessionalController {

    private final ProfessionalRepository repository;

    @GetMapping
    public List<ProfessionalResponseDTO> getAllProfessionals() {
        return repository.findByEstado(ProfessionalStatus.ACTIVE).stream()
                .map(p -> ProfessionalResponseDTO.builder()
                        .id(p.getId())
                        .nombre(p.getUser() != null ? p.getUser().getNombres() : "Profesional")
                        .apellido(p.getUser() != null ? p.getUser().getApellidos() : "")
                        .descripcion(p.getDescripcionProfesional())
                        .biografia(p.getBiografiaProfesional())
                        .esVoluntario(p.isEsVoluntario())
                        .anosExperiencia(p.getAnosExperiencia())
                        .idiomas(p.getIdiomas())
                        .fotoUrl(p.getFotoProfesionalUrl())
                        .build())
                .collect(Collectors.toList());
    }
}
