import React, { useState } from 'react';
import { MessageSquare, PlusCircle, Heart, ThumbsUp, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

// Datos de muestra para mostrar el foro en modo lectura a visitantes
const SAMPLE_POSTS = [
  {
    id: 1,
    author: 'Sofía M.',
    avatar: '🌸',
    time: 'hace 2 horas',
    title: '¿Cómo manejan la ansiedad antes de eventos importantes?',
    body: 'Últimamente he estado practicando la respiración 4-7-8 y me ha ayudado mucho. ¿Qué técnicas usan ustedes?',
    likes: 14,
    comments: 6,
    tags: ['ansiedad', 'técnicas'],
  },
  {
    id: 2,
    author: 'Carlos R.',
    avatar: '🌿',
    time: 'hace 5 horas',
    title: 'Compartiendo mi experiencia con el journaling diario',
    body: 'Llevar un diario emocional me cambió la vida. Al principio se sentía raro, pero después de un mes noté patrones en mis emociones.',
    likes: 22,
    comments: 9,
    tags: ['journaling', 'hábitos'],
  },
  {
    id: 3,
    author: 'Ana L.',
    avatar: '🦋',
    time: 'hace 1 día',
    title: 'Recursos para el manejo del duelo',
    body: 'Estoy atravesando un momento difícil y me gustaría conocer qué recursos encontraron útiles. Cualquier recomendación es bienvenida.',
    likes: 31,
    comments: 15,
    tags: ['duelo', 'apoyo'],
  },
];

function AuthGate({ children, label }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return children;

  return (
    <button
      onClick={() => navigate('/login')}
      title="Inicia sesión para participar"
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors cursor-pointer"
      aria-label={`${label} — inicia sesión para participar`}
    >
      <Lock className="w-3 h-3" />
      {label}
    </button>
  );
}

function PostCard({ post }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/20 transition-colors">
      {/* Header del post */}
      <div className="flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label="avatar">{post.avatar}</span>
        <div>
          <p className="text-sm font-semibold text-white">{post.author}</p>
          <p className="text-xs text-gray-500">{post.time}</p>
        </div>
      </div>

      {/* Contenido */}
      <div>
        <h4 className="text-base font-bold text-white mb-1">{post.title}</h4>
        <p className="text-sm text-gray-300 leading-relaxed">{post.body}</p>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full px-2 py-0.5"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/5">
        {isAuthenticated ? (
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              liked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-pink-400' : ''}`} />
            {likes}
          </button>
        ) : (
          <AuthGate label={`${likes} Me gusta`}>
            <span />
          </AuthGate>
        )}

        {isAuthenticated ? (
          <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
            {post.comments} Respuestas
          </button>
        ) : (
          <AuthGate label={`${post.comments} Respuestas`}>
            <span />
          </AuthGate>
        )}
      </div>
    </article>
  );
}

export default function CommunityForum() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
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

        {isAuthenticated ? (
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-xl transition">
            <PlusCircle className="w-4 h-4" />
            Nuevo Tema
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-gray-300 text-sm px-4 py-2 rounded-xl transition border border-white/10"
            title="Inicia sesión para crear un tema"
          >
            <LogIn className="w-4 h-4" />
            Únete para participar
          </button>
        )}
      </div>

      {/* Banner informativo para visitantes */}
      {!isAuthenticated && (
        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-300">Estás viendo en modo lectura</p>
            <p className="text-xs text-gray-400 mt-1">
              Puedes explorar los temas de la comunidad.{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Inicia sesión
              </button>{' '}
              o{' '}
              <button
                onClick={() => navigate('/registro')}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                regístrate
              </button>{' '}
              para comentar y reaccionar.
            </p>
          </div>
        </div>
      )}

      {/* Lista de posts */}
      <div className="space-y-4">
        {SAMPLE_POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
