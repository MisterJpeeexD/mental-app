package com.backend.abrazamente.service;

import com.backend.abrazamente.dto.UsuarioRequestDTO;
import com.backend.abrazamente.dto.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO crearUsuario(UsuarioRequestDTO request);
    List<UsuarioResponseDTO> obtenerUsuarios();
    UsuarioResponseDTO usuarioById(Integer id);
    UsuarioResponseDTO actualizarUsuario(Integer id, UsuarioRequestDTO dto);
    void eliminarUsuario(Integer id);

    List<UsuarioResponseDTO> findByCiudad(String ciudad);
    List<UsuarioResponseDTO> buscarByNombre(String nombre);
}