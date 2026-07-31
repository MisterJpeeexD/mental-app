# Migración progresiva de Home, Login y Registro a React

## Diagnóstico inicial

El proyecto contenía dos implementaciones separadas:

- `Backend-Acondicionado`: API Spring Boot con PostgreSQL, Spring Security y JWT. Ya incluía dependencias de React/Vite, pero no existían los archivos `src/main.jsx`, rutas, páginas ni servicios necesarios para construir el frontend.
- `Frontend_clasico_con_registro_vinculado`: frontend HTML/CSS/JavaScript. Home, Login y Registro eran páginas estáticas. El login tradicional no consumía `/auth/login` y el registro únicamente validaba RUT/contraseñas en el navegador; su `action="/registro"` no correspondía a un endpoint real.

Incompatibilidades corregidas:

1. El registro clásico solicitaba RUT, fecha de nacimiento, género y estado civil, pero `UsuarioRequestDTO` no aceptaba esos campos.
2. PostgreSQL definía `usuarios.run` como obligatorio, pero la entidad `Usuario` no lo modelaba y los datos iniciales no enviaban ese valor.
3. Los usuarios nuevos no recibían un rol. El SQL utilizaba `usuario`, mientras la seguridad esperaba `CLIENT`.
4. `GET /usuarios` era público y exponía datos personales.
5. Las credenciales incorrectas y otros errores podían terminar como HTTP 500 con detalles internos.
6. El frontend clásico referenciaba autenticación de Google, pero el backend cargado no posee esos endpoints; por eso no se simuló esa función en React.

## Cambios realizados

### Backend creado o ajustado

- `auth/AuthController.java`, `AuthService.java` y `LoginResponseDTO.java`: login JWT y consulta del usuario actual.
- `controller/UsuarioController.java`: registro público, consultas administrativas y actualización limitada al propietario o administrador.
- `dto/UsuarioRequestDTO.java`, `UsuarioUpdateRequestDTO.java` y `UsuarioResponseDTO.java`: contratos separados para entrada y salida, sin exponer `passwordHash`.
- `service/UsuarioServiceImpl.java`, `mapper/UsuarioMapper.java` y repositorios: normalización, duplicados, BCrypt y asignación del rol base.
- `model/Usuario.java`: sincronización de `run`, fechas y columnas del registro con PostgreSQL.
- `security/SecurityConfig.java`, `JwtAuthFilter.java`, `JwtService.java`, `UsuarioDetails.java` y `UsuarioDetailsService.java`: autenticación stateless, CORS, 401/403 JSON y autorización por roles.
- `config/RoleDataInitializer.java`: creación segura del rol `usuario` cuando no existe.
- `validation/RutUtils.java`: normalización y validación módulo 11.
- `exception/*`: respuestas sanitizadas para validación, conflicto, autenticación y errores internos.
- `web/SpaController.java`: soporte de rutas React al servir la compilación desde Spring Boot.

### Frontend React creado

