package com.example.demo.controller;

import com.example.demo.dto.GoogleAuthRequestDTO;
import com.example.demo.dto.GoogleAuthResponseDTO;
import com.example.demo.dto.GoogleClientConfigDTO;
import com.example.demo.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;
    private final String googleClientId;

    public GoogleAuthController(
            GoogleAuthService googleAuthService,
            @Value("${spring.google.client-id}") String googleClientId
    ) {
        this.googleAuthService = googleAuthService;
        this.googleClientId = googleClientId;
    }

    @GetMapping("/google/client-id")
    public ResponseEntity<GoogleClientConfigDTO> getGoogleClientId() {
        return ResponseEntity.ok(new GoogleClientConfigDTO(googleClientId));
    }

    @PostMapping("/google")
    public ResponseEntity<GoogleAuthResponseDTO> loginWithGoogle(
            @Valid @RequestBody GoogleAuthRequestDTO request
    ) {
        return ResponseEntity.ok(googleAuthService.loginOrRegister(request.getIdToken()));
    }
}
