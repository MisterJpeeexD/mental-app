# Cápsulas Guías de React: Patrones y Soluciones Clave

Esta guía técnica avanzada recopila micro-patrones de desarrollo ("cápsulas") optimizados para la plataforma de salud mental **AbrazaMente**. Proporciona fundamentos detallados de ingeniería de software, arquitectura de renderizado en React, pautas de seguridad para el almacenamiento de credenciales y código limpio listo para producción.

---

## 📂 Categoría A: Gestión de Estado y Datos

### 💊 Cápsula 1: Gestión de Estado Global (Context API)
> 🎯 **Objetivo**: Proveer un estado global consistente de autenticación y datos de usuario sin incurrir en acoplamientos innecesarios (*prop-drilling*).
> 💡 **Caso de Uso en AbrazaMente**: Mantener la sesión del usuario (JWT) y refrescar los datos del perfil clínico en el Header y vistas protegidas.

#### 🧠 Fundamentación de Ingeniería
* **Mecánica del Reconciliador (Fiber)**: React Context crea un nodo especial en el árbol virtual. Cuando el valor del contexto cambia, todos los componentes que consumen dicho contexto a través de `useContext` entran en la fase de renderizado (*re-render*).
* **Mitigación de Renderizados Innecesarios**: Para evitar que cambios menores en el estado de carga (`loading`) re-rendericen componentes que solo necesitan la función de cierre de sesión (`logout`), implementamos una optimización de memoria mediante `useMemo`. Esto asegura que el objeto de valor de contexto mantenga una referencia idéntica en memoria a menos que sus dependencias cambien físicamente.
* **Seguridad en la Inicialización**: La lectura de `localStorage` se encapsula dentro de un bloque `try-catch` dentro del hook de efecto, lo que previene que la aplicación web se congele si el navegador tiene bloqueadas las cookies de terceros o el almacenamiento local por políticas de privacidad del usuario.

```javascript
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

/**
 * Proveedor de Autenticación de AbrazaMente.
 * Se encarga de coordinar la lectura, escritura y revocación de credenciales JWT.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicialización síncrona/diferida al montar la aplicación
  useEffect(() => {
    try {
      const savedUser = window.localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn("Fallo de lectura o parseo en AuthContext local storage:", e);
      // Depuración preventiva en caso de token corrupto
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para registrar credenciales tras un login exitoso
  const login = (userData, token) => {
    setUser(userData);
    try {
      window.localStorage.setItem('user', JSON.stringify(userData));
      window.localStorage.setItem('token', token);
    } catch (e) {
      console.error("No se pudo escribir la sesión en LocalStorage:", e);
    }
  };

  // Función para revocar y limpiar la sesión activa
  const logout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
    } catch (e) {
      console.error("Error al limpiar LocalStorage durante el logout:", e);
    }
  };

  // Memorizar la referencia del objeto para optimizar renderizados de componentes hijos
  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
      )}
    </AuthContext.Provider>
  );
}

/**
 * Hook de Consumo del Estado de Autenticación.
 * Lanza una excepción controlada si se consume fuera del proveedor jerárquico.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe implementarse exclusivamente dentro de un componente hijo de AuthProvider');
  }
  return context;
}
```

---

### 💊 Cápsula 2: Consumo de APIs REST Seguro con JWT
> 🎯 **Objetivo**: Abstraer la comunicación asíncrona hacia el backend de Spring Boot, administrando de forma reactiva la inyección de JWT e interceptando códigos de error estándar.
> 💡 **Caso de Uso en AbrazaMente**: Consultar especialistas en `/api/professionals` o registrar las respuestas de la evaluación GAD-7 en `/api/cdss`.

#### 🧠 Fundamentación de Ingeniería
* **Protección contra Ataques XSS**: En lugar de inyectar tokens directamente desde componentes UI, el hook unifica la lectura de disco en una única función encapsulada.
* **Controladores de Estado y Eventos**: `useCallback` memoriza la función `request` para evitar que se recree en cada ciclo de vida del componente llamador. Esto evita bucles infinitos cuando la función se incluye en el arreglo de dependencias de un `useEffect` consumidor.
* **Manejo de Errores e Intercepción de Sesión Expirada (401)**: El hook detecta proactivamente un código `401 Unauthorized` (Token expirado o inválido) o `403 Forbidden` (Permiso insuficiente) y realiza una limpieza automática de credenciales corruptas antes de redirigir al login del usuario.

