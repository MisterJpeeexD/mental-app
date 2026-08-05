package com.backend.abrazamente.service;

import com.backend.abrazamente.model.RecursoDigital;
import com.backend.abrazamente.repository.RecursoDigitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecursoDigitalService {

    private final RecursoDigitalRepository recursoDigitalRepository;

    @Transactional(readOnly = true)
    public List<RecursoDigital> obtenerTodos() {
        return recursoDigitalRepository.findAll();
    }
}
