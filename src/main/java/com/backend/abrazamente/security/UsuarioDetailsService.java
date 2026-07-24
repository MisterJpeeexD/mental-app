package com.backend.abrazamente.security;

import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws RecursoNoEncontradoException {
        Usuario usuario = repository.findByCorreo(username).orElseThrow(()-> new RecursoNoEncontradoException("Usuario no encontrado"));
        return new UsuarioDetails(usuario);
    }


}
