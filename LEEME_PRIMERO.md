# Léeme primero

Proyecto único (React + Spring Boot + PostgreSQL). No hay carpetas separadas
de "backend" y "frontend clásico": ambos viven en esta misma raíz.

- Backend Spring Boot: `src/main/java/com/backend/abrazamente/`
- Frontend React (Vite): `src/` (páginas, componentes, servicios, estilos)
- Páginas clásicas aún no migradas (Terapia, Comunidad, Recursos): `public/legacy/`
- Esquema y datos de PostgreSQL: `database/`

Rutas migradas a React: `/` (home), `/login`, `/registro`, `/perfil`
(protegida). El registro y el login usan el backend real vía
`POST /usuarios` y `POST /auth/login` — no hay datos de registro guardados
en `localStorage`.

Lee estos archivos en este orden:

1. `README.md` — visión general y comandos de ejecución/build.
2. `GUIA_DESPLIEGUE.md` — ejecución local paso a paso y despliegue en
   Render (backend + frontend) con la base de datos en Neon.
3. `MIGRACION_REACT.md` — detalle técnico de la migración: qué se creó,
   qué se corrigió y evidencia de las llamadas a la API.
4. `.env.example` — variables de entorno necesarias.
5. `database/database.sql` y `database/migrations/001_sincronizar_registro.sql`
   — esquema completo y migración incremental no destructiva.

Por seguridad, este proyecto no incluye un directorio `.git`. Para iniciar un
historial nuevo:

```bash
git init
git add .
git commit -m "Migración inicial a React + Spring Boot + PostgreSQL"
```
