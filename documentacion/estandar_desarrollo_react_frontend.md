# Estándar de Desarrollo Frontend: React & Tailwind CSS v4

Esta guía define las directrices arquitectónicas, los estándares de codificación y las mejores prácticas para el desarrollo de la interfaz de usuario de **AbrazaMente** basada en **React (Vite)** y **Tailwind CSS v4**.

---

## 📂 1. Estructura de Directorios del Frontend

Para mantener un proyecto escalable y limpio, el código se organiza siguiendo un patrón orientado a **features** (funcionalidades):

```text
src/
├── assets/                 # Recursos estáticos (Logos, imágenes vectoriales, fuentes)
├── components/             # Componentes compartidos globales (layout, botones, inputs)
│   ├── Header.jsx          # Navegación superior global con alternador de tema
│   ├── Footer.jsx          # Pie de página responsivo
│   └── ProtectedRoute.jsx  # Guard de rutas protegidas basado en sesión
├── context/                # Contextos globales de estado de React
│   ├── AuthContext.jsx     # Gestión del estado de usuario (sesión y tokens)
│   └── ThemeContext.jsx    # Manejo del tema oscuro/claro global
├── features/               # Módulos funcionales modulares autónomos
│   ├── auth/               # Pantalla de login, registro y Google OAuth
│   ├── community/          # Foro, comentarios, chat interactivo y amistades
│   ├── resources/          # Biblioteca psicoeducativa y filtros de recursos
│   ├── professionals/      # Directorio de psicólogos y flujo de reservas
│   └── clinical/           # Cuestionario GAD-7 y lógica clínica de bloqueo
├── hooks/                  # Hooks personalizados reutilizables
└── App.jsx                 # Configuración de React Router y enrutamiento global
```

---

## ⚛️ 2. Reglas y Estándares de Codificación en React

### A. Componentes Funcionales y Hooks
* Usa únicamente **Componentes Funcionales** (`Functional Components`) escritos en JSX.
* Define tipos e inicializadores claros para el estado local:
  ```javascript
  // Correcto: Estado inicial descriptivo
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  ```

### B. Declaratividad sobre Imperatividad
* **Prohibido** utilizar manipulación directa del DOM (`document.getElementById`, `querySelector`, `classList.add`).
* Todo cambio en la interfaz debe responder a modificaciones en el estado (`state`) o las propiedades (`props`):
  ```javascript
  // Incorrecto (Javascript Estático)
  document.getElementById("modal").hidden = false;

  // Correcto (React Declarativo)
  {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
  ```

### C. Limpieza en Efectos (`useEffect`)
* Siempre limpia los controladores de eventos, temporizadores o sockets al desmontar el componente para prevenir fugas de memoria (*memory leaks*):
  ```javascript
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Función de limpieza (Cleanup)
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  ```

---

## 🎨 3. Estilo Visual con Tailwind CSS v4

### A. Sistema de Diseño Glassmorphism
Para mantener la estética premium de AbrazaMente, los paneles deben usar fondos translúcidos con bordes delgados:
```html
<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
  <!-- Contenido -->
</div>
```

### B. Efectos de Transición e Interacción (Hover y Scale)
Las tarjetas e iconos deben responder suavemente al puntero del usuario para denotar interactividad:
```html
<button className="transition-all duration-300 transform hover:scale-[1.03] active:scale-95 hover:shadow-lg">
  Interactuar
</button>
```

### C. Responsividad Móvil Primero (Mobile-First)
Diseña siempre pensando en teléfonos móviles y escala usando prefijos de pantalla:
* **Móvil (por defecto)**: 1 columna, texto compacto.
* `md:`: 2 columnas, texto intermedio.
* `lg:`: 3 o más columnas, márgenes extendidos.
```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Tarjetas responsivas */}
</div>
```

---

## ⚡ 4. Iconos y Animaciones de Transición

### Iconografía Consistente
* Se utiliza únicamente la biblioteca **`lucide-react`** para renderizar iconos vectoriales escalables.
* Mantén un tamaño estándar para los iconos dentro de botones o inputs:
  * Iconos pequeños: `className="w-4 h-4"`
  * Iconos medianos: `className="w-5 h-5"`

### Transiciones Fluidas con Framer Motion
Para modales y menús desplegables, utiliza **`framer-motion`** para animar la entrada y salida física del DOM de manera orgánica:
```javascript
import { motion, AnimatePresence } from 'framer-motion';

export function Dropdown({ isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-[#1A1A1C] border border-white/10 rounded-xl"
        >
          {/* Opciones */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 🚀 5. Flujo de Trabajo y Comandos de Consola

### Inicializar el Entorno Local
```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo local con Vite (Vistas en tiempo real)
npm run dev
```

### Validar y Compilar para Producción
Antes de subir los cambios o enviarlos a revisión en GitHub, valida que la suite de Vitest compile correctamente:
```bash
# Ejecutar tests unitarios de calidad
npm run test

# Construir bundle optimizado de producción
npm run build
```
