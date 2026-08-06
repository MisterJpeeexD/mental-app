package com.backend.abrazamente.controller;

import com.backend.abrazamente.model.ForoTema;
import com.backend.abrazamente.model.ForoTematico;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.dto.ForoTemaRequestDTO;
import com.backend.abrazamente.dto.ForoTemaResponseDTO;
import com.backend.abrazamente.repository.ForoTemaRepository;
import com.backend.abrazamente.repository.ForoTematicoRepository;
import com.backend.abrazamente.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foros")
@RequiredArgsConstructor
public class ForoController {

    private final ForoTematicoRepository foroTematicoRepository;
    private final ForoTemaRepository foroTemaRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<ForoTematico>> obtenerTodosForos() {
        return ResponseEntity.ok(foroTematicoRepository.findAll());
    }

    @GetMapping("/{forumId}/temas")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ForoTemaResponseDTO>> obtenerTemasPorForo(@PathVariable Integer forumId) {
        return ResponseEntity.ok(foroTemaRepository.findByForoId(forumId).stream().map(this::toResponse).toList());
    }

    @GetMapping("/temas/recientes")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ForoTemaResponseDTO>> obtenerTemasRecientes() {
        return ResponseEntity.ok(foroTemaRepository.findAll().stream().map(this::toResponse).toList());
    }

    @PostMapping("/temas")
    @Transactional
    public ResponseEntity<ForoTemaResponseDTO> crearTema(
            @Valid @RequestBody ForoTemaRequestDTO request,
            Authentication authentication
    ) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado"));
        ForoTematico foro = foroTematicoRepository.findById(request.foroId())
                .orElseThrow(() -> new IllegalArgumentException("La temática seleccionada no existe"));

        ForoTema tema = new ForoTema();
        tema.setForo(foro);
        tema.setUsuario(usuario);
        tema.setTitulo(request.titulo().trim());
        tema.setContenido(request.contenido().trim());
        tema.setAnonimo(request.anonimo());
        tema.setNumeroRespuestas(0);
        tema.setVistas(0);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(foroTemaRepository.save(tema)));
    }

    @DeleteMapping("/temas/{id}")
    @Transactional
    public ResponseEntity<Void> eliminarTema(@PathVariable Integer id, Authentication authentication) {
        ForoTema tema = foroTemaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La publicación no existe"));
        if (!tema.getUsuario().getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException("Solo puedes eliminar tus propias publicaciones");
        }
        foroTemaRepository.delete(tema);
        return ResponseEntity.noContent().build();
    }

    private ForoTemaResponseDTO toResponse(ForoTema tema) {
        String nombre = tema.isAnonimo() ? "Miembro anónimo" : tema.getUsuario().getNombres() + " " + tema.getUsuario().getApellidos();
        String iniciales = tema.isAnonimo() ? "" : (tema.getUsuario().getNombres().substring(0, 1) + tema.getUsuario().getApellidos().substring(0, 1)).toUpperCase();
        return new ForoTemaResponseDTO(
                tema.getId(), tema.getForo().getId(), tema.getForo().getNombre(), tema.getUsuario().getId(), nombre, iniciales,
                tema.getTitulo(), tema.getContenido(), tema.getNumeroRespuestas(), tema.getVistas(),
                tema.isAnonimo(), tema.getFechaCreacion());
    }
}
