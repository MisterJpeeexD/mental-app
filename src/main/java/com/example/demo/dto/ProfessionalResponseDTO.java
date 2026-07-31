package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionalResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String descripcion;
    private String biografia;
    private boolean esVoluntario;
    private Integer anosExperiencia;
    private String idiomas;
    private String fotoUrl;
}
