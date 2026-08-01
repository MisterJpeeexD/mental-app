package com.backend.abrazamente.repository;

import com.backend.abrazamente.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Metodo con JOIN FETCH para solucionar el LazyInitializationException de los roles
    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.usuarioRoles ur LEFT JOIN FETCH ur.rol WHERE u.email = :email")
    Optional<Usuario> findByEmailWithRoles(@Param("email") String email);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByTelefono(String telefono);

    // 1. Metodo faltante para buscar por ciudad
    List<Usuario> findByCiudad(String ciudad);

    // 2. Query method para buscar por nombre o apellido
    @Query("SELECT u FROM Usuario u WHERE u.nombres LIKE %:nombre% OR u.apellidos LIKE %:nombre%")
    List<Usuario> buscarByNombre(@Param("nombre") String nombre);
}