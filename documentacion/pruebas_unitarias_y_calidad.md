# Pruebas Unitarias y Calidad del Frontend (Vitest + Testing Library)

Esta guía técnica detalla la estrategia de aseguramiento de calidad y pruebas unitarias para el frontend de **AbrazaMente (`mental-app`)**. Se documenta cómo estructurar y codificar pruebas automáticas utilizando **Vitest** y **React Testing Library**, simulando interacciones de usuario, validando lógica reactiva y mockeando peticiones HTTP a la API REST.

---

## 📋 Entorno de Pruebas del Proyecto

El proyecto está configurado con las siguientes dependencias de control de calidad:
* **Vitest**: Motor de ejecución de pruebas de alto rendimiento integrado con Vite.
* **React Testing Library**: Biblioteca para renderizar y consultar componentes interactuando con el DOM virtual de la misma forma que lo haría un usuario real.
* **user-event**: Simulador avanzado de eventos del navegador (clicks, tipeado, selección).
* **jsdom**: Entorno de navegador ficticio en memoria para simular APIs del DOM (como `window`, `document`, `localStorage`).

---

## 🛠️ Guía de Implementación de Pruebas Paso a Paso

### 1. Pruebas de Seguridad en `ProtectedRoute.test.jsx`
Esta suite verifica que el guardián de navegación bloquee accesos anónimos redireccionando a `/auth`, y permita renderizar subrutas a usuarios con sesión activa:

```javascript
// src/components/ProtectedRoute.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe redirigir a /auth si no hay usuario ni token', () => {
    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route element={<ProtectedRoute user={null} />}>
            <Route path="/privado" element={<div>Contenido Privado</div>} />
          </Route>
          <Route path="/auth" element={<div>Pantalla Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Assert: Debe mostrar la pantalla de redirección
    expect(screen.getByText('Pantalla Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Privado')).not.in.toBeInTheDocument();
  });

  it('debe renderizar el contenido privado si hay token en localStorage', () => {
    localStorage.setItem('token', 'mock_jwt_token');

    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route element={<ProtectedRoute user={null} />}>
            <Route path="/privado" element={<div>Contenido Privado</div>} />
          </Route>
          <Route path="/auth" element={<div>Pantalla Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Assert: Debe permitir ver la ruta protegida
    expect(screen.getByText('Contenido Privado')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla Login')).not.toBeInTheDocument();
  });
});
```

---

### 2. Pruebas de Lógica Clínica en `GAD7Survey.test.jsx`
Prueba que el cuestionario incremente preguntas, realice la suma matemática de puntuaciones, y active la derivación crítica severa no descartable:

```javascript
// src/features/cdss/GAD7Survey.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import GAD7Survey from './GAD7Survey';

describe('GAD7Survey Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe guiar el test paso a paso y mostrar resultados normales si el score es bajo', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <GAD7Survey />
      </MemoryRouter>
    );

    // Assert inicial: Pregunta 1
    expect(screen.getByText(/Pregunta 1 de 7/i)).toBeInTheDocument();

    // Responder "Nunca" (valor 0) a las 7 preguntas
    for (let i = 0; i < 7; i++) {
      const optionNever = screen.getByRole('button', { name: 'Nunca' });
      await act(async () => {
        await user.click(optionNever);
      });
    }

    // Assert: El test finaliza y muestra Ansiedad Mínima (0 pts)
    expect(await screen.findByText(/Ansiedad: Mínima/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu puntaje acumulado es de 0/i)).toBeInTheDocument();
  });

  it('debe bloquear la pantalla con la alerta crítica si el score es Severo (15+)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <GAD7Survey />
      </MemoryRouter>
    );

    // Responder "Casi todos los días" (valor 3) a las 7 preguntas (3 * 7 = 21 pts)
    for (let i = 0; i < 7; i++) {
      const optionSevere = screen.getByRole('button', { name: 'Casi todos los días' });
      await act(async () => {
        await user.click(optionSevere);
      });
    }

    // Assert: Despliega la alerta crítica clínica
    expect(await screen.findByText(/¡Nivel de Ansiedad Crítico Detectado!/i)).toBeInTheDocument();
    expect(screen.getByText(/GAD-7 Score: 21 \(Severo\)/i)).toBeInTheDocument();
    
    // El modal de derivación clínica debe contener el botón obligatorio al directorio
    const redirectBtn = screen.getByRole('button', { name: /Ver Directorio Clínico/i });
    expect(redirectBtn).toBeInTheDocument();
  });
});
```

---

### 3. Pruebas de Búsqueda y Historial en `ResourceLibrary.test.jsx`
Valida la consulta asíncrona simulada de recursos, el filtrado dinámico por input de texto y la carga del historial local de navegación:

```javascript
// src/features/resources/ResourceLibrary.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ResourceLibrary from './ResourceLibrary';

// Mockear fetch global del navegador
const mockResources = [
  { id: 10, titulo: "Meditación Zen", autor: "S. Suzuki", tipo: "Video", categoria: "Meditación", descripcion: "Guía práctica de meditación.", premium: false },
  { id: 11, titulo: "Psicología Positiva", autor: "M. Seligman", tipo: "Libro", categoria: "Ansiedad", descripcion: "Fundamentos de la felicidad.", premium: true }
];

describe('ResourceLibrary Component', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResources),
      })
    );
    localStorage.clear();
  });

  it('debe cargar los recursos y filtrar por texto', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ResourceLibrary />
      </MemoryRouter>
    );

    // Esperar a que los elementos del mock se rendericen en pantalla
    expect(await screen.findByText('Meditación Zen')).toBeInTheDocument();
    expect(screen.getByText('Psicología Positiva')).toBeInTheDocument();

    // Escribir "Zen" en el buscador
    const searchInput = screen.getByPlaceholderText(/Busca por título, autor, editorial o síntoma.../i);
    await act(async () => {
      await user.type(searchInput, 'Zen');
    });

    // Assert: Debe mostrar solo el recurso que coincide
    expect(screen.getByText('Meditación Zen')).toBeInTheDocument();
    expect(screen.queryByText('Psicología Positiva')).not.toBeInTheDocument();
  });
});
```

---

## 🚀 Comandos Clave para Ejecutar Pruebas

Para validar la calidad del código, ejecute los siguientes comandos en el shell de desarrollo:

* **Ejecutar Pruebas (Modo Observador / Watch Mode)**:
  ```bash
  npm run test
  # O directamente usando vitest
  npx vitest
  ```
* **Ejecutar Pruebas con Reporte de Cobertura (Coverage)**:
  Mide el porcentaje de líneas y funciones de React probadas:
  ```bash
  npx vitest run --coverage
  ```
