-- V3__Seed_Resources_And_Professionals.sql
-- Poblar categorias, recursos digitales y profesionales para consumo por API REST

-- 1. Insertar Categorias de Recursos
INSERT INTO categorias_recursos (id, nombre, descripcion) VALUES
(1, 'Ansiedad', 'Recursos enfocados en regulacion de ansiedad y ataques de panico'),
(2, 'Mindfulness', 'Meditacion guiada y atencion plena'),
(3, 'Autoestima', 'Trabajo personal de autoaceptacion y desarrollo'),
(4, 'Crisis', 'Protocolos urgentes de primeros auxilios emocionales'),
(5, 'Sueño', 'Higiene del sueño y combate al insomnio'),
(6, 'Burnout', 'Prevencion del agotamiento laboral y estres'),
(7, 'Relaciones', 'Vinculos, apego y comunicacion de pareja');

-- 2. Insertar Recursos Digitales
INSERT INTO recurso_digital (id, titulo, descripcion, tipo_contenido, autor, url_contenido, duracion_minutos, es_premium, vistas, estado) VALUES
(1, 'Episodio 12: Superando el Sindrome del Impostor', 'Conversacion profunda sobre la autoexigencia desmedida y reprogramacion de la voz critica interna.', 'podcasts', 'Dra. Camila Rojas & Lic. Andres Fuenzalida', 'https://open.spotify.com/show/4rOoJ6Egrf8K2I8jTFTT03', 32, false, 2890, 'activo'),
(2, 'Ansiedad, Calma y Regulacion Neurologica', 'Comprende como funciona tu nervio vago y como desacelerar el ritmo cardiaco.', 'podcasts', 'Lic. Rodrigo Vidal', 'https://open.spotify.com/show/3vB85R2S6xJ4xYQ30l16fG', 28, false, 3120, 'activo'),
(3, 'Relaciones Sanas y Vinculos de Apego Seguros', 'Claves para identificar patrones de comunicacion destructivos y construir limites saludables.', 'podcasts', 'Dra. Valentina Soto', 'https://open.spotify.com/show/4rOoJ6Egrf8K2I8jTFTT03', 40, false, 1940, 'activo'),

(4, 'Tecnica de Respiracion Guiada 4-7-8 en HD', 'Video guiado paso a paso para activar el sistema parasimpatico y conciliar el sueño.', 'videos', 'Lic. Fernanda Muñoz', 'https://www.youtube.com/watch?v=gz4G31LGyog', 10, false, 4420, 'activo'),
(5, 'Mindfulness para Reducir el Estres en 10 Minutos', 'Sesion practica de atencion plena para anclarte al momento presente.', 'videos', 'Lic. Ignacio Pardo', 'https://www.youtube.com/watch?v=inpok4MKVLM', 12, false, 3780, 'activo'),
(6, 'Grounding 5-4-3-2-1: Desconexion de Crisis', 'Ejercicio sensorial practico de 5 pasos para reenfocar tu atencion durante panico.', 'videos', 'Dra. Camila Rojas', 'https://www.youtube.com/watch?v=30VMIEmA114', 8, false, 5120, 'activo'),

(7, 'Manual de Terapia de Aceptacion y Compromiso (ACT)', 'Libro digital sobre la flexibilidad psicologica y la defusion cognitiva.', 'libros', 'Dra. Valentina Soto', 'https://abrazamente.cl/recursos/act-manual.pdf', 180, true, 1610, 'activo'),
(8, 'Reestructuracion Cognitiva: De la Teoria a la Practica', 'Guia teorica y practica para identificar distorsiones cognitivas como el catastrofismo.', 'libros', 'Lic. Martin Ibañez', 'https://abrazamente.cl/recursos/tcc-practica.pdf', 140, false, 2200, 'activo'),

(9, 'Guia Practica para la Gestion Integral de Ansiedad', 'Manual estructurado con registros diarios, escala de angustia y herramientas TCC.', 'guia', 'Equipo Clinico AbrazaMente', 'https://abrazamente.cl/recursos/guia-ansiedad.pdf', 25, false, 3450, 'activo'),
(10, 'Plan de Accion Emocional Frente al Burnout Laboral', 'Estrategias organizacionales y personales para prevenir el agotamiento extremo.', 'guia', 'Dra. Josefina Herrera', 'https://abrazamente.cl/recursos/burnout-plan.pdf', 20, false, 2980, 'activo'),

