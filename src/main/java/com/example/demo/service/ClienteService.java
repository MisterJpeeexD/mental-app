package com.example.demo.service;

import com.example.demo.dto.ClienteRequestDTO;
import com.example.demo.dto.ClienteResponseDTO;

import java.util.List;

public interface ClienteService {
    ClienteResponseDTO crearCliente(ClienteRequestDTO request);
    List<ClienteResponseDTO> obtenerClientes();
    ClienteResponseDTO clienteById(Long id_cliente);
    ClienteResponseDTO actualizarCliente(Long id_cliente, ClienteRequestDTO request);
    ClienteResponseDTO eliminarCliente(Long id_cliente);
    List<ClienteResponseDTO> findByDireccion(String direccion);
    List<ClienteResponseDTO> buscarByNombre(String nombre);
}
