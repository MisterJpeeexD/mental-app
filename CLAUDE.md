# AbrazaMente — Instrucciones para Agentes

## Proyecto
App web de salud mental para universitarios. Backend Spring Boot + SPA React.

## Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Spring Boot 4.1, Java 17, Maven
- **Seguridad**: Spring Security + JWT + Google OAuth2
- **BD**: PostgreSQL (Neon prod), H2 (dev)
- **Deploy**: Render (JAR unificado)

## Arquitectura (Feature-First)
```
src/features/breathing/     → BreathingTimer.jsx
src/features/grounding/     → GroundingWizard.jsx
src/features/journal/       → MoodTracker.jsx
src/features/professionals/ → ProfessionalDirectory.jsx
src/App.jsx                 → Router principal
```

## Comandos
```bash
npm run build                    # Compila React
mvn clean package -DskipTests    # Compila JAR
java -jar target/*.jar           # Inicia app
```

## Reglas (Ponytail/YAGNI)
- No construir lo que no se necesita aún
- CSS nativo/Tailwind > librerías de UI
- Marcar simplificaciones con `// ponytail: <razón>`

## Seguridad
- CORS global en `SecurityConfig.java`
- Públicos: `/api/auth/**`, `/auth/**`, `/h2-console/**`, `/api/professionals/**` (solo GET)
- Resto (incluye `/api/journal/**` y `/api/users/**`) requiere JWT válido
- Endpoints admin usan `@PreAuthorize("hasRole('ADMIN')")` (ver `UserController.getAllUsers`)
- Nunca hardcodear secretos

## CodeGraph
Repositorio indexado. Usar `codegraph explore` antes de grep/find para entender el código.
