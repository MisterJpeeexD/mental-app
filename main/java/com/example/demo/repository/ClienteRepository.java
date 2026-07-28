package com.example.demo.repository;

import com.example.demo.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByDireccion(String direccion);

    @Query("SELECT c FROM Cliente c WHERE c.nombre = :nombre")
    List<Cliente> buscarByNombre(@Param("nombre") String nombre);
}
