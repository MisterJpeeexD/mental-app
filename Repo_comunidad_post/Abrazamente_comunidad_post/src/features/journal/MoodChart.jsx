import { useContext, useMemo } from 'react';
import { MOODS, MAX_SCORE, dateKey, daysInMonth, lastSevenDays, scoresByDay, MONTH_NAMES } from './journalData';
import { ThemeContext } from '../../context/ThemeContext';

/* Medidas del lienzo. El SVG se escala al ancho del contenedor con el viewBox,
   así que estas unidades son internas y no dependen de la pantalla. */
const GUTTER = 42;
const PAD_RIGHT = 14;
const PAD_TOP = 18;
const ROW = 30;
const AXIS = 30;
const COL = 34;

/* Paleta del "papel" de bullet journal, una por tema. Van como atributos (no
   por CSS) para que la descarga del SVG conserve los colores reales. */
const PALETTE = {
  light: {
    paper: '#fdfbf7',
    ink: '#3f3f46',
    guide: '#d9d4cc',
    line: '#5b7cc4',
  },
  dark: {
    paper: '#1d1e24',
    ink: '#e4e4e7',
    guide: '#3a3b42',
    line: '#8ab0ff',
  },
};

/* `year` y `month` permiten dibujar un mes pasado (lo usa la descarga del
   archivo); sin ellos se dibuja el mes en curso. */
export default function MoodChart({ entries, scale, svgRef, year, month }) {
  const { theme } = useContext(ThemeContext) || {};
  const { paper, ink, guide, line } = PALETTE[theme === 'dark' ? 'dark' : 'light'];
  const hoy = new Date();
  const anio = year ?? hoy.getFullYear();
  const mes = month ?? hoy.getMonth();

  const dias = useMemo(() => {
    if (scale === 'semana') {
      return lastSevenDays(hoy).map((d) => ({ key: dateKey(d), label: String(d.getDate()) }));
    }
    return Array.from({ length: daysInMonth(anio, mes) }, (_, i) => ({
      key: dateKey(new Date(anio, mes, i + 1)),
      label: String(i + 1),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, anio, mes, hoy.getFullYear(), hoy.getMonth(), hoy.getDate()]);

  const porDia = useMemo(() => scoresByDay(entries), [entries]);

  /* En la semana hay solo 7 columnas: con el ancho de mes (34) el SVG quedaría
     chico y el panel lo estiraría, agrandando los emojis del eje. Más
     espaciado por día deja el ancho natural (~1:1) y la escala como en el mes. */
  const col = scale === 'semana' ? 54 : COL;

  const width = GUTTER + dias.length * col + PAD_RIGHT;
  const height = PAD_TOP + MAX_SCORE * ROW + AXIS;
  const cx = (i) => GUTTER + i * col + col / 2;
  const cy = (score) => PAD_TOP + (MAX_SCORE - score) * ROW + ROW / 2;

  // Tramos: la línea solo une días consecutivos con registro, así los huecos se ven
  const puntos = dias.map((dia, i) => ({ i, mood: porDia.get(dia.key) })).filter((p) => p.mood);
  const tramos = [];
  puntos.forEach((p, idx) => {
    const previo = puntos[idx - 1];
    if (previo && p.i === previo.i + 1) {
      tramos.push({ x1: cx(previo.i), y1: cy(previo.mood.score), x2: cx(p.i), y2: cy(p.mood.score) });
    }
  });

  const titulo = scale === 'semana'
    ? 'Últimos 7 días'
    : `${MONTH_NAMES[mes]} ${anio}`;

  return (
    <svg
      ref={svgRef}
      className="mood-chart"
      /* Reserva ~26px por día: el mes no se encoge hasta ser ilegible, el
         contenedor lo desplaza en horizontal */
      style={{ minWidth: `${dias.length * 26 + GUTTER + PAD_RIGHT}px` }}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Tracker de ánimo: ${titulo}. ${puntos.length} de ${dias.length} días registrados.`}
    >
      <rect x="0" y="0" width={width} height={height} rx="14" fill={paper} />

      {/* Retícula punteada, como la hoja de un bullet journal */}
      {MOODS.map((mood) => (
        <line
          key={`guia-${mood.score}`}
          x1={GUTTER - 6}
          y1={cy(mood.score)}
          x2={width - PAD_RIGHT + 4}
          y2={cy(mood.score)}
          stroke={guide}
          strokeWidth="1"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
      ))}

      {/* Escala de ánimos */}
      {MOODS.map((mood) => (
        <text
          key={`emoji-${mood.score}`}
          x={GUTTER / 2}
          y={cy(mood.score)}
          fontSize="16"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {mood.emoji}
        </text>
      ))}

      {/* Números de día */}
      {dias.map((dia, i) => (
        <text
          key={`dia-${dia.key}`}
          x={cx(i)}
          y={height - AXIS / 2}
          fontSize="11"
          fill={ink}
          opacity="0.65"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Inter, sans-serif"
        >
          {dia.label}
        </text>
      ))}

      {tramos.map((t) => (
        <line
          key={`tramo-${t.x1}-${t.y1}`}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={line}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      {puntos.map((p) => (
        <circle
          key={`punto-${p.i}`}
          cx={cx(p.i)}
          cy={cy(p.mood.score)}
          r="5"
          fill={p.mood.color}
          stroke={paper}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
