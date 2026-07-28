package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoogleAuthResponseDTO {
    private String token;
    private Long userId;
    private String email;
    private String nombres;
    private String apellidos;
    private boolean newUser;
}
