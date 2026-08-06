package com.backend.abrazamente.controller;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.dto.UsuarioUpdateRequestDTO;
import com.backend.abrazamente.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(
            @Valid @RequestBody UsuarioRequestDTO request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuarioService.crearUsuario(request));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuarioPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(usuarioService.usuarioById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizarUsuario(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioUpdateRequestDTO request,
            Authentication authentication) {

        UsuarioResponseDTO usuarioObjetivo = usuarioService.usuarioById(id);

        boolean esAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!esAdmin &&
                !usuarioObjetivo.email().equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException(
                    "No puedes modificar el perfil de otro usuario");
        }

        return ResponseEntity.ok(
                usuarioService.actualizarUsuario(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(
            @PathVariable Integer id) {

        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nombres/{nombre}")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarPorNombre(
            @PathVariable String nombre) {

        return ResponseEntity.ok(
                usuarioService.buscarByNombre(nombre));
    }

    @GetMapping("/ciudades/{ciudad}")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarPorCiudad(
            @PathVariable String ciudad) {

        return ResponseEntity.ok(
                usuarioService.findByCiudad(ciudad));
    }

}