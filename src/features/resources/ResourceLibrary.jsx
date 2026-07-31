import React from 'react';
import { BookOpen, Search } from 'lucide-react';

export default function ResourceLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Biblioteca de Recursos Psicoeducativos
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Encuentra guías prácticas, artículos y contenido multimedia para tu bienestar emocional.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar guías, ejercicios o técnicas..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-gray-300">
        <p className="text-sm">Explora las guías clínicas y herramientas recomendadas por expertos.</p>
      </div>
    </div>
  );
}
