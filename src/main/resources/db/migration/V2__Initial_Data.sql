-- V2__Initial_Data.sql
-- Datos maestros para roles y configuraciones estáticas
-- NOTA: Los recursos y terapeutas se poblarán mediante API externas y flujos de registro.

-- Insertar roles básicos del sistema
-- Nombres canónicos SIN prefijo ROLE_: la capa de seguridad los expone como
-- ROLE_USUARIO / ROLE_PROFESIONAL / ROLE_ADMIN, y UsuarioServiceImpl busca el
-- rol base por "usuario". Así registro y hasRole() quedan consistentes.
INSERT INTO roles (nombre, descripcion, permisos_json, estado) VALUES
('usuario', 'Usuario estándar o paciente de la plataforma', '{"read": true, "write": true}', 'activo'),
('profesional', 'Especialista en salud mental', '{"read": true, "write": true, "manage_sessions": true}', 'activo'),
('admin', 'Administrador del sistema Abrazamente', '{"admin": true}', 'activo');

-- Insertar especialidades médicas base
INSERT INTO especialidades (nombre, descripcion) VALUES
('Psicología Clínica', 'Evaluación, diagnóstico y tratamiento de trastornos psicológicos'),
('Psiquiatría', 'Especialidad médica dedicada al estudio y tratamiento de enfermedades mentales'),
('Terapias Complementarias', 'Mindfulness, Yoga, etc.');

-- Insertar foros temáticos base
INSERT INTO foros_tematicos (nombre, descripcion, categoria, reglas_moderacion, estado) VALUES
('Ansiedad y Estrés', 'Espacio para compartir experiencias sobre manejo del estrés', 'General', 'Respeto mutuo y cero spam', 'activo'),
('Depresión y Ánimo', 'Grupo de apoyo para momentos difíciles', 'Apoyo Emocional', 'Empatía y confidencialidad', 'activo'),
('Desarrollo Personal', 'Hábitos, autoestima y metas', 'Crecimiento', 'Aportar valor y no juzgar', 'activo');
