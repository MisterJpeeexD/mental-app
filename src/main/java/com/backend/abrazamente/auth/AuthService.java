package com.backend.abrazamente.auth;

import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.mapper.UsuarioMapper;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.repository.UsuarioRepository;
import com.backend.abrazamente.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@AllArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        Usuario usuario = usuarioRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        usuario.setFechaUltimoLogin(OffsetDateTime.now());
        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(email);
        return new LoginResponseDTO(token, "Bearer", jwtService.getExpiration(), usuarioMapper.toDTO(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO obtenerUsuarioActual(String email) {
        Usuario usuario = usuarioRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        return usuarioMapper.toDTO(usuario);
    }
}
