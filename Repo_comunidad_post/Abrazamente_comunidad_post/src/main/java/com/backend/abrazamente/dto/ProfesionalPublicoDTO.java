package com.backend.abrazamente.dto;

import java.math.BigDecimal;

public record ProfesionalPublicoDTO(
        Integer id,
        String licenciaProfesional,
        String descripcionProfesional,
        Boolean esVoluntario,
        BigDecimal tarifaSesion,
        String biografiaProfesional,
        Integer anosExperiencia,
        String idiomas,
        String estado,
        UsuarioPublicoDTO usuario,
        EspecialidadDTO especialidadPrincipal
) {
}
