import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Save, Calendar, Lock, Sparkles, Trash2, Download, LineChart } from 'lucide-react';
import { MOODS, dateKey, MONTH_NAMES } from './journalData';
import { downloadMonthlyJournal, downloadTrackerSvg } from './journalExport';
import MoodChart from './MoodChart';

const STORAGE_KEY = 'mental-app-journal';

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [scale, setScale] = useState('semana');
  const chartRef = useRef(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const persistLocally = (lista) => localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (!response.ok) throw new Error('API unavailable or unauthorized');
      setEntries(await response.json());
      setIsOfflineMode(false);
    } catch (err) {
      console.warn('Using offline fallback for journal entries:', err);
      setIsOfflineMode(true);
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) setEntries(JSON.parse(local));
    }
  };

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedMood) return notify('error', 'Por favor, selecciona un estado de ánimo.');
    if (!content.trim()) return notify('error', 'Por favor, escribe cómo te sientes hoy.');

    setIsSaving(true);
    setMessage(null);

    const ahora = new Date();
    const newEntry = {
      id: Date.now(),
      moodEmoji: selectedMood.emoji,
      moodName: selectedMood.name,
      contenido: content,
      // El diario es siempre privado: ya no existe la opción de compartirlo
      estadoPrivacidad: 'PRIVATE',
      fecha: dateKey(ahora),
      fechaEntrada: ahora.toLocaleDateString('es-CL'),
      creadoEn: ahora.toISOString(),
    };

    const guardarLocal = () => {
      const updated = [newEntry, ...entries];
      setEntries(updated);
      persistLocally(updated);
    };

    if (isOfflineMode) {
      guardarLocal();
    } else {
      try {
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contenido: `${selectedMood.emoji} [${selectedMood.name}] ${content}`,
            estadoPrivacidad: 'PRIVATE',
          }),
        });
        if (!response.ok) throw new Error('POST failed');
        fetchEntries();
      } catch (err) {
        console.warn('Failed to save journal entry to API, using local storage:', err);
        setIsOfflineMode(true);
        guardarLocal();
      }
    }

    setIsSaving(false);
    setSelectedMood(null);
    setContent('');
    notify('success', 'Entrada guardada con éxito. ¡Gracias por expresarte!');
  };

  const handleDelete = async (id) => {
    if (!isOfflineMode) {
      try {
        await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Failed to delete journal entry from API:', err);
      }
    }
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
    persistLocally(updated);
    setPendingDelete(null);
    notify('success', 'Entrada eliminada.');
  };

  const hoy = new Date();

  return (
    <div className="journal">
      <form onSubmit={handleSave} className="journal-panel">
        <h3 className="journal-panel__title">
          <Sparkles aria-hidden="true" /> ¿Cómo te sientes hoy?
        </h3>

        <div className="journal-moods" role="group" aria-label="Estado de ánimo">
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              type="button"
              className="journal-mood"
              aria-pressed={selectedMood?.name === mood.name}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="journal-mood__emoji" aria-hidden="true">{mood.emoji}</span>
              <span className="journal-mood__name">{mood.name}</span>
            </button>
          ))}
        </div>

        <div className="journal-field">
          <label htmlFor="journal-content">Cuéntale a tu diario lo que estás viviendo</label>
          <textarea
            id="journal-content"
            className="journal-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe pensamientos, sensaciones físicas, o lo que causó tu estado de ánimo..."
          />
        </div>

        <div className="journal-actions">
          <p className="journal-note">
            <Lock aria-hidden="true" /> Tu diario es privado: solo tú puedes leerlo.
          </p>
          <button type="submit" className="journal-save" disabled={isSaving}>
            <Save aria-hidden="true" /> {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`journal-alert journal-alert--${message.type}`}
              role="status"
            >
              <AlertCircle aria-hidden="true" />
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="journal-panel">
        <div className="journal-history__head">
          <h3 className="journal-panel__title">Historial de Calma</h3>
          {isOfflineMode && <span className="journal-badge">Modo local</span>}
        </div>

        <div className="journal-entries">
          {entries.length === 0 ? (
            <p className="journal-empty">
              <Calendar aria-hidden="true" />
              No tienes entradas guardadas.
            </p>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="journal-entry">
                <div className="journal-entry__head">
                  <div className="journal-entry__mood">
                    <span aria-hidden="true">{entry.moodEmoji || '📝'}</span>
                    <span>{entry.moodName || 'Diario'}</span>
                  </div>
                  <div className="journal-entry__meta">
                    <span>{entry.fechaEntrada}</span>
                    <button
                      type="button"
                      className="journal-delete"
                      onClick={() => setPendingDelete(entry.id)}
                      aria-label={`Eliminar la entrada del ${entry.fechaEntrada}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p>
                  {entry.contenido && entry.contenido.includes(']')
                    ? entry.contenido.split(']').slice(1).join(']').trim()
                    : entry.contenido}
                </p>

                {pendingDelete === entry.id && (
                  <div className="journal-confirm" role="alertdialog" aria-label="Confirmar borrado">
                    <span>¿Eliminar esta entrada?</span>
                    <div className="journal-confirm__actions">
                      <button type="button" className="journal-confirm__yes" onClick={() => handleDelete(entry.id)}>
                        Eliminar
                      </button>
                      <button type="button" className="journal-confirm__no" onClick={() => setPendingDelete(null)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      <section className="journal-panel journal-tracker">
        <div className="journal-tracker__head">
          <h3 className="journal-panel__title">
            <LineChart aria-hidden="true" /> Tu tracker de ánimo
          </h3>

          <div className="journal-scale" role="group" aria-label="Escala del tracker">
            <button type="button" className="journal-scale__btn" aria-pressed={scale === 'semana'} onClick={() => setScale('semana')}>
              Semana
            </button>
            <button type="button" className="journal-scale__btn" aria-pressed={scale === 'mes'} onClick={() => setScale('mes')}>
              Mes
            </button>
          </div>
        </div>

        <p className="journal-tracker__hint">
          Cada día que guardas una entrada se dibuja un punto, y la línea se va completando sola a
          medida que avanzan los días.
        </p>

        <div className="journal-chart-wrap">
          <MoodChart entries={entries} scale={scale} svgRef={chartRef} />
        </div>

        <div className="journal-downloads">
          <button
            type="button"
            className="journal-download"
            onClick={() => downloadMonthlyJournal(entries, hoy.getFullYear(), hoy.getMonth())}
          >
            <Download aria-hidden="true" /> Descargar diario de {MONTH_NAMES[hoy.getMonth()]}
          </button>
          <button
            type="button"
            className="journal-download"
            onClick={() => downloadTrackerSvg(chartRef.current, `tracker-${scale}-${dateKey(hoy)}.svg`)}
          >
            <Download aria-hidden="true" /> Descargar tracker
          </button>
        </div>
      </section>
    </div>
  );
}
