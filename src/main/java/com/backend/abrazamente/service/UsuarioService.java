package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO crearUsuario(UsuarioRequestDTO request);
    List<UsuarioResponseDTO> obtenerUsuarios();
    UsuarioResponseDTO usuarioById(Long id_usuario);
    UsuarioResponseDTO actualizarUsuario(Long id_usuario, UsuarioRequestDTO dto);
    UsuarioResponseDTO eliminarUsuario(Long id_usuario);

    // Ambos ejemplos
    List<UsuarioResponseDTO> findByDireccion(String direccion);
    List<UsuarioResponseDTO> buscarByNombre(String nombre);

}