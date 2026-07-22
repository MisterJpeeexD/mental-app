package com.example.demo.controller;

import com.example.demo.dto.JournalEntryRequestDTO;
import com.example.demo.dto.JournalEntryResponseDTO;
import com.example.demo.security.service.CustomUserDetails;
import com.example.demo.service.JournalEntryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class JournalEntryController {

    private final JournalEntryService journalEntryService;

    @GetMapping
    public ResponseEntity<List<JournalEntryResponseDTO>> getAllEntries(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(journalEntryService.getEntriesForUser(userDetails.getUser()));
    }

    @PostMapping
    public ResponseEntity<JournalEntryResponseDTO> createEntry(
            @Valid @RequestBody JournalEntryRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        JournalEntryResponseDTO created = journalEntryService.createEntry(request, userDetails.getUser());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
