-- seed_complete.sql
-- Script de ejecucion manual para Neon PostgreSQL / SQL Editor
-- Llena el 100% de tablas y columnas con datos clinicos y de contenido real

-- 1. ROLES
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'ROLE_USUARIO', 'Usuario estandar paciente o cliente'),
(2, 'ROLE_ADMIN', 'Administrador del sistema Abrazamente'),
(3, 'ROLE_PROFESIONAL', 'Profesional terapeuta o psicologo certificado')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 2. USUARIOS
INSERT INTO usuarios (id, email, password_hash, run, nombres, apellidos, fecha_nacimiento, genero, estado_civil, ciudad, telefono, bio, estado) VALUES
(1, 'admin@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '11.111.111-1', 'Administrador', 'Sistema', '1990-01-01', 'Otro', 'Soltero/a', 'Santiago', '+56 9 1111 2222', 'Cuenta administrativa principal de AbrazaMente.', 'activo'),
(2, 'paciente.demostrativo@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '12.345.678-9', 'Ricardo', 'Sanhueza', '1996-08-15', 'Masculino', 'Soltero/a', 'Concepción', '+56 9 1234 5678', 'Usuario en seguimiento de salud mental y bienestar emocional.', 'activo'),
(201, 'daniela.rojas@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '15.432.109-8', 'Daniela', 'Rojas', '1988-04-12', 'Femenino', 'Soltero/a', 'Santiago', '+56 9 8765 4321', 'Dra. en Psicología Clínica especialista en regulación del estrés.', 'activo'),
(202, 'carlos.mendez@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '14.987.654-3', 'Carlos', 'Méndez', '1984-11-23', 'Masculino', 'Casado/a', 'Concepción', '+56 9 7654 3210', 'Psicólogo Sistémico enfocado en terapia de pareja y duelos.', 'activo'),
(203, 'sofia.vargas@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '16.123.456-7', 'Sofía', 'Vargas', '1991-09-05', 'Femenino', 'Soltero/a', 'Valparaíso', '+56 9 6543 2109', 'Lic. en Psicología Humanista experta en mindfulness y autoestima.', 'activo'),
(204, 'andres.morales@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '13.555.777-1', 'Andrés', 'Morales', '1980-02-18', 'Masculino', 'Casado/a', 'La Serena', '+56 9 5432 1098', 'Psiquiatra y Terapeuta Somático para regulación nerviosa.', 'activo')
ON CONFLICT (id) DO UPDATE SET nombres = EXCLUDED.nombres, apellidos = EXCLUDED.apellidos;

-- 3. USUARIO_ROLES
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
(1, 2),
(2, 1),
(201, 3),
(202, 3),
(203, 3),
(204, 3)
ON CONFLICT DO NOTHING;

-- 4. ESPECIALIDADES
INSERT INTO especialidades (id, nombre, descripcion) VALUES
(1, 'Cognitivo-Conductual', 'Terapia enfocada en reestructuracion cognitiva y cambio conductual'),
(2, 'Terapia Sistemica', 'Abordaje de dinamicas familiares, de pareja y relacionales'),
(3, 'Crecimiento Personal', 'Enfoque humanista para desarrollo de potencial y autoestima'),
(4, 'Terapia Somatica', 'Regulacion neurobiologica e integracion cuerpo-mente')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 5. PROFESIONALES (100% de columnas)
INSERT INTO profesionales (id, usuario_id, licencia_profesional, especialidad_principal_id, descripcion_profesional, es_voluntario, tarifa_sesion, biografia_profesional, anos_experiencia, idiomas, estado) VALUES
(11, 201, 'MED-CLI-98231', 1, 'Psicología Clínica y TCC', false, 45000.00, 'Dra. en Psicología con más de 10 años acompañando pacientes con cuadros ansiosos.', 10, 'Español, Inglés', 'activo'),
(12, 202, 'PSI-SIST-54123', 2, 'Terapia Sistémica de Pareja', false, 50000.00, 'Terapeuta familiar y de pareja enfocado en comunicación no violenta y duelos.', 12, 'Español', 'activo'),
(13, 203, 'PSI-HUM-77612', 3, 'Psicología Humanista y Mindfulness', false, 40000.00, 'Especialista en desarrollo personal, autoestima y prácticas meditativas.', 8, 'Español, Francés', 'activo'),
(14, 204, 'MED-PSI-33219', 4, 'Psiquiatría y Terapia Somática', false, 60000.00, 'Médico psiquiatra enfocado en regulación somática del trauma y neurobiología.', 15, 'Español, Inglés', 'activo')
ON CONFLICT (id) DO UPDATE SET licencia_profesional = EXCLUDED.licencia_profesional;

-- 6. FOROS TEMATICOS
INSERT INTO foros_tematicos (id, nombre, descripcion, categoria, reglas_moderacion, estado, numero_miembros) VALUES
(1, 'Ansiedad y Crisis de Pánico', 'Estrategias de regulación somática y contención emocional', 'Salud Mental', 'Respeto mutuo, 0 violencia y confidencialidad estricta', 'activo', 142),
(2, 'Depresión y Rumiación', 'Comprensión del estado de ánimo bajo y acompañamiento mutuo', 'Acompañamiento', 'Validación emocional y escucha empática sin juzgar', 'activo', 98),
(3, 'Autoestima y Amor Propio', 'Reestructuración cognitiva y hábitos de autocompasión', 'Bienestar', 'Compartir desde la vivencia personal respetuosa', 'activo', 185),
(4, 'Mindfulness y Meditación', 'Prácticas de atención plena y reducción de estrés', 'Mindfulness', 'Enfoque en salud y hábitos de presencia consciente', 'activo', 210),
(5, 'Relaciones y Vínculos Sanos', 'Límites personales, comunicación no violenta y parejas', 'Relaciones', 'Respetar la diversidad y libertad de elección personal', 'activo', 115),
(6, 'Insomnio y Descanso', 'Higiene del sueño, relajación muscular y rutina nocturna', 'Bienestar', 'Consejos prácticos sin prescribir medicamentos', 'activo', 88)
ON CONFLICT (id) DO UPDATE SET numero_miembros = EXCLUDED.numero_miembros;
