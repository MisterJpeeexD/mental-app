package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Query Method
    List<Usuario> findByDireccion(String direccion);
    Optional<Usuario> findByCorreo(String correo);

    // Query
    @Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre")
    List<Usuario> buscarByNombre(@Param("nombre") String nombre);
}

