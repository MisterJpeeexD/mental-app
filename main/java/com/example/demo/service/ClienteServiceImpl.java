package com.example.demo.service;

import com.example.demo.dto.ClienteRequestDTO;
import com.example.demo.dto.ClienteResponseDTO;
import com.example.demo.mapper.ClienteMapper;
import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository repository;
    private final ClienteMapper mapper;

    @Override
    public ClienteResponseDTO crearCliente(ClienteRequestDTO request) {
        Cliente cliente = mapper.toModel(request);
        Cliente saved = repository.save(cliente);
        return mapper.toDTO(saved);
    }

    @Override
    public List<ClienteResponseDTO> obtenerClientes() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public ClienteResponseDTO clienteById(Long id_cliente) {
        Cliente cliente = repository.findById(id_cliente)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return mapper.toDTO(cliente);
    }

    @Override
    public ClienteResponseDTO actualizarCliente(Long id_cliente, ClienteRequestDTO request) {
        Cliente cliente = repository.findById(id_cliente)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        cliente.setNombre(request.nombre());
        cliente.setApellido(request.apellido());
        cliente.setDireccion(request.direccion());
        cliente.setCorreo(request.correo());
        cliente.setTelefono(request.telefono());
        Cliente actualizado = repository.save(cliente);
        return mapper.toDTO(actualizado);
    }

    @Override
    public ClienteResponseDTO eliminarCliente(Long id_cliente) {
        Cliente cliente = repository.findById(id_cliente)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        repository.delete(cliente);
        return mapper.toDTO(cliente);
    }

    @Override
    public List<ClienteResponseDTO> findByDireccion(String direccion) {
        return repository.findByDireccion(direccion)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public List<ClienteResponseDTO> buscarByNombre(String nombre) {
        return repository.buscarByNombre(nombre)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}
