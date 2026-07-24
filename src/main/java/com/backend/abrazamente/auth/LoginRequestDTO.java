package com.backend.abrazamente.auth;

public record LoginRequestDTO(
        String correo,
        String password
) {
}
