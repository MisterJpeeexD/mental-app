import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Save, Calendar, Lock, Users, Sparkles } from 'lucide-react';

const MOODS = [
  { emoji: '😢', name: 'Triste', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { emoji: '😐', name: 'Neutral', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  { emoji: '🙂', name: 'Bien', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { emoji: '😄', name: 'Feliz', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { emoji: '😡', name: 'Estresado', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('PRIVATE');
  const [entries, setEntries] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
        setIsOfflineMode(false);
      } else {
        throw new Error('API unavailable or unauthorized');
      }
    } catch (err) {
      console.warn('Using offline fallback for journal entries:', err);
      // Fallback to localStorage if API fails or offline
      setIsOfflineMode(true);
      const local = localStorage.getItem('mental-app-journal');
      if (local) {
        setEntries(JSON.parse(local));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      setMessage({ type: 'error', text: 'Por favor, selecciona un estado de ánimo.' });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Por favor, escribe cómo te sientes hoy.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const newEntry = {
      id: Date.now(), // temporary id
      moodEmoji: selectedMood.emoji,
      moodName: selectedMood.name,
      contenido: content,
      estadoPrivacidad: privacy,
      fechaEntrada: new Date().toLocaleDateString('es-CL'),
      creadoEn: new Date().toISOString()
    };

    if (isOfflineMode) {
      // Save locally
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem('mental-app-journal', JSON.stringify(updated));
      finishSaveSuccess();
    } else {
      // Save to Spring Boot API
      try {
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contenido: `${selectedMood.emoji} [${selectedMood.name}] ${content}`,
            estadoPrivacidad: privacy
          })
        });

        if (response.ok) {
          fetchEntries();
          finishSaveSuccess();
        } else {
          throw new Error('POST failed');
        }
      } catch (err) {
        console.warn('Failed to save journal entry to API, using local storage:', err);
        // Fallback to local save if API request fails
        setIsOfflineMode(true);
        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem('mental-app-journal', JSON.stringify(updated));
        finishSaveSuccess();
      }
    }
  };

  const finishSaveSuccess = () => {
    setIsSaving(false);
    setSelectedMood(null);
    setContent('');
    setMessage({ type: 'success', text: 'Entrada guardada con éxito. ¡Gracias por expresarte!' });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-2">
      {/* Entry Form */}
      <form onSubmit={handleSave} className="md:col-span-3 bg-white/2 block border border-white/5 rounded-2xl p-5 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> ¿Cómo te sientes hoy?
        </h3>

        {/* Emojis Selector */}
        <div className="flex justify-between gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              type="button"
              onClick={() => setSelectedMood(mood)}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border cursor-pointer transition-all active:scale-95 ${
                selectedMood?.name === mood.name
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-[11px] font-semibold">{mood.name}</span>
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400">Cuéntale a tu diario lo que estás viviendo:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Escribe pensamientos, sensaciones físicas, o lo que causó tu estado de ánimo..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 focus:shadow-md focus:shadow-indigo-500/5 transition-all text-sm resize-none"
          />
        </div>

        {/* Privacy options */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Privacidad:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPrivacy('PRIVATE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  privacy === 'PRIVATE'
                    ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
                title="Solo visible para ti"
              >
                <Lock className="w-3.5 h-3.5" /> Privado
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('PROFESSIONAL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  privacy === 'PROFESSIONAL'
                    ? 'bg-violet-600/20 border-violet-500/30 text-violet-400'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
                title="Compartido con tu terapeuta asignado"
              >
                <Users className="w-3.5 h-3.5" /> Profesional
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold ${
                message.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                  : 'bg-rose-500/15 border border-rose-500/25 text-rose-400'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* History List */}
      <div className="md:col-span-2 bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Historial de Calma</h3>
          {isOfflineMode && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
              Modo Local
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 scrollable">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              No tienes entradas guardadas.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/3 border border-white/5 rounded-xl p-3.5 flex flex-col gap-1.5 hover:bg-white/5 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.moodEmoji || '📝'}</span>
                    <span className="text-xs font-bold text-gray-300">
                      {entry.moodName || 'Diario'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                    {entry.estadoPrivacidad === 'PRIVATE' ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Users className="w-3 h-3" />
                    )}
                    <span>{entry.fechaEntrada}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed break-words">
                  {entry.contenido && entry.contenido.includes(']')
                    ? entry.contenido.split(']').slice(1).join(']').trim()
                    : entry.contenido}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
