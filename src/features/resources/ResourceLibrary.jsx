import React, { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { resourceData } from './resourceData';

export default function ResourceLibrary() {
  const [query, setQuery] = useState('');

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return resourceData;
    }

    return resourceData.filter((resource) => {
      const haystack = `${resource.title} ${resource.author} ${resource.description} ${resource.category} ${resource.tags.join(' ')}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query]);

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
          aria-label="Buscar recursos"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          placeholder="Buscar guías, ejercicios o técnicas..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredResources.map((resource) => (
          <article key={resource.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-200">
                {resource.category}
              </span>
              <span className="text-xs text-gray-400">{resource.type}</span>
            </div>
            <h4 className="mt-3 text-base font-semibold text-white">{resource.title}</h4>
            <p className="mt-2 text-sm text-gray-400">{resource.description}</p>
            <p className="mt-3 text-sm text-gray-300">Por {resource.author}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-xs text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-purple-300">{resource.price}</span>
              <span className="text-gray-400">{resource.type}</span>
            </div>
          </article>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-gray-300">
          No encontramos recursos con esa búsqueda. Prueba con otra palabra clave.
        </div>
      )}
    </div>
  );
}
