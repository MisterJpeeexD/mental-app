package com.example.demo.mapper;

import com.example.demo.dto.ProfessionalResponseDTO;
import com.example.demo.model.Professional;

import java.util.List;
import java.util.stream.Collectors;

public class ProfessionalMapper {

    public static ProfessionalResponseDTO toResponseDTO(Professional professional) {
        if (professional == null) {
            return null;
        }
        return ProfessionalResponseDTO.builder()
                .id(professional.getId())
                .nombre(professional.getUser() != null ? professional.getUser().getNombres() : "Profesional")
                .apellido(professional.getUser() != null ? professional.getUser().getApellidos() : "")
                .descripcion(professional.getDescripcionProfesional())
                .biografia(professional.getBiografiaProfesional())
                .esVoluntario(professional.isEsVoluntario())
                .anosExperiencia(professional.getAnosExperiencia())
                .idiomas(professional.getIdiomas())
                .fotoUrl(professional.getFotoProfesionalUrl())
                .build();
    }

    public static List<ProfessionalResponseDTO> toResponseDTOList(List<Professional> professionals) {
        if (professionals == null) {
            return null;
        }
        return professionals.stream()
                .map(ProfessionalMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
