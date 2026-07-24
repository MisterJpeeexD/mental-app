package com.backend.abrazamente.exception;

import com.backend.abrazamente.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

public class GlobalExceptionHandler {



    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(RecursoNoEncontradoException ex){
        return ResponseEntity.status(404).body(new ErrorResponse(
                LocalDateTime.now(),
                404,
                ex.getMessage()
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(MethodArgumentNotValidException ex) {
        // Extrae el mensaje configurado en la anotación del DTO
        String mensajeError = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Error de validación en los campos");

        return ResponseEntity.badRequest().body(new ErrorResponse(
                LocalDateTime.now(),
                400,
                mensajeError
        ));
    }
}