```javascript
// src/hooks/useApiCall.js
import { useState, useCallback } from 'react';

/**
 * Hook de consumo seguro de API REST con inyección de JWT.
 */
export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = window.localStorage.getItem('token');
      
      // Combinar cabeceras base con las configuraciones personalizadas de la llamada
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(url, { ...options, headers });

      // Interceptar códigos de error HTTP de seguridad
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Limpieza preventiva de sesión por token inválido o expirado
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('token');
          // Redirección forzosa limpia
          window.location.href = '/login?expired=true';
          throw new Error("Sesión expirada. Por favor, ingrese nuevamente.");
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error en la petición: Código ${response.status}`);
      }

      // Convertir respuesta a formato JSON estructurado
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err; // Re-lanzar error para permitir control fino en componentes
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
```

---

## 📂 Categoría B: Componentes de UI e Interacción

### 💊 Cápsula 3: Animaciones de Transición con Framer Motion
> 🎯 **Objetivo**: Atenuar la respuesta del sistema nervioso mediante animaciones orgánicas de física de resorte (*spring*), eliminando transiciones toscas y bruscas.
> 💡 **Caso de Uso en AbrazaMente**: Modales de alerta de crisis, transiciones del temporizador 4-7-8, y aparición del panel flotante de amigos.

#### 🧠 Fundamentación de Ingeniería
* **Carga Cognitiva en Salud Mental**: Las animaciones lineales y bruscas incrementan la tensión del usuario. Esta cápsula utiliza **Framer Motion** para implementar físicas de resorte basadas en tres parámetros clave:
  1. `stiffness` (Rigidez): Fuerza con la que el resorte jala de regreso.
  2. `damping` (Amortiguación): Resistencia al movimiento de rebote para estabilizar la UI.
  3. `mass` (Masa): La inercia del componente animado.
* **Layout Transitions**: Al utilizar `AnimatePresence`, React retiene temporalmente el componente desmontado en el árbol real para permitir que la animación de salida finalice antes de eliminar los nodos del DOM físico.

```javascript
// src/components/FadeInUp.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Configuración de animación física suave, simulando inercia natural
const fadeInUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 280, // Fricción moderada para fluidez
      damping: 24,    // Estabilización rápida del rebote
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    y: 12, 
    transition: { duration: 0.18, ease: 'easeOut' } 
  }
};

export default function FadeInUp({ children, className }) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

### 💊 Cápsula 4: Temporizador Reactivo Seguro (Ej: Respiración 4-7-8)
> 🎯 **Objetivo**: Coordinar la reducción y alteración de tiempos periódicos de forma segura, garantizando la eliminación de listeners al desmontar el componente.
> 💡 **Caso de Uso en AbrazaMente**: Temporizador interactivo de respiración del Botiquín Emocional.

#### 🧠 Fundamentación de Ingeniería
* **Fugas de Memoria en Re-renderizados**: Un temporizador creado sin limpieza en un componente React guarda una referencia al estado anterior del render en el que se originó (gracias al concepto de clausuras de JavaScript). Esto no solo genera conteos erráticos, sino que mantiene acaparado el procesador del dispositivo móvil de forma silenciosa.
* **Ciclo de Reconciliación Limpio**: El uso de la función de retorno (`return () => clearInterval(id)`) destruye el temporizador activo inmediatamente al desmontar el componente, al pausar el temporizador o al cambiar de fase, asegurando el óptimo uso de memoria.

