package com.example.demo.service;

import com.example.demo.dto.ProfessionalResponseDTO;
import com.example.demo.mapper.ProfessionalMapper;
import com.example.demo.model.enums.ProfessionalStatus;
import com.example.demo.repository.ProfessionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;

    public ProfessionalService(ProfessionalRepository professionalRepository) {
        this.professionalRepository = professionalRepository;
    }

    public List<ProfessionalResponseDTO> getActiveProfessionals() {
        return ProfessionalMapper.toResponseDTOList(
                professionalRepository.findByEstado(ProfessionalStatus.ACTIVE));
    }
}
