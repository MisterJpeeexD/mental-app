-- V5__Full_Comprehensive_Data_Seed.sql
-- Poblamiento completo por comandos SQL sin omitir columnas ni filas
-- NOTA: se usa INSERT ... SELECT ... WHERE NOT EXISTS (en vez de ON CONFLICT, que
-- H2 no soporta) para que la migración sea idempotente y corra igual en H2 y PostgreSQL.

-- 1. Asegurar Roles
-- Nombres canónicos alineados con V2 (id 1=usuario, 2=profesional, 3=admin).
INSERT INTO roles (id, nombre, descripcion)
SELECT v.id, v.nombre, v.descripcion
FROM (VALUES
  (1, 'usuario', 'Usuario estandar paciente o cliente'),
  (2, 'profesional', 'Profesional terapeuta o psicologo certificado'),
  (3, 'admin', 'Administrador del sistema Abrazamente')
) AS v(id, nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM roles t WHERE t.id = v.id);

-- 2. Asegurar Usuarios
-- Los hashes de id 1 y 2 se corrigen en V7 (contraseñas demo conocidas).
INSERT INTO usuarios (id, email, password_hash, run, nombres, apellidos, fecha_nacimiento, genero, estado_civil, ciudad, telefono, bio, estado)
SELECT v.id, v.email, v.password_hash, v.run, v.nombres, v.apellidos, v.fecha_nacimiento, v.genero, v.estado_civil, v.ciudad, v.telefono, v.bio, v.estado
FROM (VALUES
  (1, 'admin@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '11.111.111-1', 'Administrador', 'Sistema', '1990-01-01', 'Otro', 'Soltero/a', 'Santiago', '+56 9 1111 2222', 'Cuenta administrativa principal de AbrazaMente.', 'activo'),
  (2, 'paciente.demostrativo@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '12.345.678-9', 'Ricardo', 'Sanhueza', '1996-08-15', 'Masculino', 'Soltero/a', 'Concepción', '+56 9 1234 5678', 'Usuario en seguimiento de salud mental y bienestar emocional.', 'activo'),
  (201, 'daniela.rojas@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '15.432.109-8', 'Daniela', 'Rojas', '1988-04-12', 'Femenino', 'Soltero/a', 'Santiago', '+56 9 8765 4321', 'Dra. en Psicología Clínica especialista en regulación del estrés.', 'activo'),
  (202, 'carlos.mendez@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '14.987.654-3', 'Carlos', 'Méndez', '1984-11-23', 'Masculino', 'Casado/a', 'Concepción', '+56 9 7654 3210', 'Psicólogo Sistémico enfocado en terapia de pareja y duelos.', 'activo'),
  (203, 'sofia.vargas@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '16.123.456-7', 'Sofía', 'Vargas', '1991-09-05', 'Femenino', 'Soltero/a', 'Valparaíso', '+56 9 6543 2109', 'Lic. en Psicología Humanista experta en mindfulness y autoestima.', 'activo'),
  (204, 'andres.morales@abrazamente.cl', '$2a$10$wE9lE78g1n.8gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7uO7gX9g/1q7', '13.555.777-1', 'Andrés', 'Morales', '1980-02-18', 'Masculino', 'Casado/a', 'La Serena', '+56 9 5432 1098', 'Psiquiatra y Terapeuta Somático para regulación nerviosa.', 'activo')
) AS v(id, email, password_hash, run, nombres, apellidos, fecha_nacimiento, genero, estado_civil, ciudad, telefono, bio, estado)
WHERE NOT EXISTS (SELECT 1 FROM usuarios t WHERE t.id = v.id);

-- 3. Asignación de Roles
-- rol_id: 1=usuario, 2=profesional, 3=admin (ids de V2/V5).
-- admin(1)->admin, paciente(2)->usuario, profesionales(201-204)->profesional.
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT v.usuario_id, v.rol_id
FROM (VALUES
  (1, 3),
  (2, 1),
  (201, 2),
  (202, 2),
  (203, 2),
  (204, 2)
) AS v(usuario_id, rol_id)
WHERE NOT EXISTS (SELECT 1 FROM usuario_roles t WHERE t.usuario_id = v.usuario_id AND t.rol_id = v.rol_id);

-- 4. Asegurar Especialidades
INSERT INTO especialidades (id, nombre, descripcion)
SELECT v.id, v.nombre, v.descripcion
FROM (VALUES
  (1, 'Cognitivo-Conductual', 'Terapia enfocada en reestructuracion cognitiva y cambio conductual'),
  (2, 'Terapia Sistemica', 'Abordaje de dinamicas familiares, de pareja y relacionales'),
  (3, 'Crecimiento Personal', 'Enfoque humanista para desarrollo de potencial y autoestima'),
  (4, 'Terapia Somatica', 'Regulacion neurobiologica e integracion cuerpo-mente')
) AS v(id, nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM especialidades t WHERE t.id = v.id);

-- 5. Asegurar Profesionales con 100% de Columnas
INSERT INTO profesionales (id, usuario_id, licencia_profesional, especialidad_principal_id, descripcion_profesional, es_voluntario, tarifa_sesion, biografia_profesional, anos_experiencia, idiomas, estado)
SELECT v.id, v.usuario_id, v.licencia_profesional, v.especialidad_principal_id, v.descripcion_profesional, v.es_voluntario, v.tarifa_sesion, v.biografia_profesional, v.anos_experiencia, v.idiomas, v.estado
FROM (VALUES
  (11, 201, 'MED-CLI-98231', 1, 'Psicología Clínica y TCC', false, 45000.00, 'Dra. en Psicología con más de 10 años acompañando pacientes con cuadros ansiosos.', 10, 'Español, Inglés', 'activo'),
  (12, 202, 'PSI-SIST-54123', 2, 'Terapia Sistémica de Pareja', false, 50000.00, 'Terapeuta familiar y de pareja enfocado en comunicación no violenta y duelos.', 12, 'Español', 'activo'),
  (13, 203, 'PSI-HUM-77612', 3, 'Psicología Humanista y Mindfulness', false, 40000.00, 'Especialista en desarrollo personal, autoestima y prácticas meditativas.', 8, 'Español, Francés', 'activo'),
  (14, 204, 'MED-PSI-33219', 4, 'Psiquiatría y Terapia Somática', false, 60000.00, 'Médico psiquiatra enfocado en regulación somática del trauma y neurobiología.', 15, 'Español, Inglés', 'activo')
) AS v(id, usuario_id, licencia_profesional, especialidad_principal_id, descripcion_profesional, es_voluntario, tarifa_sesion, biografia_profesional, anos_experiencia, idiomas, estado)
WHERE NOT EXISTS (SELECT 1 FROM profesionales t WHERE t.id = v.id);

-- 6. Foros Temáticos Completo
INSERT INTO foros_tematicos (id, nombre, descripcion, categoria, reglas_moderacion, estado, numero_miembros)
SELECT v.id, v.nombre, v.descripcion, v.categoria, v.reglas_moderacion, v.estado, v.numero_miembros
FROM (VALUES
  (1, 'Ansiedad y Crisis de Pánico', 'Estrategias de regulación somática y contención emocional', 'Salud Mental', 'Respeto mutuo, 0 violencia y confidencialidad estricta', 'activo', 142),
  (2, 'Depresión y Rumiación', 'Comprensión del estado de ánimo bajo y acompañamiento mutuo', 'Acompañamiento', 'Validación emocional y escucha empática sin juzgar', 'activo', 98),
  (3, 'Autoestima y Amor Propio', 'Reestructuración cognitiva y hábitos de autocompasión', 'Bienestar', 'Compartir desde la vivencia personal respetuosa', 'activo', 185),
  (4, 'Mindfulness y Meditación', 'Prácticas de atención plena y reducción de estrés', 'Mindfulness', 'Enfoque en salud y hábitos de presencia consciente', 'activo', 210),
  (5, 'Relaciones y Vínculos Sanos', 'Límites personales, comunicación no violenta y parejas', 'Relaciones', 'Respetar la diversidad y libertad de elección personal', 'activo', 115),
  (6, 'Insomnio y Descanso', 'Higiene del sueño, relajación muscular y rutina nocturna', 'Bienestar', 'Consejos prácticos sin prescribir medicamentos', 'activo', 88)
) AS v(id, nombre, descripcion, categoria, reglas_moderacion, estado, numero_miembros)
WHERE NOT EXISTS (SELECT 1 FROM foros_tematicos t WHERE t.id = v.id);

-- 7. Temas de Foro
INSERT INTO foro_temas (id, forum_id, usuario_id, titulo, contenido, numero_respuestas, vistas)
SELECT v.id, v.forum_id, v.usuario_id, v.titulo, v.contenido, v.numero_respuestas, v.vistas
FROM (VALUES
  (1, 1, 2, '¿Cómo manejan la taquicardia cuando aparece de repente?', 'Llevo un par de semanas donde siento palpitaciones repentinas en el trabajo. ¿Algún ejercicio práctico que les sirva en el momento?', 4, 320),
  (2, 3, 2, 'Aprender a decir NO sin sentir culpa', 'Me cuesta mucho poner límites a mis compañeros y amigos por miedo a caer mal. ¿Alguien ha superado esto?', 6, 450)
) AS v(id, forum_id, usuario_id, titulo, contenido, numero_respuestas, vistas)
WHERE NOT EXISTS (SELECT 1 FROM foro_temas t WHERE t.id = v.id);

-- 8. Respuestas de Foro
INSERT INTO foro_respuestas (id, tema_id, usuario_id, contenido, es_solucion, numero_votos_positivos)
SELECT v.id, v.tema_id, v.usuario_id, v.contenido, v.es_solucion, v.numero_votos_positivos
FROM (VALUES
  (1, 1, 201, 'Hola Ricardo. La respiración 4-7-8 ayuda mucho a activar el nervio vago y desacelerar las palpitaciones en menos de 2 minutos.', true, 12),
  (2, 2, 203, 'Poner límites no es rechazar al otro, es cuidar de ti mismo. Comienza practicando con cosas pequeñas.', true, 18)
) AS v(id, tema_id, usuario_id, contenido, es_solucion, numero_votos_positivos)
WHERE NOT EXISTS (SELECT 1 FROM foro_respuestas t WHERE t.id = v.id);

-- 9. Sesiones de Terapia
INSERT INTO sesiones_terapia (id, usuario_id, profesional_id, fecha_hora, estado, teams_meeting_url, notas)
SELECT v.id, v.usuario_id, v.profesional_id, v.fecha_hora, v.estado, v.teams_meeting_url, v.notas
FROM (VALUES
  (1, 2, 11, CURRENT_TIMESTAMP + INTERVAL '2' DAY, 'CONFIRMADA', 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_mock_abrazamente', 'Primera sesión de diagnóstico y mapa de metas terapéuticas.'),
  (2, 2, 13, CURRENT_TIMESTAMP + INTERVAL '7' DAY, 'PENDIENTE', 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_mock_abrazamente_2', 'Sesión de exploración de herramientas de mindfulness y autoestima.')
) AS v(id, usuario_id, profesional_id, fecha_hora, estado, teams_meeting_url, notas)
WHERE NOT EXISTS (SELECT 1 FROM sesiones_terapia t WHERE t.id = v.id);
