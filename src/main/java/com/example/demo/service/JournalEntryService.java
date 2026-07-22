package com.example.demo.service;

import com.example.demo.dto.JournalEntryRequestDTO;
import com.example.demo.dto.JournalEntryResponseDTO;
import com.example.demo.mapper.JournalEntryMapper;
import com.example.demo.model.JournalEntry;
import com.example.demo.model.User;
import com.example.demo.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;

    public JournalEntryService(JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    public List<JournalEntryResponseDTO> getEntriesForUser(User user) {
        return JournalEntryMapper.toResponseDTOList(journalEntryRepository.findByUserId(user.getId()));
    }

    public JournalEntryResponseDTO createEntry(JournalEntryRequestDTO request, User user) {
        JournalEntry entry = new JournalEntry();
        entry.setUser(user);
        entry.setContenido(request.getContenido());
        entry.setEstadoPrivacidad(request.getEstadoPrivacidad());
        entry.setFechaEntrada(LocalDate.now());
        entry.setCreadoEn(LocalDateTime.now());
        entry.setActualizadoEn(LocalDateTime.now());

        JournalEntry saved = journalEntryRepository.save(entry);
        return JournalEntryMapper.toResponseDTO(saved);
    }
}
