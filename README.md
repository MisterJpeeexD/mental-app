# 🧠 Mente Conecta — Plataforma Práctica de Salud Mental

Este repositorio contiene la arquitectura, el código fuente y el flujo de integración de la **Plataforma Práctica de Salud Mental (Mente Conecta)**, un sistema ágil y psicoeducativo orientado a la autogestión de la salud mental y la colaboración con profesionales clínicos.

---

## 🛡️ Status & Tech Badges

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Maven CI](https://img.shields.io/github/actions/workflow/status/MisterJpeeexD/mental-app/maven.yml?branch=main&style=for-the-badge&label=Maven%20CI)
![License](https://img.shields.io/github/license/MisterJpeeexD/mental-app?style=for-the-badge)

---

## 🏛️ Arquitectura del Sistema

El proyecto está estructurado como una aplicación desacoplada en tres capas (Frontend en React, Backend en Spring Boot, y Base de Datos Relacional).

```mermaid
graph TD
    subgraph Cliente [Capa de Cliente - React]
        SPA["React SPA (Vite)"]
        Components["Componentes (Botiquín, Directorio, Portal)"]
        APIClient["Cliente API (Fetch / Axios)"]
        SPA --> Components
        Components --> APIClient
    end

    subgraph Servidor [Capa de Negocio - Spring Boot]
        Controller["REST Controllers (User, Task, Auth)"]
        Service["Servicios de Negocio"]
        Repository["Repositorio (Spring Data JPA)"]
        Controller --> Service
        Service --> Repository
    end

    subgraph Almacenamiento [Capa de Datos]
        DB[("Base de Datos (MySQL / H2)")]
    end

    APIClient -- "HTTP / JSON REST" --> Controller
    Repository -- "JDBC (Hibernate)" --> DB
```

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologías Utilizadas |
| :--- | :--- |
| **Frontend** | React, Vite, HTML5, CSS3, JavaScript (ES6+), React Hooks |
| **Backend** | Java 17+, Spring Boot (Web, JPA, Validation), Lombok |
| **Base de Datos** | MySQL (Producción), H2 (Desarrollo y Pruebas en Memoria) |
| **CI / CD** | GitHub Actions (Maven Workflow, CodeQL) |
| **Licencia** | GNU General Public License v3.0 (GPLv3) |

---

## 🚀 Funcionalidades Clave

### 1. Botiquín de Ayuda Inmediata
- **Ejercicios de Respiración:** Temporizador interactivo guiado utilizando la técnica de caja (4-4-4-4).
- **Botón de Grounding:** Módulo interactivo basado en la técnica cognitiva-conductual 5-4-3-2-1.
- **Micro-Hábitos:** Tarjetas y checklists diarios orientados a la Terapia Cognitivo Conductual (TCC).

### 2. Biblioteca Práctica y Recursos
- **Material Rotativo:** Fichas descargables e infografías sobre psicología y bienestar general.
- **Librería de Afiliados:** Enlaces estructurados a libros de autoayuda con rigor científico en Amazon.

### 3. Portal de Profesionales & Directorio
- **Gestión Clínica:** Repositorio seguro para que profesionales registrados descarguen pautas y material clínico.
- **Directorio Clasificado:** Buscador y filtros avanzados de psicólogos, coaches y terapeutas de apoyo.

---

## 📂 Estructura del Directorio

```text
mental-app/
├── .github/
│   └── workflows/
│       ├── codeql.yml            # Análisis estático de seguridad de código
│       └── maven.yml              # CI de compilación y pruebas para Java
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/demo/
│   │   │   │   ├── controller/   # Controladores de la API REST
│   │   │   │   ├── model/        # Entidades JPA (User, Task, etc.)
│   │   │   │   ├── repository/   # Interfaces Spring Data JPA
│   │   │   │   └── service/      # Lógica de servicio y negocio
│   │   │   └── resources/
│   │   │       └── application.properties  # Configuración (H2/MySQL)
│   │   └── test/                 # Pruebas unitarias de Spring Boot
│   └── pom.xml                   # Configuración del proyecto Maven
├── database/
│   └── database.sql              # Esquema SQL original de la base de datos
├── index.html                    # Frontend estático original
├── style.css                     # Estilos generales del MVP estático
├── script/
│   └── script.js                 # Lógica interactiva original en Vanilla JS
├── LICENSE                       # Licencia GPLv3
└── README.md                     # Documentación principal del repositorio
```

---

## ⚙️ Configuración y Ejecución Local

### Prerrequisitos
- **Java JDK 17** o superior instalado en el equipo.
- **Node.js** y npm (para el desarrollo con React).

### Backend (Spring Boot)
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Ejecuta la aplicación utilizando Maven (el archivo utiliza base de datos H2 en memoria por defecto):
   ```bash
   mvn spring-boot:run
   ```
3. La API estará disponible en `http://localhost:8080`.
4. La consola H2 interactiva se encuentra en `http://localhost:8080/h2-console` (Credenciales: URL: `jdbc:h2:mem:taskdb`, Usuario: `sa`, sin contraseña).

### Configuración de MySQL
Para conectar la aplicación a un servidor MySQL real, edita el archivo `backend/src/main/resources/application.properties` para descomentar las propiedades correspondientes:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mente_conecta_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

---

## 🔄 Flujo de Integración Continua (CI)
El workflow [maven.yml](file:///c:/Users/Ricardo/Desktop/rep/mental-app/.github/workflows/maven.yml) se ejecuta automáticamente en cada `push` o `pull_request` a la rama principal:
1. Configura un entorno Ubuntu.
2. Inicializa Java JDK 17 (Temurin).
3. Compila el backend ejecutando `mvn clean package -DskipTests`.
4. Ejecuta toda la suite de pruebas unitarias mediante `mvn test`.