(11, 'Protocolo de Emergencia: Desescalada Emocional', 'Pasos urgentes para contencion emocional en momentos de desbordamiento de rabia o angustia.', 'protocolo', 'Lic. Rodrigo Vidal', 'https://abrazamente.cl/recursos/protocolo-desescalada.pdf', 10, false, 4890, 'activo'),
(12, 'Protocolo Clinico de Higiene del Sueño e Insomnio', 'Pautas basadas en evidencia para reacondicionar la asociacion cama-sueño.', 'protocolo', 'Dra. Fernanda Muñoz', 'https://abrazamente.cl/recursos/higiene-sueno.pdf', 15, false, 3820, 'activo');

-- 3. Mapear Recursos a Categorias (Tags)
INSERT INTO recurso_categoria (recurso_id, categoria_id) VALUES
(1, 3), (1, 6),
(2, 1), (2, 2),
(3, 7),
(4, 1), (4, 2), (4, 5),
(5, 2), (5, 6),
(6, 1), (6, 4),
(7, 3),
(8, 1),
(9, 1),
(10, 6),
(11, 4), (11, 1),
(12, 5);

-- 4. Insertar Usuarios para Profesionales
INSERT INTO usuarios (id, email, password_hash, run, nombres, apellidos, genero, bio, estado) VALUES
(101, 'camila.rojas@abrazamente.cl', '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra', '15.234.567-8', 'Camila', 'Rojas', 'Mujer', 'Especialista en manejo de ansiedad y estrés con enfoque practico y basado en evidencia.', 'activo'),
(102, 'andres.fuenzalida@abrazamente.cl', '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra', '16.345.678-9', 'Andres', 'Fuenzalida', 'Hombre', 'Enfocado en el crecimiento personal y la exploracion emocional.', 'activo'),
(103, 'valentina.soto@abrazamente.cl', '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra', '14.123.456-7', 'Valentina', 'Soto', 'Mujer', 'Trabaja con dinamicas familiares complejas, mediacion y resolucion de conflictos.', 'activo'),
(104, 'martin.ibanez@abrazamente.cl', '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra', '17.456.789-0', 'Martin', 'Ibañez', 'Hombre', 'Especialista en conflictos de pareja, comunicacion y reconstruccion de confianza.', 'activo'),
(105, 'fernanda.munoz@abrazamente.cl', '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra', '18.567.890-1', 'Fernanda', 'Muñoz', 'Mujer', 'Amplia experiencia en trastornos de ansiedad y tecnicas de respiracion.', 'activo'),
(106, 'ignacio.pardo@abrazamente.cl', '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra', '19.678.901-2', 'Ignacio', 'Pardo', 'Hombre', 'Trabaja con procesos de duelo, desmotivacion y episodios depresivos.', 'activo');

-- 5. Insertar Profesionales
INSERT INTO profesionales (id, usuario_id, licencia_profesional, especialidad_principal_id, descripcion_profesional, biografia_profesional, anos_experiencia, tarifa_sesion, estado) VALUES
(1, 101, 'PSI-45291', 1, 'Psicologia Clinica - Enfoque TCC', 'Especialista en manejo de ansiedad y estres con enfoque practico.', 8, 35000.00, 'activo'),
(2, 102, 'PSI-38290', 3, 'Psicologia Humanista y Crecimiento', 'Enfocado en el crecimiento personal y la exploracion emocional.', 6, 30000.00, 'activo'),
(3, 103, 'PSI-29182', 1, 'Terapia Familiar y Sistemica', 'Trabaja con dinamicas familiares complejas y resolucion de conflictos.', 10, 40000.00, 'activo'),
(4, 104, 'PSI-58291', 1, 'Terapia de Pareja y Relaciones', 'Especialista en conflictos de pareja y reconstruccion de confianza.', 7, 35000.00, 'activo'),
(5, 105, 'PSI-61029', 1, 'Psicologia Clinica - Regulacion Emocional', 'Amplia experiencia en trastornos de ansiedad y tecnicas de respiracion.', 5, 32000.00, 'activo'),
(6, 106, 'PSI-49201', 1, 'Psicologia Clinica - Procesos de Duelo', 'Trabaja con procesos de duelo, desmotivacion y episodios depresivos.', 9, 38000.00, 'activo');
