/* Datos de terapias, terapeutas y guía de orientación obtenidas vía API */

export const especialistas = [];

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
