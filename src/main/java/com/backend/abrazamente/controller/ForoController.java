package com.backend.abrazamente.controller;

import com.backend.abrazamente.dto.ForoResumenDTO;
import com.backend.abrazamente.dto.ForoTemaPublicoDTO;
import com.backend.abrazamente.dto.ForoTematicoPublicoDTO;
import com.backend.abrazamente.dto.UsuarioPublicoDTO;
import com.backend.abrazamente.model.ForoTema;
import com.backend.abrazamente.model.ForoTematico;
import com.backend.abrazamente.repository.ForoTemaRepository;
import com.backend.abrazamente.repository.ForoTematicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foros")
@RequiredArgsConstructor
public class ForoController {

    private final ForoTematicoRepository foroTematicoRepository;
    private final ForoTemaRepository foroTemaRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ForoTematicoPublicoDTO>> obtenerTodosForos() {
        List<ForoTematicoPublicoDTO> resultado = foroTematicoRepository.findAll()
                .stream()
                .map(this::toPublicoDTO)
                .toList();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{forumId}/temas")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ForoTemaPublicoDTO>> obtenerTemasPorForo(@PathVariable Integer forumId) {
        List<ForoTemaPublicoDTO> resultado = foroTemaRepository.findByForoId(forumId)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/temas/recientes")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ForoTemaPublicoDTO>> obtenerTemasRecientes() {
        List<ForoTemaPublicoDTO> resultado = foroTemaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(resultado);
    }

    private ForoTematicoPublicoDTO toPublicoDTO(ForoTematico f) {
        return new ForoTematicoPublicoDTO(
                f.getId(), f.getNombre(), f.getDescripcion(), f.getCategoria(),
                f.getReglasModeracion(), f.getNumeroMiembros());
    }

    private ForoTemaPublicoDTO toDTO(ForoTema t) {
        ForoResumenDTO foro = t.getForo() == null
                ? null
                : new ForoResumenDTO(t.getForo().getId(), t.getForo().getNombre());
        UsuarioPublicoDTO usuario = t.getUsuario() == null
                ? null
                : new UsuarioPublicoDTO(
                        t.getUsuario().getId(),
                        t.getUsuario().getNombres(),
                        t.getUsuario().getApellidos(),
                        t.getUsuario().getGenero());
        return new ForoTemaPublicoDTO(
                t.getId(), foro, usuario, t.getTitulo(), t.getContenido(),
                t.getNumeroRespuestas(), t.getVistas(), t.getFechaCreacion());
    }
}
