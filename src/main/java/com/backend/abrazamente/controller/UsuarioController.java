package com.backend.abrazamente.controller;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;
import com.backend.abrazamente.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    @PostMapping
    public UsuarioResponseDTO crearUsuario(@Valid @RequestBody UsuarioRequestDTO request){
        return service.crearUsuario(request);
    }

    @GetMapping
    public List<UsuarioResponseDTO> obtenerUsuarios(){
        return service.obtenerUsuarios();
    }

    @GetMapping("/{id_usuario}")
    public UsuarioResponseDTO usuarioById(@PathVariable Long id_usuario){
        return service.usuarioById(id_usuario);
    }

    @PutMapping("/{id_usuario}")
    public UsuarioResponseDTO
    actualizarUsuario(@PathVariable Long id_usuario, @RequestBody UsuarioRequestDTO request){
        return service.actualizarUsuario(id_usuario,request);
    }

    @DeleteMapping("/{id_usuario}")
    public UsuarioResponseDTO eliminarUsuario(@PathVariable Long id_usuario){
        return service.eliminarUsuario(id_usuario);
    }

    @GetMapping("/nombres/{nombre}")
    public List<UsuarioResponseDTO> ListaPorNombres(@PathVariable String nombre){
        return service.buscarByNombre(nombre);
    }

    @GetMapping("/direcciones/{direccion}")
    public List<UsuarioResponseDTO> ListaPorDireccion(@PathVariable String direccion){
        return service.findByDireccion(direccion);
    }
}