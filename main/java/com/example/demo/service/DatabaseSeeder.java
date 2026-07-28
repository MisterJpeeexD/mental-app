package com.example.demo.service;

import com.example.demo.model.Cliente;
import com.example.demo.model.Producto;
import com.example.demo.model.Professional;
import com.example.demo.model.User;
import com.example.demo.model.enums.Gender;
import com.example.demo.model.enums.ProfessionalStatus;
import com.example.demo.model.enums.UserStatus;
import com.example.demo.repository.ClienteRepository;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.ProfessionalRepository;
import com.example.demo.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed User 1 (Professional Laura Montes)
            User user1 = new User();
            user1.setEmail("laura.montes@menteconecta.cl");
            user1.setPasswordHash("$2a$10$xyz..."); // mock hash
            user1.setNombres("Laura");
            user1.setApellidos("Montes");
            user1.setFechaNacimiento(LocalDate.of(1985, 5, 20));
            user1.setGenero(Gender.FEMALE);
            user1.setEstadoCivil("Soltera");
            user1.setCiudad("Concepción");
            user1.setTelefono("+56912345678");
            user1.setEstado(UserStatus.ACTIVE);
            user1.setFechaCreacion(LocalDateTime.now());
            user1.setFechaActualizacion(LocalDateTime.now());
            User savedUser1 = userRepository.save(user1);

            Professional prof1 = new Professional();
            prof1.setUser(savedUser1);
            prof1.setLicenciaProfesional("REG-12345");
            prof1.setEspecialidadPrincipalId(1L);
            prof1.setDescripcionProfesional("Terapia Cognitivo Conductual");
            prof1.setBiografiaProfesional("Especialista en trastornos de ansiedad y pánico en adultos. Con más de 12 años de trayectoria clínica.");
            prof1.setEsVoluntario(false);
            prof1.setTarifaSesion(new BigDecimal("35000.00"));
            prof1.setAnosExperiencia(12);
            prof1.setIdiomas("Español, Inglés");
            prof1.setEstado(ProfessionalStatus.ACTIVE);
            prof1.setFechaRegistro(LocalDateTime.now());
            prof1.setFechaActualizacion(LocalDateTime.now());
            professionalRepository.save(prof1);

            // Seed User 2 (Professional Carlos Rivera)
            User user2 = new User();
            user2.setEmail("carlos.rivera@menteconecta.cl");
            user2.setPasswordHash("$2a$10$abc..."); // mock hash
            user2.setNombres("Carlos");
            user2.setApellidos("Rivera");
            user2.setFechaNacimiento(LocalDate.of(1990, 8, 12));
            user2.setGenero(Gender.MALE);
            user2.setEstadoCivil("Casado");
            user2.setCiudad("Santiago");
            user2.setTelefono("+56987654321");
            user2.setEstado(UserStatus.ACTIVE);
            user2.setFechaCreacion(LocalDateTime.now());
            user2.setFechaActualizacion(LocalDateTime.now());
            User savedUser2 = userRepository.save(user2);

            Professional prof2 = new Professional();
            prof2.setUser(savedUser2);
            prof2.setLicenciaProfesional("REG-67890");
            prof2.setEspecialidadPrincipalId(2L);
            prof2.setDescripcionProfesional("Terapia de Aceptación y Compromiso");
            prof2.setBiografiaProfesional("Terapeuta enfocado en flexibilidad psicológica, gestión del dolor crónico y transiciones difíciles de la vida.");
            prof2.setEsVoluntario(true);
            prof2.setTarifaSesion(new BigDecimal("0.00"));
            prof2.setAnosExperiencia(8);
            prof2.setIdiomas("Español");
            prof2.setEstado(ProfessionalStatus.ACTIVE);
            prof2.setFechaRegistro(LocalDateTime.now());
            prof2.setFechaActualizacion(LocalDateTime.now());
            professionalRepository.save(prof2);

            // Seed User 3 (Professional Sofía Valenzuela)
            User user3 = new User();
            user3.setEmail("sofia.valenzuela@menteconecta.cl");
            user3.setPasswordHash("$2a$10$def...");
            user3.setNombres("Sofía");
            user3.setApellidos("Valenzuela");
            user3.setFechaNacimiento(LocalDate.of(1988, 3, 15));
            user3.setGenero(Gender.FEMALE);
            user3.setEstado(UserStatus.ACTIVE);
            user3.setFechaCreacion(LocalDateTime.now());
            user3.setFechaActualizacion(LocalDateTime.now());
            User savedUser3 = userRepository.save(user3);

            Professional prof3 = new Professional();
            prof3.setUser(savedUser3);
            prof3.setLicenciaProfesional("REG-54321");
            prof3.setEspecialidadPrincipalId(3L);
            prof3.setDescripcionProfesional("Mindfulness y Estrés");
            prof3.setBiografiaProfesional("Instructora certificada en MBSR (Reducción del Estrés basada en Mindfulness) y terapia de compasión.");
            prof3.setEsVoluntario(false);
            prof3.setTarifaSesion(new BigDecimal("40000.00"));
            prof3.setAnosExperiencia(10);
            prof3.setIdiomas("Español");
            prof3.setEstado(ProfessionalStatus.ACTIVE);
            prof3.setFechaRegistro(LocalDateTime.now());
            prof3.setFechaActualizacion(LocalDateTime.now());
            professionalRepository.save(prof3);
        }

        if (clienteRepository.count() == 0) {
            Cliente cliente1 = new Cliente();
            cliente1.setNombre("Juan");
            cliente1.setApellido("Pérez");
            cliente1.setCorreo("juan.perez@example.com");
            cliente1.setTelefono("+56911112222");
            cliente1.setDireccion("Av. Providencia 1234, Santiago");
            clienteRepository.save(cliente1);

            Cliente cliente2 = new Cliente();
            cliente2.setNombre("María");
            cliente2.setApellido("González");
            cliente2.setCorreo("maria.gonzalez@example.com");
            cliente2.setTelefono("+56933334444");
            cliente2.setDireccion("Calle El Roble 567, Concepción");
            clienteRepository.save(cliente2);
        }

        if (productoRepository.count() == 0) {
            Producto prod1 = new Producto();
            prod1.setNombre("Guía de Meditación");
            prod1.setDescripcion("Guía digital descargable en PDF");
            prod1.setPrecio(4990.0);
            prod1.setStock(100);
            prod1.setCategoria("Libros");
            productoRepository.save(prod1);

            Producto prod2 = new Producto();
            prod2.setNombre("Difusor de Aromaterapia");
            prod2.setDescripcion("Difusor ultrasónico con luces LED");
            prod2.setPrecio(24990.0);
            prod2.setStock(15);
            prod2.setCategoria("Bienestar");
            productoRepository.save(prod2);

            Producto prod3 = new Producto();
            prod3.setNombre("Aceite Esencial de Lavanda");
            prod3.setDescripcion("Aceite puro 10ml para relajación");
            prod3.setPrecio(8990.0);
            prod3.setStock(45);
            prod3.setCategoria("Bienestar");
            productoRepository.save(prod3);
        }
    }
}