```javascript
// src/features/clinical/BreathingTimer.jsx
import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

export default function BreathingTimer() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Inhala (4s)');
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Efecto que controla el ciclo de vida del intervalo
  useEffect(() => {
    let intervalId = null;
    
    if (isActive) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Lógica cíclica para contención de crisis
            if (phase.startsWith('Inhala')) {
              setPhase('Retén (7s)');
              return 7;
            } else if (phase.startsWith('Retén')) {
              setPhase('Exhala (8s)');
              return 8;
            } else {
              setPhase('Inhala (4s)');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Función de limpieza para desmontar o pausar
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, phase]);

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center space-y-6 max-w-xs mx-auto backdrop-blur-md">
      <h3 className="font-bold text-white text-sm">Respiración 4-7-8</h3>
      
      {/* Círculo animado con escalado fluido basado en la fase */}
      <div 
        className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 border-blue-500/20 mx-auto transition-all duration-1000 ${
          isActive && phase.startsWith('Inhala') ? 'scale-110 border-blue-500/50' : 'scale-100'
        }`}
      >
        <span className="text-xl font-bold text-white">{secondsLeft}s</span>
        <span className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">
          {phase.split(' ')[0]}
        </span>
      </div>

      <button 
        onClick={() => setIsActive(!isActive)}
        className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl text-xs font-bold text-white transition"
      >
        {isActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {isActive ? 'Detener Ejercicio' : 'Comenzar'}
      </button>
    </div>
  );
}
```

---

## 📂 Categoría C: Formularios y Validación

### 💊 Cápsula 5: Formulario Controlado con Validación Dinámica
> 🎯 **Objetivo**: Capturar y validar datos de usuario en tiempo real sin entorpecer el renderizado general del resto del componente.
> 💡 **Caso de Uso en AbrazaMente**: Formulario de login, registro de cuenta, y envío de retroalimentación de especialistas.

#### 🧠 Fundamentación de Ingeniería
* **Controlled Components en React**: Se asocian directamente al estado reactivo del componente. Esto permite controlar con total precisión el comportamiento del teclado y denegar el botón de acción si hay fallas de validación.
* **Reducción de Latencia de Teclado**: La validación dinámica de expresiones regulares se realiza sobre el mismo objeto de estado en el evento `onChange`, limitando la búsqueda y el cómputo de errores únicamente al campo que está siendo editado por el usuario.

```javascript
// src/features/auth/LoginForm.jsx
import React, { useState } from 'react';

export default function LoginForm({ onSubmit }) {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Función validadora modular
  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'El correo electrónico es requerido';
      else if (!emailRegex.test(value)) error = 'Formato de correo no válido';
    }
    if (name === 'password' && value.length < 6) {
      error = 'La contraseña debe contar con al menos 6 caracteres';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateField('email', fields.email);
    validateField('password', fields.password);

    const hasErrors = Object.values(errors).some(err => err !== '') || !fields.email || !fields.password;
    if (!hasErrors) {
      onSubmit(fields);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
        {errors.email && <span className="text-[10px] text-red-400 block mt-1">{errors.email}</span>}
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
        {errors.password && <span className="text-[10px] text-red-400 block mt-1">{errors.password}</span>}
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-xs font-bold text-white transition">
        Iniciar Sesión
      </button>
    </form>
  );
}
```

---

## 📂 Categoría D: Hooks Reutilizables de UI

### 💊 Cápsula 6: Persistencia Local (`useLocalStorage`)
> 🎯 **Objetivo**: Conectar variables de estado directamente con el almacenamiento físico local de forma optimizada y asíncrona al iniciar.
> 💡 **Caso de Uso en AbrazaMente**: Persistir el tema de visualización (oscuro/claro) o recursos marcados como favoritos.

#### 🧠 Fundamentación de Ingeniería
* **Inicialización Perezosa de Estado**: Leer de disco es una operación síncrona y costosa en JavaScript. Este hook delega la lectura inicial de `localStorage` a una función de inicialización de estado que corre **una sola vez** al montar el componente, evitando lecturas pesadas innecesarias en los subsiguientes renderizados de pantalla.

```javascript
// src/hooks/useLocalStorage.js
import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  // Inicialización perezosa (Lazy State Initialization)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Fallo de lectura en localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Fallo de escritura en localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
```

---

### 💊 Cápsula 7: Detectar Clics Externos (`useOnClickOutside`)
> 🎯 **Objetivo**: Detectar clics e interacciones táctiles de puntero realizadas fuera de la referencia de un contenedor específico.
> 💡 **Caso de Uso en AbrazaMente**: Cerrar el menú desplegable del Header, el panel de chat dock o los modales superpuestos.

#### 🧠 Fundamentación de Ingeniería
* **Delegación e Invocación de Eventos en el DOM**: Registra escuchadores globales de ratón (`mousedown`) y táctiles (`touchstart`) en el nodo `document` del navegador web. Al gatillarse el evento, se verifica si el nodo cliqueado (`event.target`) se encuentra contenido dentro del contenedor referenciado por React utilizando el método nativo `.contains()`.
* **Eliminación y Prevención de fugas de memoria**: El hook remueve de inmediato los escuchadores globales durante el desmontaje físico del componente llamador.

```javascript
// src/hooks/useOnClickOutside.js
import { useEffect } from 'react';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Si el elemento fue cliqueado dentro de la referencia, ignorar
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

