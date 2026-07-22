package com.example.demo.dto;

import com.example.demo.model.enums.PrivacyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryResponseDTO {
    private Long id;
    private LocalDate fechaEntrada;
    private String contenido;
    private PrivacyStatus estadoPrivacidad;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