- `src/App.jsx` y `src/main.jsx`.
- `src/pages/HomePage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `ProfilePage.jsx` y `NotFoundPage.jsx`.
- `src/components/common/*` y `src/components/layout/*`.
- `src/context/AuthContext.jsx`, `src/routes/ProtectedRoute.jsx` y hooks de tema/animación.
- `src/services/apiClient.js`, `authService.js`, `userService.js` y `tokenStore.js`.
- `src/utils/rut.js` y sus pruebas.
- `src/styles/home.css`, `app.css` y `auth.css`.
- `public/assets` y `public/legacy`: recursos originales y páginas aún no migradas.

### Configuración y base de datos

- `application.yaml`, `.env`, `.env.example`, `vite.config.js`, `package.json`, `vercel.json` y `docker-compose.yml`.
- `database/database.sql`: esquema PostgreSQL para instalaciones nuevas, con RUT obligatorio y datos de demostración consistentes.
- `database/migrations/001_sincronizar_registro.sql`: migración no destructiva para una base existente.
- No se eliminó ninguna tabla ni columna funcional. El rol, estado y hash de contraseña siguen bajo control exclusivo del backend.

## Arquitectura final relevante

```text
Backend-Acondicionado/
├── src/main/java/com/backend/abrazamente/
│   ├── auth/                    # Login JWT y GET /auth/me
│   ├── config/                  # Inicialización del rol usuario
│   ├── controller/              # Registro y administración de usuarios
│   ├── dto/                     # DTO separados para registro, actualización y respuesta
│   ├── security/                # JWT, CORS y autorización
│   ├── validation/              # Normalización y módulo 11 del RUT
│   └── web/                     # Fallback para rutas de la SPA
├── src/
│   ├── components/              # Componentes comunes y layout
│   ├── context/AuthContext.jsx  # Estado global de autenticación
│   ├── hooks/                   # Tema y animaciones
│   ├── pages/                   # Home, Login, Registro y Perfil
│   ├── routes/                  # Ruta protegida
│   ├── services/                # Cliente HTTP, autenticación, usuarios y token
│   ├── styles/                  # Estilos preservados/adaptados
│   ├── utils/                   # RUT frontend
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── assets/                  # Imágenes originales
│   └── legacy/                  # Terapia, Comunidad y Recursos clásicos conservados
├── database/
│   ├── database.sql
│   └── migrations/001_sincronizar_registro.sql
└── docker-compose.yml
```

## Campos del registro

Campos enviados a `POST /usuarios`:

- `nombres`: obligatorio, 2 a 100 caracteres.
- `apellidos`: obligatorio, 2 a 100 caracteres.
- `run`: obligatorio, RUT normalizado y validado con módulo 11. El nombre JSON canónico es `run`.
- `fechaNacimiento`: obligatoria y anterior a la fecha actual. El nombre JSON canónico es `fechaNacimiento`.
- `genero`: obligatorio y limitado a valores conocidos.
- `estadoCivil`: opcional. El nombre JSON canónico es `estadoCivil`.
- `email`: obligatorio, válido y único.
- `telefono`: opcional.
- `ciudad`: obligatoria.
- `password`: obligatoria, entre 8 y 72 caracteres.

Campos que **no** se envían:

- `confirmPassword`: solo sirve para validar en React.
- aceptación de términos: se valida en React; el esquema actual no almacena consentimiento versionado.
- `passwordHash`: lo genera BCrypt en el backend.
- `estado`: lo asigna la entidad como `activo`.
- roles: el backend asigna exclusivamente el rol `usuario`.

## Endpoints utilizados

- `POST /usuarios`: registro público.
- `POST /auth/login`: autenticación mediante email y contraseña.
- `GET /auth/me`: consulta del usuario autenticado.
- Cierre de sesión: local, porque JWT es stateless; se elimina el token del almacenamiento del navegador.

Los endpoints de consulta de usuarios quedaron restringidos a administradores. La actualización permite roles `USUARIO` o `ADMIN`; la eliminación sigue reservada a administradores.

## Ejecución

### 1. Variables de entorno

Copia `.env.example` a `.env` y ajusta las credenciales:

```bash
cp .env.example .env
```

Genera un secreto JWT Base64 seguro, por ejemplo:

```bash
openssl rand -base64 48
```

### 2. Base de datos con Docker

```bash
docker compose up -d postgres
docker compose ps
```

El script completo se ejecuta automáticamente solo cuando el volumen de PostgreSQL se crea por primera vez. Para una base existente, revisa y ejecuta manualmente:

```bash
psql -U postgres -d db -f database/migrations/001_sincronizar_registro.sql
```

### 3. Frontend React en desarrollo

```bash
npm ci
npm run dev
```

Vite queda disponible en `http://localhost:5173` y redirige `/auth` y `/usuarios` a Spring Boot en `http://localhost:8080`.

En un despliegue separado del backend, configura `VITE_API_URL` con el origen público de la API antes de ejecutar `npm run build`.

Para ejecutar las pruebas del frontend:

```bash
npm test
```

### 4. Backend Spring Boot

En otra terminal:

```bash
chmod +x mvnw
./mvnw test
./mvnw spring-boot:run
```

En Windows:

```powershell
mvnw.cmd spring-boot:run
```

### 5. Construcción integrada

```bash
npm run build
./mvnw clean package
java -jar target/abrazamente-0.0.1-SNAPSHOT.jar
```

La compilación de Vite copia la SPA y las páginas clásicas conservadas a `src/main/resources/static`.

## Evidencia de integración

### Registro

Solicitud:

```json
{
  "nombres": "Ana María",
  "apellidos": "Pérez Soto",
  "run": "11111111-1",
  "fechaNacimiento": "1998-04-15",
  "genero": "femenino",
  "estadoCivil": "soltero",
  "email": "ana.perez@example.com",
  "telefono": "+56 9 1234 5678",
  "ciudad": "Santiago",
  "password": "ClaveSegura123"
}
```

Respuesta HTTP 201, sin contraseña ni hash:

```json
{
  "id": 15,
  "nombres": "Ana María",
  "apellidos": "Pérez Soto",
  "email": "ana.perez@example.com",
  "run": "11111111-1",
  "fechaNacimiento": "1998-04-15",
  "genero": "femenino",
  "estadoCivil": "soltero",
  "telefono": "+56 9 1234 5678",
  "ciudad": "Santiago",
  "estado": "activo",
  "roles": ["usuario"],
  "fechaCreacion": "2026-07-29T17:00:00Z"
}
```

Correo duplicado, HTTP 409:

```json
{
  "fecha": "2026-07-29T17:01:00",
  "status": 409,
  "mensaje": "Ya existe una cuenta asociada a ese correo electrónico"
}
```

### Login

Solicitud:

```json
{
  "email": "ana.perez@example.com",
  "password": "ClaveSegura123"
}
```

Respuesta HTTP 200:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "usuario": {
    "id": 15,
    "nombres": "Ana María",
    "apellidos": "Pérez Soto",
    "email": "ana.perez@example.com",
    "roles": ["usuario"]
  }
}
```

Solicitud autenticada:

```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Cuando el token expira o es inválido, la API responde HTTP 401; React elimina el token y redirige a `/login` al intentar acceder a `/perfil`.

## Verificación realizada

Se revisaron estructura, controladores, servicios, repositorios, entidades, DTO, seguridad, JWT, SQL, formularios, estilos, scripts y recursos. El código se dejó preparado para compilación y ejecución. En el entorno donde se realizó la modificación, los repositorios externos de npm y Maven no estaban disponibles, por lo que no fue posible descargar Vite, React ni Maven para ejecutar la compilación completa. Los comandos anteriores deben ejecutarse en un entorno con acceso a npm y Maven Central.
