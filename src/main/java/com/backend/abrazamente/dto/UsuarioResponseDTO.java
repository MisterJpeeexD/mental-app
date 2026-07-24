// Lo que respondera el servidor

package com.backend.abrazamente.dto;

import lombok.Builder;

@Builder
public record UsuarioResponseDTO(
        Long id_usuario,
        String nombre,
        String correo
) {

}