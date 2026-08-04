-- V5__Full_Comprehensive_Data_Seed.sql
-- Poblamiento completo por comandos SQL sin omitir columnas ni filas

-- 1. Asegurar Roles
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'ROLE_USUARIO', 'Usuario estandar paciente o cliente'),
(2, 'ROLE_ADMIN', 'Administrador del sistema Abrazamente'),
(3, 'ROLE_PROFESIONAL', 'Profesional terapeuta o psicologo certificado')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Asegurar Usuarios
INSERT INTO usuarios (id, email, password_hash, run, nombres, apellidos, fecha_nacimiento, genero, estado_civil, ciudad, telefono, bio, estado) VALUES
(1, 'admin@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '11.111.111-1', 'Administrador', 'Sistema', '1990-01-01', 'Otro', 'Soltero/a', 'Santiago', '+56 9 1111 2222', 'Cuenta administrativa principal de AbrazaMente.', 'activo'),
(2, 'paciente.demostrativo@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '12.345.678-9', 'Ricardo', 'Sanhueza', '1996-08-15', 'Masculino', 'Soltero/a', 'Concepción', '+56 9 1234 5678', 'Usuario en seguimiento de salud mental y bienestar emocional.', 'activo'),
(201, 'daniela.rojas@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '15.432.109-8', 'Daniela', 'Rojas', '1988-04-12', 'Femenino', 'Soltero/a', 'Santiago', '+56 9 8765 4321', 'Dra. en Psicología Clínica especialista en regulación del estrés.', 'activo'),
(202, 'carlos.mendez@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '14.987.654-3', 'Carlos', 'Méndez', '1984-11-23', 'Masculino', 'Casado/a', 'Concepción', '+56 9 7654 3210', 'Psicólogo Sistémico enfocado en terapia de pareja y duelos.', 'activo'),
(203, 'sofia.vargas@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '16.123.456-7', 'Sofía', 'Vargas', '1991-09-05', 'Femenino', 'Soltero/a', 'Valparaíso', '+56 9 6543 2109', 'Lic. en Psicología Humanista experta en mindfulness y autoestima.', 'activo'),
(204, 'andres.morales@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '13.555.777-1', 'Andrés', 'Morales', '1980-02-18', 'Masculino', 'Casado/a', 'La Serena', '+56 9 5432 1098', 'Psiquiatra y Terapeuta Somático para regulación nerviosa.', 'activo')
ON CONFLICT (id) DO NOTHING;

-- 3. Asignación de Roles
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
(1, 2),
(2, 1),
(201, 3),
(202, 3),
(203, 3),
(204, 3)
ON CONFLICT DO NOTHING;

-- 4. Asegurar Especialidades
INSERT INTO especialidades (id, nombre, descripcion) VALUES
(1, 'Cognitivo-Conductual', 'Terapia enfocada en reestructuracion cognitiva y cambio conductual'),
(2, 'Terapia Sistemica', 'Abordaje de dinamicas familiares, de pareja y relacionales'),
(3, 'Crecimiento Personal', 'Enfoque humanista para desarrollo de potencial y autoestima'),
(4, 'Terapia Somatica', 'Regulacion neurobiologica e integracion cuerpo-mente')
ON CONFLICT (id) DO NOTHING;

-- 5. Asegurar Profesionales con 100% de Columnas
INSERT INTO profesionales (id, usuario_id, licencia_profesional, especialidad_principal_id, descripcion_profesional, es_voluntario, tarifa_sesion, biografia_profesional, anos_experiencia, idiomas, estado) VALUES
(11, 201, 'MED-CLI-98231', 1, 'Psicología Clínica y TCC', false, 45000.00, 'Dra. en Psicología con más de 10 años acompañando pacientes con cuadros ansiosos.', 10, 'Español, Inglés', 'activo'),
(12, 202, 'PSI-SIST-54123', 2, 'Terapia Sistémica de Pareja', false, 50000.00, 'Terapeuta familiar y de pareja enfocado en comunicación no violenta y duelos.', 12, 'Español', 'activo'),
(13, 203, 'PSI-HUM-77612', 3, 'Psicología Humanista y Mindfulness', false, 40000.00, 'Especialista en desarrollo personal, autoestima y prácticas meditativas.', 8, 'Español, Francés', 'activo'),
(14, 204, 'MED-PSI-33219', 4, 'Psiquiatría y Terapia Somática', false, 60000.00, 'Médico psiquiatra enfocado en regulación somática del trauma y neurobiología.', 15, 'Español, Inglés', 'activo')
ON CONFLICT (id) DO NOTHING;

-- 6. Foros Temáticos Completo
INSERT INTO foros_tematicos (id, nombre, descripcion, categoria, reglas_moderacion, estado, numero_miembros) VALUES
(1, 'Ansiedad y Crisis de Pánico', 'Estrategias de regulación somática y contención emocional', 'Salud Mental', 'Respeto mutuo, 0 violencia y confidencialidad estricta', 'activo', 142),
(2, 'Depresión y Rumiación', 'Comprensión del estado de ánimo bajo y acompañamiento mutuo', 'Acompañamiento', 'Validación emocional y escucha empática sin juzgar', 'activo', 98),
(3, 'Autoestima y Amor Propio', 'Reestructuración cognitiva y hábitos de autocompasión', 'Bienestar', 'Compartir desde la vivencia personal respetuosa', 'activo', 185),
(4, 'Mindfulness y Meditación', 'Prácticas de atención plena y reducción de estrés', 'Mindfulness', 'Enfoque en salud y hábitos de presencia consciente', 'activo', 210),
(5, 'Relaciones y Vínculos Sanos', 'Límites personales, comunicación no violenta y parejas', 'Relaciones', 'Respetar la diversidad y libertad de elección personal', 'activo', 115),
(6, 'Insomnio y Descanso', 'Higiene del sueño, relajación muscular y rutina nocturna', 'Bienestar', 'Consejos prácticos sin prescribir medicamentos', 'activo', 88)
ON CONFLICT (id) DO NOTHING;

-- 7. Temas de Foro
INSERT INTO foro_temas (id, forum_id, usuario_id, titulo, contenido, numero_respuestas, vistas) VALUES
(1, 1, 2, '¿Cómo manejan la taquicardia cuando aparece de repente?', 'Llevo un par de semanas donde siento palpitaciones repentinas en el trabajo. ¿Algún ejercicio práctico que les sirva en el momento?', 4, 320),
(2, 3, 2, 'Aprender a decir NO sin sentir culpa', 'Me cuesta mucho poner límites a mis compañeros y amigos por miedo a caer mal. ¿Alguien ha superado esto?', 6, 450)
ON CONFLICT (id) DO NOTHING;

-- 8. Respuestas de Foro
INSERT INTO foro_respuestas (id, tema_id, usuario_id, contenido, es_solucion, numero_votos_positivos) VALUES
(1, 1, 201, 'Hola Ricardo. La respiración 4-7-8 ayuda mucho a activar el nervio vago y desacelerar las palpitaciones en menos de 2 minutos.', true, 12),
(2, 2, 203, 'Poner límites no es rechazar al otro, es cuidar de ti mismo. Comienza practicando con cosas pequeñas.', true, 18)
ON CONFLICT (id) DO NOTHING;

-- 9. Sesiones de Terapia
INSERT INTO sesiones_terapia (id, usuario_id, profesional_id, fecha_hora, estado, teams_meeting_url, notas) VALUES
(1, 2, 11, CURRENT_TIMESTAMP + INTERVAL '2 days', 'CONFIRMADA', 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_mock_abrazamente', 'Primera sesión de diagnóstico y mapa de metas terapéuticas.'),
(2, 2, 13, CURRENT_TIMESTAMP + INTERVAL '7 days', 'PENDIENTE', 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_mock_abrazamente_2', 'Sesión de exploración de herramientas de mindfulness y autoestima.')
ON CONFLICT (id) DO NOTHING;
