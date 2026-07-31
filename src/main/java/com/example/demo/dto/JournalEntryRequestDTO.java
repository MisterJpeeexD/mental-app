package com.example.demo.dto;

import com.example.demo.model.enums.PrivacyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryRequestDTO {

    @NotBlank(message = "Contenido is required")
    private String contenido;

    @NotNull(message = "Estado de privacidad is required")
    private PrivacyStatus estadoPrivacidad;
}
