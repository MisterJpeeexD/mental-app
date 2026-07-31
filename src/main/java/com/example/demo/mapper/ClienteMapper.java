package com.example.demo.mapper;

import com.example.demo.dto.ClienteRequestDTO;
import com.example.demo.dto.ClienteResponseDTO;
import com.example.demo.model.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toModel(ClienteRequestDTO request) {
        if (request == null) {
            return null;
        }
        Cliente cliente = new Cliente();
        cliente.setNombre(request.nombre());
        cliente.setApellido(request.apellido());
        cliente.setDireccion(request.direccion());
        cliente.setCorreo(request.correo());
        cliente.setTelefono(request.telefono());
        return cliente;
    }

    public ClienteResponseDTO toDTO(Cliente cliente) {
        if (cliente == null) {
            return null;
        }
        return ClienteResponseDTO.builder()
                .id_cliente(cliente.getId_cliente())
                .nombre(cliente.getNombre())
                .correo(cliente.getCorreo())
                .build();
    }
}
