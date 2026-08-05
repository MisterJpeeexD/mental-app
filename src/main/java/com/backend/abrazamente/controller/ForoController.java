package com.backend.abrazamente.controller;

import com.backend.abrazamente.model.ForoTema;
import com.backend.abrazamente.model.ForoTematico;
import com.backend.abrazamente.repository.ForoTemaRepository;
import com.backend.abrazamente.repository.ForoTematicoRepository;
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

    @GetMapping
    public ResponseEntity<List<ForoTematico>> obtenerTodosForos() {
        return ResponseEntity.ok(foroTematicoRepository.findAll());
    }

    @GetMapping("/{forumId}/temas")
    public ResponseEntity<List<ForoTema>> obtenerTemasPorForo(@PathVariable Integer forumId) {
        return ResponseEntity.ok(foroTemaRepository.findByForoId(forumId));
    }

    @GetMapping("/temas/recientes")
    public ResponseEntity<List<ForoTema>> obtenerTemasRecientes() {
        return ResponseEntity.ok(foroTemaRepository.findAll());
    }
}
