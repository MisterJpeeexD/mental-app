package com.backend.abrazamente;

import com.backend.abrazamente.validation.RutUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AbrazamenteApplicationTests {

    @Test
    void normalizaRutConPuntos() {
        assertEquals("11111111-1", RutUtils.normalizar("11.111.111-1"));
    }

    @Test
    void validaRutCorrecto() {
        assertTrue(RutUtils.esValido("11.111.111-1"));
    }

    @Test
    void rechazaRutIncorrecto() {
        assertFalse(RutUtils.esValido("11.111.111-2"));
    }
}
