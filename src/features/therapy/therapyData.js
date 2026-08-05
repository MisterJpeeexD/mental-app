/* Datos de terapias, terapeutas y guía de orientación.
   Portado desde public/legacy/src/js/terapia.js.
   ponytail: datos estáticos hasta que exista un endpoint de terapias en el backend. */

export const especialistas = [
  {
    id: 1,
    nombre: 'Dra. Camila Rojas',
    sexo: 'Mujer',
    especialidad: 'Psicología Clínica',
    terapia: 'Terapia cognitivo-conductual',
    enfoque: 'Ayudar a identificar y transformar patrones de pensamiento que generan malestar, fortaleciendo herramientas prácticas para el día a día.',
    descripcion: 'Especialista en manejo de ansiedad y estrés con enfoque práctico y basado en evidencia.',
    comentarios: [
      'Me ayudó a entender mis pensamientos automáticos y a manejarlos mejor.',
      'Las sesiones son estructuradas y con ejercicios muy útiles.',
      'Sentí un ambiente de confianza desde la primera sesión.',
    ],
  },
  {
    id: 2,
    nombre: 'Lic. Andrés Fuenzalida',
    sexo: 'Hombre',
    especialidad: 'Psicología Humanista',
    terapia: 'Terapia humanista',
    enfoque: 'Acompañar procesos de autoconocimiento y aceptación personal, respetando el ritmo propio de cada persona.',
    descripcion: 'Enfocado en el crecimiento personal y la exploración emocional desde una mirada cálida y no directiva.',
    comentarios: [
      'Nunca sentí juicio, solo escucha genuina.',
      'Me permitió reconectar conmigo mismo después de un momento difícil.',
    ],
  },
  {
    id: 3,
    nombre: 'Dra. Valentina Soto',
    sexo: 'Mujer',
    especialidad: 'Terapia Familiar',
    terapia: 'Terapia familiar',
    enfoque: 'Fortalecer la comunicación y los vínculos familiares, promoviendo espacios seguros de diálogo.',
    descripcion: 'Trabaja con dinámicas familiares complejas, mediación y resolución de conflictos.',
    comentarios: [
      'Nuestra familia logró comunicarse de una forma que no habíamos podido antes.',
      'Muy profesional y respetuosa con todos los integrantes.',
    ],
  },
  {
    id: 4,
    nombre: 'Lic. Martín Ibáñez',
    sexo: 'Hombre',
    especialidad: 'Terapia de Pareja',
    terapia: 'Terapia de pareja',
    enfoque: 'Promover la comprensión mutua y el fortalecimiento del vínculo a través de la comunicación consciente.',
    descripcion: 'Especialista en conflictos de pareja, comunicación y reconstrucción de confianza.',
    comentarios: [
      'Nos dio herramientas concretas para dejar de repetir las mismas peleas.',
      'Un espacio neutral donde ambos pudimos hablar con libertad.',
    ],
  },
  {
    id: 5,
    nombre: 'Dra. Fernanda Muñoz',
    sexo: 'Mujer',
    especialidad: 'Psicología Clínica',
    terapia: 'Terapia para ansiedad',
    enfoque: 'Brindar herramientas de regulación emocional para reducir el impacto de la ansiedad en la vida diaria.',
    descripcion: 'Amplia experiencia en trastornos de ansiedad y técnicas de respiración y relajación.',
    comentarios: [
      'Aprendí a reconocer mis crisis de ansiedad antes de que escalaran.',
      'Sus técnicas de respiración cambiaron mi día a día.',
    ],
  },
  {
    id: 6,
    nombre: 'Lic. Ignacio Pardo',
    sexo: 'Hombre',
    especialidad: 'Psicología Clínica',
    terapia: 'Terapia para depresión',
    enfoque: 'Acompañar el proceso de reconexión con actividades y vínculos significativos, a paso constante.',
    descripcion: 'Trabaja con procesos de duelo, desmotivación y episodios depresivos desde un enfoque compasivo.',
    comentarios: [
      'Me ayudó a dar pequeños pasos cuando sentía que no podía con nada.',
      'Muy paciente y respetuoso con mis tiempos.',
    ],
  },
  {
    id: 7,
    nombre: 'Dra. Josefina Herrera',
    sexo: 'Mujer',
    especialidad: 'Coaching Emocional',
    terapia: 'Terapia de crecimiento personal',
    enfoque: 'Potenciar la autoestima y el propósito personal a través de la reflexión guiada y metas concretas.',
    descripcion: 'Enfocada en procesos de crecimiento personal, autoestima y toma de decisiones vitales.',
    comentarios: [
      'Me ayudó a clarificar qué quería realmente para mi vida.',
      'Sesiones motivadoras y muy prácticas.',
    ],
  },
  {
    id: 8,
    nombre: 'Lic. Rodrigo Vidal',
    sexo: 'Hombre',
    especialidad: 'Orientación Emocional',
    terapia: 'Orientación emocional',
    enfoque: 'Ofrecer un primer espacio de contención y orientación para identificar el tipo de apoyo que se necesita.',
    descripcion: 'Ideal como primer acercamiento para quienes no saben por dónde empezar su proceso emocional.',
    comentarios: [
      'Me orientó muy bien hacia el tipo de terapia que realmente necesitaba.',
      'Un primer espacio muy contenedor y claro.',
    ],
  },
  {
    id: 9,
    nombre: 'Dra. Paula Contreras',
    sexo: 'Mujer',
    especialidad: 'Psicología Humanista',
    terapia: 'Terapia humanista',
    enfoque: 'Explorar el sentido de vida y la coherencia entre valores personales y acciones cotidianas.',
    descripcion: 'Especialista en procesos de transición vital y búsqueda de sentido.',
    comentarios: [
      'Me acompañó en un cambio de vida muy grande con mucha calidez.',
      'Sentí que podía hablar de todo sin miedo a ser juzgada.',
    ],
  },
  {
    id: 10,
    nombre: 'Lic. Diego Salazar',
    sexo: 'Hombre',
    especialidad: 'Terapia Familiar',
    terapia: 'Terapia familiar',
    enfoque: 'Trabajar en conjunto con las familias para construir acuerdos y mejorar la convivencia diaria.',
    descripcion: 'Enfoque sistémico orientado a mejorar la convivencia y los acuerdos familiares.',
    comentarios: [
      'Ayudó a que mis padres y yo pudiéramos entendernos mejor.',
      'Muy claro y objetivo al mediar entre todos.',
    ],
  },
];

