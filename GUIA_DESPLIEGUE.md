# Guía de ejecución y despliegue — AbrazaMente

Esta guía cubre el flujo completo: registro (React → Spring Boot → PostgreSQL),
ejecución local y despliegue en producción con **Render** (backend + frontend)
y **Neon** (base de datos PostgreSQL).

> **Nota sobre nombres de endpoints:** el registro se expone en `POST /usuarios`
> (no `/api/auth/register`). El proyecto separa "gestión de usuarios" (crear,
> listar, actualizar, borrar) de "autenticación" (`/auth/login`, `/auth/me`),
> que es el criterio REST ya usado en todo el backend (`UsuarioController`,
> `UsuarioService`, `UsuarioRepository`, DTOs `Usuario*`). Se mantuvo esa
> convención — ya coherente en controladores, DTOs, tests y frontend — en
> lugar de forzar nombres `Register*`/`/api/auth/register` que no encajan con
> el resto del código. Usa `POST /usuarios` al probar el registro.

---

## 0. Resumen de la arquitectura

```
React (Vite)  --fetch-->  Spring Boot (/usuarios, /auth/*)  --JPA-->  PostgreSQL
```

- **Registro:** `POST /usuarios` → `UsuarioController` → `UsuarioServiceImpl`
  (valida RUT, hashea la contraseña con BCrypt, asigna el rol `usuario`) →
  `UsuarioRepository` → tabla `usuarios` en PostgreSQL.
- **Login:** `POST /auth/login` → `AuthService` → JWT firmado con `JWT_SECRET`.
- **Sesión:** `GET /auth/me` con `Authorization: Bearer <token>`.
- El frontend **no** guarda datos del formulario de registro en `localStorage`;
  solo persiste el JWT (`tokenStore.js`, en `sessionStorage` o `localStorage`
  según "Recordarme") y la preferencia de tema claro/oscuro.

---

## 1. Ejecución local

### 1.1 Variables de entorno

```bash
cp .env.example .env
```

Genera un secreto JWT propio (no uses el de ejemplo en producción):

```bash
openssl rand -base64 48
```

Pégalo en `JWT_SECRET` dentro de `.env`.

### 1.2 Base de datos con Docker

```bash
docker compose up -d postgres
docker compose ps
```

El primer arranque ejecuta automáticamente `database/database.sql` (esquema
completo + datos de ejemplo) dentro del contenedor. Si el volumen ya existía
de una instalación previa, aplica en su lugar la migración incremental:

```bash
psql "$DB_URL" -f database/migrations/001_sincronizar_registro.sql
```

### 1.3 Backend (Spring Boot)

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

Queda escuchando en `http://localhost:8080`.

### 1.4 Frontend (React)

En otra terminal:

```bash
npm ci
npm run dev
```

Queda en `http://localhost:5173` y Vite reenvía `/auth` y `/usuarios` hacia
`http://localhost:8080` (ver `vite.config.js`).

### 1.5 Probar el registro

```bash
curl -i -X POST http://localhost:8080/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Ana María",
    "apellidos": "Pérez Soto",
    "run": "11.111.111-1",
    "fechaNacimiento": "1998-04-15",
    "genero": "femenino",
    "estadoCivil": "soltero",
    "email": "ana.perez@example.com",
    "telefono": "+56 9 1234 5678",
    "ciudad": "Santiago",
    "password": "ClaveSegura123"
  }'
```

Respuesta esperada: `201 Created` con el usuario creado (sin `password` ni
`passwordHash`). También puedes usar el formulario en
`http://localhost:5173/registro`.

### 1.6 Verificar la persistencia en PostgreSQL

```bash
docker compose exec postgres psql -U postgres -d db \
  -c "SELECT id, email, run, estado, fecha_creacion FROM usuarios ORDER BY id DESC LIMIT 5;"
```

Debe aparecer el usuario recién creado.

---

## 2. Base de datos en Neon (producción)

