import { MONTH_NAMES, entryDateKey } from './journalData';

/* Descargas sin dependencias: se arma un Blob y se dispara un <a download>. */
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/* El diario del mes como texto plano legible en cualquier parte */
export function downloadMonthlyJournal(entries, year, month) {
  const mes = MONTH_NAMES[month];
  const delMes = entries
    .filter((entry) => {
      const key = entryDateKey(entry);
      return key && key.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`);
    })
    .sort((a, b) => entryDateKey(a).localeCompare(entryDateKey(b)));

  const cuerpo = delMes.length === 0
    ? 'No hay entradas registradas este mes.\n'
    : delMes.map((entry) => {
      const [, , dia] = entryDateKey(entry).split('-');
      const texto = entry.contenido?.includes(']')
        ? entry.contenido.split(']').slice(1).join(']').trim()
        : entry.contenido;
      return `## ${dia} de ${mes}\n\n${entry.moodEmoji || ''} ${entry.moodName || 'Diario'}\n\n${texto}\n`;
    }).join('\n');

  const contenido = [
    `# Diario emocional — ${mes} de ${year}`,
    '',
    `Entradas: ${delMes.length}`,
    '',
    cuerpo,
    '',
    '---',
    'AbrazaMente · Este archivo es privado y se generó en tu propio dispositivo.',
    '',
  ].join('\n');

  download(new Blob([contenido], { type: 'text/markdown;charset=utf-8' }), `diario-${mes}-${year}.md`);
}

/* El tracker tal cual se ve: el SVG se serializa desde el DOM, por eso sus
   colores van como atributos y no por CSS (si no, saldría sin estilos). */
export function downloadTrackerSvg(svgElement, filename) {
  if (!svgElement) return;
  const clone = svgElement.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const markup = new XMLSerializer().serializeToString(clone);
  download(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }), filename);
}