---

## 📂 Categoría E: Rendimiento y Calidad (Testing)

### 💊 Cápsula 8: Carga Perezosa de Componentes (`React.lazy` & `Suspense`)
> 🎯 **Objetivo**: Incrementar sustancialmente la velocidad de carga inicial de la aplicación difiriendo la descarga de componentes secundarios pesados.
> 💡 **Caso de Uso en AbrazaMente**: Code-splitting del foro de la comunidad, biblioteca psicoeducativa y cuestionarios clínicos.

#### 🧠 Fundamentación de Ingeniería
* **Code Splitting y Web Vitals**: Al empaquetar una SPA tradicional, el código de toda la aplicación se une en un archivo `.js` masivo. Esto perjudica métricas esenciales de rendimiento de Google (*Largest Contentful Paint* y *Total Blocking Time*). `React.lazy` instruye al empaquetador para generar por separado bloques o fragmentos de código (*chunks*) descargados dinámicamente y bajo demanda del usuario mediante peticiones asíncronas de red.

```javascript
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// Cargas diferidas de módulos pesados en AbrazaMente
const CommunityForum = lazy(() => import('./features/community/CommunityForum'));
const ResourceLibrary = lazy(() => import('./features/resources/ResourceLibrary'));

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center p-12 text-xs text-gray-400 font-bold uppercase tracking-wider">
          Cargando recursos del módulo...
        </div>
      }>
        <Routes>
          <Route path="/comunidad" element={<CommunityForum />} />
          <Route path="/recursos" element={<ResourceLibrary />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

### 💊 Cápsula 9: Pruebas Unitarias de Componentes con Vitest
> 🎯 **Objetivo**: Validar de manera programática el renderizado de la UI, la actualización de estados y la respuesta a clics y eventos de entrada sin depender de navegadores reales.
> 💡 **Caso de Uso en AbrazaMente**: Validar la lógica clínica del conteo del BreathingTimer, la inserción de mensajes en el muro, o la visualización de errores del formulario.

#### 🧠 Fundamentación de Ingeniería
* **Simulación Virtual DOM en NodeJS**: Esta cápsula interactúa con la biblioteca **JSDOM**, la cual emula completamente las API del navegador directamente en NodeJS. Esto acelera notablemente la ejecución de tests unitarios que simulan eventos de usuario de forma automatizada y consistente.

```javascript
// src/features/clinical/BreathingTimer.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import BreathingTimer from './BreathingTimer';

describe('Componente BreathingTimer', () => {
  it('debe renderizar el título clínico y botón iniciar', () => {
    render(<BreathingTimer />);
    expect(screen.getByText('Respiración 4-7-8')).toBeDefined();
    expect(screen.getByRole('button', { name: /Comenzar/i })).toBeDefined();
  });

  it('debe alternar el estado del temporizador al hacer click', () => {
    render(<BreathingTimer />);
    const button = screen.getByRole('button', { name: /Comenzar/i });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /Detener/i })).toBeDefined();
  });
});
```
