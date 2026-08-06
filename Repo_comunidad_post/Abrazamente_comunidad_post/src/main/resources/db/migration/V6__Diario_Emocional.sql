-- V6__Diario_Emocional.sql
-- Diario emocional: una sola entrada por usuario y día (uk_usuario_fecha),
-- perteneciente siempre al usuario del token.

CREATE TABLE diario_emocional (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_entrada DATE NOT NULL,
    contenido TEXT NOT NULL,
    estado_privacidad VARCHAR(20) DEFAULT 'privado',
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_usuario_fecha UNIQUE (usuario_id, fecha_entrada)
);
