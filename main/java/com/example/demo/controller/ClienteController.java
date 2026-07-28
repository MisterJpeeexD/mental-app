package com.example.demo.controller;

import com.example.demo.dto.ClienteRequestDTO;
import com.example.demo.dto.ClienteResponseDTO;
import com.example.demo.service.ClienteService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@AllArgsConstructor
public class ClienteController {

    private final ClienteService service;

    @PostMapping
    public ClienteResponseDTO crearCliente(@RequestBody ClienteRequestDTO request) {
        return service.crearCliente(request);
    }

    @GetMapping
    public List<ClienteResponseDTO> obtenerClientes() {
        return service.obtenerClientes();
    }

    @GetMapping("/{id_cliente}")
    public ClienteResponseDTO clienteById(@PathVariable Long id_cliente) {
        return service.clienteById(id_cliente);
    }

    @PutMapping("/{id_cliente}")
    public ClienteResponseDTO actualizarCliente(@PathVariable Long id_cliente, @RequestBody ClienteRequestDTO request) {
        return service.actualizarCliente(id_cliente, request);
    }

    @DeleteMapping("/{id_cliente}")
    public ClienteResponseDTO eliminarCliente(@PathVariable Long id_cliente) {
        return service.eliminarCliente(id_cliente);
    }

    @GetMapping("/nombres/{nombre}")
    public List<ClienteResponseDTO> ListaPorNombres(@PathVariable String nombre) {
        return service.buscarByNombre(nombre);
    }

    @GetMapping("/direcciones/{direccion}")
    public List<ClienteResponseDTO> ListaPorDireccion(@PathVariable String direccion) {
        return service.findByDireccion(direccion);
    }
}