1. Crea una cuenta en [neon.tech](https://neon.tech) y un proyecto nuevo.
2. Crea una base de datos (o usa la `neondb` por defecto).
3. En **Connection Details**, copia la *connection string* en modo **Pooled
   connection** (recomendado para apps con muchas conexiones cortas).
4. Arma tu `DB_URL` en formato JDBC agregando `?sslmode=require`:

   ```
   DB_URL=jdbc:postgresql://<host-pooler>.neon.tech/<db>?sslmode=require
   DB_USER=<usuario que entrega Neon>
   DB_PASSWORD=<password que entrega Neon>
   ```

5. Ejecuta el esquema completo contra Neon (una sola vez):

   ```bash
   psql "postgresql://<usuario>:<password>@<host>.neon.tech/<db>?sslmode=require" \
     -f database/database.sql
   ```

   El script es idempotente (`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`), por
   lo que puede volver a ejecutarse sin duplicar datos.

---

## 3. Backend en Render

1. Sube el proyecto a un repositorio Git (GitHub/GitLab) — este ZIP no trae
   `.git`, así que corre:

   ```bash
   git init
   git add .
   git commit -m "Migración a React + Spring Boot + PostgreSQL"
   ```

2. En Render, **New → Blueprint** y apunta al repo: detectará `render.yaml`
   (incluido en la raíz) y creará dos servicios: `abrazamente-backend` (Java)
   y `abrazamente-frontend` (sitio estático). También puedes crearlos a mano:

   - **New → Web Service** → runtime **Java**.
   - Build command: `./mvnw clean package -DskipTests`
   - Start command: `java -jar target/abrazamente-0.0.1-SNAPSHOT.jar`

3. Variables de entorno del servicio backend (Render → Environment):

   | Variable | Valor |
   |---|---|
   | `DB_URL` | connection string de Neon con `?sslmode=require` |
   | `DB_USER` | usuario de Neon |
   | `DB_PASSWORD` | password de Neon |
   | `JPA_DDL_AUTO` | `update` |
   | `JPA_SHOW_SQL` | `false` |
   | `JWT_SECRET` | genera uno nuevo con `openssl rand -base64 48` |
   | `JWT_EXPIRATION` | `3600000` |
   | `FRONTEND_ORIGINS` | URL pública del frontend (paso 4) |

   Render inyecta `PORT` automáticamente; `application.yaml` ya lo respeta
   (`server.port: ${PORT:8080}`), no hace falta configurarlo a mano.

4. Alternativa por contenedor: si prefieres Docker en vez del runtime nativo
   de Java, usa el `Dockerfile` incluido (`runtime: docker` en Render).

---

## 4. Frontend en Render (o Vercel)

### Opción A — Render Static Site

1. **New → Static Site**, mismo repositorio.
2. Build command: `npm ci && npm run build` (genera `dist/`, ver
   `vite.config.js`).
3. Publish directory: `dist`.
4. Variable de entorno: `VITE_API_URL=https://<tu-backend>.onrender.com`.
5. Regla de reescritura: `/* → /index.html` (ya definida en `render.yaml`)
   para que las rutas de React Router funcionen al recargar la página.

### Opción B — Vercel

El repo ya trae `vercel.json` con reescritura SPA. Solo define la variable de
entorno `VITE_API_URL` en el dashboard de Vercel apuntando al backend de
Render y despliega con `vercel --prod` (o conectando el repositorio).

### Cierra el círculo del CORS

Una vez desplegado el frontend, actualiza `FRONTEND_ORIGINS` en el backend
(Render → Environment) con su URL pública real y vuelve a desplegar el
backend para que `SecurityConfig` acepte peticiones desde ese origen.

---

## 5. Checklist final de verificación

- [ ] `psql` contra Neon muestra las tablas creadas por `database/database.sql`.
- [ ] `GET https://<backend>.onrender.com/error` responde (confirma que el
      servicio está arriba; no requiere autenticación).
- [ ] `POST https://<backend>.onrender.com/usuarios` con un body válido
      responde `201` y el usuario aparece en Neon.
- [ ] `POST https://<backend>.onrender.com/auth/login` con esas credenciales
      responde `200` con un `token`.
- [ ] El frontend desplegado en Render/Vercel permite registrarse, inicia
      sesión automáticamente y redirige a `/perfil` mostrando los datos
      reales guardados en PostgreSQL.
- [ ] La consola del navegador no muestra errores de CORS.
- [ ] `localStorage`/`sessionStorage` del navegador (DevTools → Application)
      solo contienen la clave `abrazamente.auth.token` y la preferencia de
      tema — ningún dato del formulario de registro.

---

## 6. Solución de problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `401` en `/auth/login` justo tras registrarse | Contraseña mal escrita en el formulario | Revisa que `password`/`confirmPassword` coincidan; el backend nunca expone la causa exacta por seguridad |
| `409 Conflict` al registrar | Email o RUT ya existen | Usa otro correo/RUT o revisa la tabla `usuarios` en Neon |
| Error de CORS en el navegador | `FRONTEND_ORIGINS` no incluye el dominio del frontend desplegado | Actualiza la variable en Render y redeploy del backend |
| `SSL error` al conectar a Neon | Falta `?sslmode=require` en `DB_URL` | Agrégalo al final de la connection string |
| Render responde 502 al iniciar | El backend no se bindeó al puerto `PORT` | Verifica que `application.yaml` tenga `server.port: ${PORT:8080}` (ya incluido) |
