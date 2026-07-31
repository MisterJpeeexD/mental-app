package com.example.demo.mapper;

import com.example.demo.dto.JournalEntryResponseDTO;
import com.example.demo.model.JournalEntry;

import java.util.List;
import java.util.stream.Collectors;

public class JournalEntryMapper {

    public static JournalEntryResponseDTO toResponseDTO(JournalEntry entry) {
        if (entry == null) {
            return null;
        }
        return JournalEntryResponseDTO.builder()
                .id(entry.getId())
                .fechaEntrada(entry.getFechaEntrada())
                .contenido(entry.getContenido())
                .estadoPrivacidad(entry.getEstadoPrivacidad())
                .creadoEn(entry.getCreadoEn())
                .actualizadoEn(entry.getActualizadoEn())
                .build();
    }

    public static List<JournalEntryResponseDTO> toResponseDTOList(List<JournalEntry> entries) {
        if (entries == null) {
            return null;
        }
        return entries.stream()
                .map(JournalEntryMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
