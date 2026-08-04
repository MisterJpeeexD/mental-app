-- V1__Initial_Schema.sql
-- Migración base para el esquema de la aplicación Abrazamente

-- 1. Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    run VARCHAR(12) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    estado_civil VARCHAR(50),
    ciudad VARCHAR(100),
    telefono VARCHAR(20),
    bio TEXT,
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_login TIMESTAMP WITH TIME ZONE
);

-- 2. Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos_json JSONB,
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Usuario_Roles
CREATE TABLE usuario_roles (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Especialidades
CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 5. Profesionales
CREATE TABLE profesionales (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    licencia_profesional VARCHAR(255),
    especialidad_principal_id INT REFERENCES especialidades(id) ON DELETE SET NULL,
    descripcion_profesional TEXT,
    es_voluntario BOOLEAN DEFAULT false,
    tarifa_sesion DECIMAL(10,2),
    biografia_profesional TEXT,
    anos_experiencia INT,
    idiomas VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Profesional_Especialidad
CREATE TABLE profesional_especialidad (
    profesional_id INT NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
    especialidad_id INT NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
    PRIMARY KEY (profesional_id, especialidad_id)
);

-- 7. Sesiones_Terapia
CREATE TABLE sesiones_terapia (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    profesional_id INT NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    teams_meeting_url VARCHAR(500),
    notas TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Categorias_Recursos
CREATE TABLE categorias_recursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT,
    icono_url VARCHAR(500)
);

-- 9. Recurso_Digital (Anotado en backend como RecursoDigital)
CREATE TABLE recurso_digital (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_contenido VARCHAR(20),
    autor VARCHAR(255),
    url_contenido VARCHAR(500),
    duracion_minutos INT,
    imagen_portada_url VARCHAR(500),
    es_premium BOOLEAN DEFAULT false,
    precio DECIMAL(10,2),
    codigo_afiliado VARCHAR(100),
    url_afiliado VARCHAR(500),
    vistas INT DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Recurso_Categoria
CREATE TABLE recurso_categoria (
    recurso_id INT NOT NULL REFERENCES recurso_digital(id) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias_recursos(id) ON DELETE CASCADE,
    PRIMARY KEY (recurso_id, categoria_id)
);

-- 11. Foros_Tematicos
CREATE TABLE foros_tematicos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT,
    categoria VARCHAR(100),
    reglas_moderacion TEXT,
    estado VARCHAR(20) DEFAULT 'activo',
    numero_miembros INT DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Foro_Temas
CREATE TABLE foro_temas (
    id SERIAL PRIMARY KEY,
    forum_id INT NOT NULL REFERENCES foros_tematicos(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    numero_respuestas INT DEFAULT 0,
    vistas INT DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Foro_Respuestas
CREATE TABLE foro_respuestas (
    id SERIAL PRIMARY KEY,
    tema_id INT NOT NULL REFERENCES foro_temas(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    es_solucion BOOLEAN DEFAULT false,
    numero_votos_positivos INT DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
