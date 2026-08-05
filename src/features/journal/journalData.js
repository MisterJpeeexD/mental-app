/* Escala de ánimo y utilidades de fecha del diario.
   El `score` es explícito y no depende del orden del arreglo: el tracker lo usa
   como altura del punto, así que reordenar MOODS no debe mover el gráfico. */

export const MOODS = [
  { emoji: '😡', name: 'Estresado', score: 1, color: '#e05a5a' },
  { emoji: '😢', name: 'Triste', score: 2, color: '#6b8fd4' },
  { emoji: '😐', name: 'Neutral', score: 3, color: '#8f8f97' },
  { emoji: '🙂', name: 'Bien', score: 4, color: '#4bb98a' },
  { emoji: '😄', name: 'Feliz', score: 5, color: '#e39a3c' },
  { emoji: '🤩', name: 'Emocionado', score: 6, color: '#b06fd0' },
];

export const MAX_SCORE = MOODS.length;

/* Preguntas guía para cuando cuesta arrancar. La primera es la que pidió el
   equipo; las demás siguen la misma idea: nombrar la emoción y el momento que
   la detonó, que es justo lo que separa el selector de ánimo del texto. */
export const PROMPTS = [
  'Al repasar tu último día, ¿cuáles fueron las emociones más intensas que sentiste (desde la alegría, gratitud o paz, hasta el enojo, tristeza o miedo) y qué momentos exactos las detonaron?',
  '¿Hubo algún momento del día en que tu cuerpo reaccionó antes que tu cabeza? ¿Qué estaba pasando justo ahí?',
  'Si tuvieras que ponerle nombre a lo que sentiste hoy con una sola palabra, ¿cuál sería y qué la provocó?',
  '¿Qué cosa pequeña te hizo bien hoy, aunque el día en general haya sido difícil?',
  '¿Qué le dirías a alguien que quieres si hubiera vivido exactamente tu día de hoy?',
];

/* Cambia sola cada día para que la pregunta no se vuelva parte del decorado */
export const promptOfTheDay = (date = new Date()) => date.getDate() % PROMPTS.length;

export const moodByName = (name) => MOODS.find((mood) => mood.name === name);
export const moodByScore = (score) => MOODS.find((mood) => mood.score === score);

/* Clave local YYYY-MM-DD. No usa toISOString porque convierte a UTC y en Chile
   adelantaría un día las entradas de la tarde/noche. */
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* La API guarda todo en un solo campo `contenido`, con el prefijo
   "😄 [Feliz] texto". Aquí se separa para que la lista y el tracker tengan
   emoji y nombre, y se normaliza la fecha: la API la manda ISO y el respaldo
   local en formato chileno. */
export function parseEntry(raw) {
  const coincidencia = /^\s*(\S+)\s*\[([^\]]+)\]\s*([\s\S]*)$/.exec(raw.contenido || '');
  const iso = /^\d{4}-\d{2}-\d{2}$/;

  let fecha = raw.fecha;
  if (!fecha && iso.test(raw.fechaEntrada || '')) fecha = raw.fechaEntrada;
  if (!fecha && raw.creadoEn) fecha = dateKey(new Date(raw.creadoEn));

  return {
    ...raw,
    moodEmoji: raw.moodEmoji || (coincidencia ? coincidencia[1] : null),
    moodName: raw.moodName || (coincidencia ? coincidencia[2] : null),
    fecha,
    fechaEntrada: fecha
      ? new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CL')
      : raw.fechaEntrada,
  };
}

/* Entradas antiguas solo traen `creadoEn` (ISO) o `fechaEntrada` (dd-mm-aaaa) */
export function entryDateKey(entry) {
  if (entry.fecha) return entry.fecha;
  if (entry.creadoEn) return dateKey(new Date(entry.creadoEn));
  const partes = (entry.fechaEntrada || '').split('-');
  if (partes.length === 3) {
    const [d, m, y] = partes;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return null;
}

export const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

/* Los 7 días que terminan hoy, para la vista semanal */
export function lastSevenDays(today = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });
}

/* Meses que tienen al menos una entrada, del más reciente al más antiguo.
   Alimenta la lista de descargas del archivo. */
export function monthsWithEntries(entries) {
  const conteo = new Map();
  entries.forEach((entry) => {
    const key = entryDateKey(entry);
    if (key) conteo.set(key.slice(0, 7), (conteo.get(key.slice(0, 7)) || 0) + 1);
  });

  return [...conteo.entries()]
    .map(([ym, total]) => {
      const [year, mes] = ym.split('-').map(Number);
      return { year, month: mes - 1, total, label: `${MONTH_NAMES[mes - 1]} ${year}` };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

/* Un punto por día: si hay varias entradas ese día, vale la más reciente */
export function scoresByDay(entries) {
  const map = new Map();
  [...entries]
    .sort((a, b) => new Date(a.creadoEn || 0) - new Date(b.creadoEn || 0))
    .forEach((entry) => {
      const key = entryDateKey(entry);
      const mood = moodByName(entry.moodName);
      if (key && mood) map.set(key, mood);
    });
  return map;
}
