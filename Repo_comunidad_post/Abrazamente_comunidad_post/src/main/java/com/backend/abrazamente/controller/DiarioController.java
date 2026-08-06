package com.backend.abrazamente.controller;

import com.backend.abrazamente.dto.DiarioRequestDTO;
import com.backend.abrazamente.dto.DiarioResponseDTO;
import com.backend.abrazamente.exception.RecursoNoEncontradoException;
import com.backend.abrazamente.exception.ValidacionNegocioException;
import com.backend.abrazamente.model.DiarioEmocional;
import com.backend.abrazamente.model.Usuario;
import com.backend.abrazamente.repository.DiarioEmocionalRepository;
import com.backend.abrazamente.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Diario emocional. Toda operación se acota al usuario del token: no existe
 * endpoint para leer, escribir ni borrar el diario de otra persona, y el id de
 * usuario jamás se lee del cuerpo ni de la URL. El DTO de respuesta tampoco
 * expone datos del usuario propietario.
 */
@RestController
@RequestMapping("/api/diario")
@RequiredArgsConstructor
public class DiarioController {

    private final DiarioEmocionalRepository diarioRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario usuarioAutenticado(Authentication authentication) {
        return usuarioRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    private DiarioResponseDTO aDTO(DiarioEmocional entrada) {
        return DiarioResponseDTO.builder()
                .id(entrada.getId())
                .contenido(entrada.getContenido())
                .fechaEntrada(entrada.getFechaEntrada())
                .estadoPrivacidad(entrada.getEstadoPrivacidad())
                .creadoEn(entrada.getCreadoEn())
                .build();
    }

    @GetMapping
    public ResponseEntity<List<DiarioResponseDTO>> listar(Authentication authentication) {
        Integer usuarioId = usuarioAutenticado(authentication).getId();
        return ResponseEntity.ok(
                diarioRepository.findByUsuarioIdOrderByFechaEntradaDesc(usuarioId)
                        .stream().map(this::aDTO).toList()
        );
    }

    /**
     * La tabla admite una sola entrada por día (uk_usuario_fecha), así que
     * volver a guardar el mismo día actualiza la entrada en vez de fallar.
     */
    @PostMapping
    public ResponseEntity<DiarioResponseDTO> guardar(@Valid @RequestBody DiarioRequestDTO request,
                                                     Authentication authentication) {
        Usuario usuario = usuarioAutenticado(authentication);
        LocalDate fecha = request.fechaEntrada() != null ? request.fechaEntrada() : LocalDate.now();
        if (fecha.isAfter(LocalDate.now())) {
            throw new ValidacionNegocioException("La fecha de la entrada no puede ser futura");
        }

        DiarioEmocional entrada = diarioRepository
                .findByUsuarioIdAndFechaEntrada(usuario.getId(), fecha)
                .orElseGet(() -> {
                    DiarioEmocional nueva = new DiarioEmocional();
                    nueva.setUsuario(usuario);
                    nueva.setFechaEntrada(fecha);
                    return nueva;
                });

        entrada.setContenido(request.contenido().trim());
        // La privacidad la decide el servidor: el diario es siempre privado
        entrada.setEstadoPrivacidad("privado");

        boolean esNueva = entrada.getId() == null;
        DiarioEmocional guardada = diarioRepository.save(entrada);
        return ResponseEntity.status(esNueva ? HttpStatus.CREATED : HttpStatus.OK).body(aDTO(guardada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id, Authentication authentication) {
        Integer usuarioId = usuarioAutenticado(authentication).getId();
        DiarioEmocional entrada = diarioRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Entrada de diario no encontrada"));
        diarioRepository.delete(entrada);
        return ResponseEntity.noContent().build();
    }
}