/* Guía de orientación según necesidad */
export const orientacionGuia = [
  { titulo: 'Ansiedad o estrés constante', texto: 'La terapia cognitivo-conductual y la terapia para ansiedad suelen ofrecer herramientas prácticas de regulación.' },
  { titulo: 'Tristeza o desmotivación prolongada', texto: 'La terapia para depresión puede acompañar el proceso con un ritmo compasivo y sostenido.' },
  { titulo: 'Conflictos familiares', texto: 'La terapia familiar ayuda a mejorar la comunicación y construir acuerdos entre todos los integrantes.' },
  { titulo: 'Dificultades en la pareja', texto: 'La terapia de pareja ofrece un espacio neutral para trabajar la comunicación y la confianza.' },
  { titulo: 'Búsqueda de sentido o autoconocimiento', texto: 'La terapia humanista y la terapia de crecimiento personal exploran el propósito y la aceptación personal.' },
  { titulo: 'No sabes por dónde empezar', texto: 'La orientación emocional es un buen primer paso para identificar qué tipo de apoyo necesitas.' },
];

/* Iniciales para el avatar, ignorando el título profesional */
export function getIniciales(nombre) {
  const partes = nombre.replace(/^(Dra?\.|Lic\.)\s*/i, '').split(' ');
  return (partes[0]?.[0] || '') + (partes[1]?.[0] || '');
}

/* Color del avatar según sexo (solo estético, no clínico) */
export function getAvatarColor(sexo) {
  return sexo === 'Mujer' ? '#B7A6D6' : '#5B8C7B';
}

/* Valores únicos y ordenados de una propiedad, para poblar los selects */
export function opcionesDe(campo) {
  return [...new Set(especialistas.map((esp) => esp[campo]))].sort((a, b) => a.localeCompare(b, 'es'));
}
