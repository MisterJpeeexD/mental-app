-- V4__Expand_Forums_And_Resources.sql
-- Ampliación de datos iniciales para foros, temas de debate, respuestas y recursos

-- 1. Insertar más Foros Temáticos
INSERT INTO foros_tematicos (id, nombre, descripcion, categoria, reglas_moderacion, estado, numero_miembros) VALUES
(4, 'Mindfulness y Meditación', 'Prácticas diarias de presencia plena y reducción del parloteo mental', 'Mindfulness', 'Respeto mutuo y cero comercialización', 'activo', 142),
(5, 'Relaciones y Vínculos', 'Espacio para conversar sobre apego, pareja y límites personales', 'Relaciones', 'Confidencialidad y cero juicio', 'activo', 98),
(6, 'Higiene del Sueño e Insomnio', 'Herramientas para combatir el insomnio y la ansiedad nocturna', 'Bienestar', 'Compartir desde la experiencia personal', 'activo', 215)
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar Temas de Debate en Foros
INSERT INTO foro_temas (id, forum_id, usuario_id, titulo, contenido, numero_respuestas, vistas) VALUES
(1, 1, 101, '¿Cómo manejan la opresión en el pecho durante una crisis de ansiedad?', 'Hola a todos, a veces siento que la respiración se me corta en el trabajo. Me gustaría saber qué técnicas corporales les han funcionado mejor.', 14, 380),
(2, 1, 102, 'Técnica de grounding 5-4-3-2-1: Mi experiencia práctica', 'Quería compartir que el ejercicio de nombrar 5 cosas que veo y 4 que toco me salvó en una reunión importante esta semana.', 8, 240),
(3, 2, 105, 'Pasos para salir de la rumiación cuando todo parece abrumador', 'La rumiación mental suele atraparnos en bucles de pensares pasados. Dejo aquí 3 preguntas clave para cuestionar pensamientos automáticos.', 19, 520),
(4, 3, 103, 'Aprender a decir NO sin sentir culpa: Un camino hacia la autoestima', 'Poner límites no es ser egoísta, es cuidar tu salud mental. Les comparto algunas frases asertivas para practicar.', 25, 680),
(5, 4, 106, 'Recomendaciones de aplicaciones y podcasts para meditar 10 min al día', '¿Alguien tiene recomendaciones de podcasts o audios para principiantes en atención plena?', 11, 310)
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar más Recursos Digitales en la Base de Datos
INSERT INTO recurso_digital (id, titulo, descripcion, tipo_contenido, autor, url_contenido, duracion_minutos, es_premium, vistas, estado) VALUES
(13, 'Episodio 08: Regulando las Emociones Intensas', 'Cómo afrontar la rabia, el miedo y la frustración sin actuar por impulso.', 'podcasts', 'Dra. Camila Rojas', 'https://open.spotify.com/show/4rOoJ6Egrf8K2I8jTFTT03', 25, false, 1890, 'activo'),
(14, 'Meditación de Escaneo Corporal (Body Scan) 15 Min', 'Audio de escaneo corporal para soltar contracturas de cuello y espalda.', 'podcasts', 'Lic. Fernanda Muñoz', 'https://open.spotify.com/show/3vB85R2S6xJ4xYQ30l16fG', 15, false, 2450, 'activo'),
(15, 'Taller en Video: Autocompasión frente al Fracaso', 'Sesión clínica en video sobre cómo responder a los errores con bondad propia.', 'videos', 'Lic. Ignacio Pardo', 'https://www.youtube.com/watch?v=inpok4MKVLM', 18, false, 3100, 'activo'),
(16, 'Guía Rápida de Desescalada de Ataques de Pánico', 'Manual de bolsillo descargable en PDF con pasos de contingencia inmediata.', 'guia', 'Equipo Clínico AbrazaMente', 'https://abrazamente.cl/recursos/desescalada-panico.pdf', 12, false, 4200, 'activo')
ON CONFLICT (id) DO NOTHING;

-- 4. Asignar Categorías a los Nuevos Recursos
INSERT INTO recurso_categoria (recurso_id, categoria_id) VALUES
(13, 1), (13, 3),
(14, 2), (14, 5),
(15, 3), (15, 6),
(16, 1), (16, 4)
ON CONFLICT DO NOTHING;
