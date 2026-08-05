package com.backend.abrazamente.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @RestController
    static class StubController {

        @GetMapping("/no-encontrado")
        public ResponseEntity<Void> noEncontrado() {
            throw new RecursoNoEncontradoException("No existe el recurso");
        }

        @GetMapping("/validacion")
        public ResponseEntity<Void> validacion() {
            throw new ValidacionNegocioException("El RUT ingresado no es válido");
        }

        @GetMapping("/conflicto")
        public ResponseEntity<Void> conflicto() {
            throw new ConflictoException("Ya existe una cuenta asociada a ese correo electrónico");
        }

        @GetMapping("/error")
        public ResponseEntity<Void> error() {
            throw new IllegalStateException("Detalle técnico interno");
        }

        @PostMapping("/validado")
        public ResponseEntity<Void> validado(@Valid @RequestBody DatoRequest request) {
            return ResponseEntity.ok().build();
        }

        record DatoRequest(@NotBlank(message = "El campo no puede estar vacío") String campo) {
        }
    }

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders
                .standaloneSetup(new StubController())
                .setValidator(validator)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void recursoNoEncontrado_responde404() throws Exception {
        mockMvc.perform(get("/no-encontrado"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("No existe el recurso"));
    }

    @Test
    void validacionNegocio_responde400() throws Exception {
        mockMvc.perform(get("/validacion"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("El RUT ingresado no es válido"));
    }

    @Test
    void conflicto_responde409() throws Exception {
        mockMvc.perform(get("/conflicto"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    @Test
    void validacionCampos_responde400ConErroresPorCampo() throws Exception {
        mockMvc.perform(post("/validado")
                        .contentType("application/json")
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.campo").value("El campo no puede estar vacío"));
    }

    @Test
    void errorInesperado_responde500SinFiltrarDetalles() throws Exception {
        mockMvc.perform(get("/error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("Ha ocurrido un error interno del servidor."));
    }
}
