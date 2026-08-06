package com.backend.abrazamente.auth;

import com.backend.abrazamente.dto.UsuarioResponseDTO;

public record LoginResponseDTO(
        String token,
        String tokenType,
        long expiresIn,
        UsuarioResponseDTO usuario
) {
}
