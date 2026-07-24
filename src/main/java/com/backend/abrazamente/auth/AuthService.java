package com.backend.abrazamente.auth;

import com.backend.abrazamente.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private AuthenticationManager authenticationManager;

    public LoginResponseDTO login(LoginRequestDTO request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correo(),request.password())
        );
        String token = jwtService.generateToken(request.correo());
        return new LoginResponseDTO(token);
    }

}
