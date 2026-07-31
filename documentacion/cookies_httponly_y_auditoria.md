# Cookies HttpOnly y Aspecto de Auditoría (Issue #30)

Esta guía técnica detalla la reestructuración de seguridad en **AbrazaMente (`mental-app`)** para mitigar ataques XSS (Cross-Site Scripting) mediante la migración del token JWT desde `localStorage` a cookies seguras de tipo `HttpOnly`, y la implementación de una bitácora de auditoría transaccional basada en **Spring AOP (Aspect-Oriented Programming)**.

---

## 🔒 JWT en Cookies HttpOnly vs. LocalStorage

Al almacenar tokens JWT en `localStorage`, cualquier script malicioso ejecutado en el cliente (ataque XSS) puede leer el token y secuestrar la sesión. Al migrar a **Cookies HttpOnly**, el navegador web gestiona el almacenamiento de forma aislada, impidiendo que código JavaScript de cliente lea o exponga el secreto.

```mermaid
sequenceDiagram
    participant React as React SPA
    participant Browser as Browser Engine
    participant API as Spring Boot API

    React->>API: POST /api/auth/login
    API-->>Browser: HTTP Set-Cookie: token=JWT; HttpOnly; Secure; SameSite=Strict
    Note over Browser: El navegador guarda la cookie automáticamente e impide accesos JS.
    React->>API: GET /api/journal (con credentials: 'include')
    Browser->>API: Inyecta la cookie de sesión automáticamente en los headers
    API-->>React: HTTP 200 OK (Diario cargado)
```

---

## 🛠️ Guía de Implementación Paso a Paso

### 1. Modificación de `AuthController.java` (Inyección de Cookies)
Edite el controlador de autenticación para adjuntar el token JWT en la respuesta HTTP como una cabecera de tipo `Set-Cookie`:

```java
package com.example.demo.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Método de Login migrado a Cookies HttpOnly
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        
        // 1. Validar credenciales y generar token JWT
        String jwtToken = "MOCK_JWT_TOKEN_GENERATED_BY_JWT_PROVIDER"; 

        // 2. Construir Cookie HttpOnly con políticas restrictivas de seguridad
        ResponseCookie cookie = ResponseCookie.from("auth_token", jwtToken)
                .httpOnly(true)                // Impide lectura por JS del cliente (Mitigación XSS)
                .secure(true)                  // Fuerza envío únicamente en conexiones cifradas HTTPS
                .sameSite("Strict")            // Mitiga ataques CSRF (Cross-Site Request Forgery)
                .path("/")                     // Rango de alcance de la cookie
                .maxAge(24 * 60 * 60)          // Expiración en 1 día
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"message\": \"Autenticación exitosa y cookie inyectada.\"}");
    }

    // Método para cerrar sesión invalidando la cookie
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0) // Expira la cookie inmediatamente
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"message\": \"Sesión finalizada con éxito.\"}");
    }
}
```

---

### 2. Actualización de Peticiones en el Frontend (React SPA)
En el cliente de React, limpie las llamadas a `localStorage.setItem('token', ...)` y configure sus peticiones fetch para incluir automáticamente las cookies configurando la opción `credentials`:

```javascript
// Llamada al endpoint de Login
const handleLogin = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });
  
  if (response.ok) {
    // Ya NO guardamos el token en localStorage.
    // El navegador ya guardó de forma invisible la cookie HttpOnly.
    const user = { username, role: 'ROLE_USER' };
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Petición a ruta protegida (ej: Diario Emocional)
const fetchJournal = async () => {
  const response = await fetch('/api/journal', {
    method: 'GET',
    // IMPORTANTE: Permite que el navegador adjunte la cookie de sesión automática
    credentials: 'same-origin' 
  });
  return response.json();
};
```

---

## 📝 Bitácora de Auditoría con Aspectos (Spring AOP)

Para registrar acciones sensibles de los usuarios en el sistema (ej: inicio de sesión, alteración de diario emocional o derivación por crisis CDSS), se crea una tabla relacional en base de datos e interceptamos los eventos utilizando programación orientada a aspectos.

### 1. Entidad JPA de Auditoría
```java
package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_auditoria")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String action;
    private String details;
    private String ipAddress;
    private LocalDateTime timestamp = LocalDateTime.now();
}
```

### 2. El Aspecto de Intercepción `AuditAspect.java`
Utiliza anotaciones de interceptación `@AfterReturning` para loguear de forma desacoplada sin interferir en la velocidad de la lógica de negocio de los servicios principales:

```java
package com.example.demo.security.aspect;

import com.example.demo.model.AuditLog;
import com.example.demo.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Intercepta las llamadas exitosas de registro de diario emocional
    @AfterReturning(
        pointcut = "execution(* com.example.demo.controller.JournalEntryController.createEntry(..))",
        returning = "result"
    )
    public void auditJournalCreation(JoinPoint joinPoint, Object result) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .currentRequestAttributes()).getRequest();

        AuditLog log = new AuditLog();
        log.setAction("CREACIÓN_DIARIO_EMOCIONAL");
        log.setIpAddress(request.getRemoteAddr());
        log.setDetails("Registro exitoso de estado de ánimo en la bitácora del estudiante.");
        log.setUsername(request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "Anónimo");

        auditLogRepository.save(log);
        System.out.println("Auditoría: Registro diario de calma guardado en BD.");
    }
}
```
