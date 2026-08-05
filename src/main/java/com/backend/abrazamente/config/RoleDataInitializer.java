package com.backend.abrazamente.config;

import com.backend.abrazamente.model.Rol;
import com.backend.abrazamente.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements ApplicationRunner {

    private final RolRepository rolRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        rolRepository.findByNombre("usuario").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("usuario");
            rol.setDescripcion("Usuario regular de la plataforma");
            rol.setEstado("activo");
            return rolRepository.save(rol);
        });
    }
}
