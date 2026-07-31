import React from 'react';
import { MessageSquare, PlusCircle } from 'lucide-react';

export default function CommunityForum() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Foro de la Comunidad
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Espacio seguro y moderado para compartir experiencias y apoyarse mutuamente.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-xl transition">
          <PlusCircle className="w-4 h-4" />
          Nuevo Tema
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-gray-300">
        <p className="text-sm">No hay publicaciones recientes en esta sección aún.</p>
      </div>
    </div>
  );
}
