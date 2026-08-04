import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, MessageSquare, Heart, Share2, Plus, Trash2, ShieldCheck, UserCheck } from 'lucide-react';

/* ─── Paleta ─────────────────────────────────────────────── */
const BRAND = {
  blue:   '#3E7BFA',
  orange: '#FF8A65',
  teal:   '#4DD0E1',
  purple: '#BA68C8'
};

const INITIAL_TOPICS = [
  { id: 'todos', name: 'Todas las temáticas', desc: 'Todo el muro', count: 4, color: 'bg-blue-500' },
  { id: '1', name: 'Ansiedad y Estrés', desc: 'Herramientas y apoyo diario', count: 142, color: 'bg-orange-500' },
  { id: '2', name: 'Depresión y Ánimo', desc: 'Acompañamiento en el proceso', count: 98, color: 'bg-purple-500' },
  { id: '3', name: 'Desarrollo Personal', desc: 'Hábitos y autoestima', count: 215, color: 'bg-teal-400' },
  { id: '4', name: 'Mindfulness y Meditación', desc: 'Atención plena cotidiana', count: 120, color: 'bg-green-500' }
];

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Camila R.',
    initials: 'CR',
    color: 'from-teal-300 to-teal-500',
    anonymous: false,
    isMine: false,
    topic: '1',
    time: 'hace 2 h',
    text: 'Hoy tuve un día difícil, pero practiqué la respiración 4-7-8 antes de la reunión y me ayudó a calmar los latidos. Un pequeño paso pero estoy orgullosa.',
    likes: 12,
    liked: false,
    comments: [
      { id: 101, author: 'Martín V.', text: '¡Excelente técnica! A mí me sirve mucho contar despacio.', time: 'hace 1 h' }
    ]
  },
  {
    id: 2,
    author: 'Anónimo',
    initials: 'AN',
    color: 'from-purple-400 to-purple-600',
    anonymous: true,
    isMine: false,
    topic: '2',
    time: 'hace 5 h',
    text: 'A veces el duelo se siente como olas. Algunos días están tranquilos y de pronto viene una muy fuerte. Gracias a todos en esta comunidad por ser un refugio seguro.',
    likes: 24,
    liked: true,
    comments: []
  }
];

/* ─── Overlay para visitantes no autenticados ─────────────── */
function GuestOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl" style={{
      background: 'rgba(18,18,18,0.3)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
    }}>
      <div className="w-full max-w-[420px] p-10 text-center rounded-[28px] border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.15)]" style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)'
      }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center shadow-[0_12px_28px_rgba(62,123,250,0.3)]" style={{
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold mb-2.5 text-gray-900 tracking-tight">Únete a la comunidad</h2>
        <p className="text-[0.9rem] text-gray-500 leading-relaxed mb-7">
          Crea una cuenta para acceder al espacio de comunidad: un lugar moderado para compartir tu proceso y conectar con personas que entienden lo que vives.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            to="/registro"
            className="flex items-center justify-center h-12 rounded-xl text-white font-bold text-[0.92rem] shadow-[0_8px_20px_rgba(62,123,250,0.3)] transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})` }}
          >
            Crear cuenta gratis
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center h-11 rounded-xl font-semibold text-[0.88rem] transition-colors"
            style={{ background: 'rgba(62,123,250,0.08)', border: '1px solid rgba(62,123,250,0.2)', color: BRAND.blue }}
          >
            Ya tengo cuenta → Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Vista principal ─────────────────────────────────────── */
export default function CommunityForum() {
  const { isAuthenticated, user } = useAuth();
  const [activeTopic, setActiveTopic] = useState('todos');
  const [activeFriendTab, setActiveFriendTab] = useState('sugerencias');

  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [posts, setPosts] = useState(INITIAL_POSTS);

  useEffect(() => {
    fetch('/api/foros')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const apiTopics = [
            { id: 'todos', name: 'Todas las temáticas', desc: 'Todo el muro', count: 0, color: 'bg-blue-500' },
            ...data.map((f, i) => ({
              id: f.id.toString(),
              name: f.nombre,
              desc: f.descripcion || 'Espacio de acompañamiento',
              count: f.numeroMiembros || 0,
              color: ['bg-orange-500', 'bg-purple-500', 'bg-teal-400', 'bg-green-500', 'bg-pink-500'][i % 5]
            }))
          ];
          setTopics(apiTopics);
        }
      })
      .catch(err => console.warn('Usando foros por defecto:', err));

    fetch('/api/foros/temas/recientes')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const apiPosts = data.map(t => ({
            id: t.id,
            author: t.usuario ? `${t.usuario.nombres} ${t.usuario.apellidos?.[0] || ''}.` : 'Comunidad AbrazaMente',
            initials: t.usuario ? `${t.usuario.nombres?.[0] || 'A'}${t.usuario.apellidos?.[0] || 'M'}` : 'AM',
            color: 'from-blue-400 to-blue-600',
            anonymous: false,
            isMine: user && t.usuario?.id === user.id,
            topic: t.foro ? t.foro.id.toString() : 'todos',
            time: 'reciente',
            text: `${t.titulo}\n\n${t.contenido || ''}`,
            likes: t.vistas || 5,
            liked: false,
            comments: []
          }));
          setPosts(apiPosts);
        }
      })
      .catch(err => console.warn('Usando publicaciones por defecto:', err));
  }, [user]);

  const [composerText, setComposerText] = useState('');
  const [composerTopic, setComposerTopic] = useState('ansiedad');
  const [composerAnon, setComposerAnon] = useState(false);

  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  function handleCreatePost(e) {
    e.preventDefault();
    if (!composerText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: composerAnon ? 'Anónimo' : (user?.nombres || 'Tú'),
      initials: composerAnon ? 'AN' : (user?.nombres?.[0]?.toUpperCase() || 'TÚ'),
      color: composerAnon ? 'from-purple-400 to-purple-600' : 'from-blue-400 to-blue-600',
      anonymous: composerAnon,
      isMine: true,
      topic: composerTopic,
      time: 'justo ahora',
      text: composerText.trim(),
      likes: 0,
      liked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setComposerText('');
    showToast('Tu publicación se ha compartido en la comunidad');
  }

  function toggleLike(postId) {
    setPosts(list => list.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  }

  function deletePost(postId) {
    if (!window.confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
    setPosts(list => list.filter(p => p.id !== postId));
    showToast('Publicación eliminada correctamente');
  }

  function handleAddTopic(e) {
    e.preventDefault();
    const name = newTopicName.trim();
    if (!name) return;

    const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'tematica';
    let id = baseId;
    let counter = 2;
    while (topics.some(t => t.id === id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-400', 'bg-orange-500', 'bg-pink-500', 'bg-green-500'];
    const color = colors[topics.length % colors.length];

    const newTopic = { id, name, desc: 'Temática creada por la comunidad', count: 0, color };
    setTopics([...topics, newTopic]);
    setComposerTopic(id);
    setNewTopicName('');
    setIsAddingTopic(false);
    showToast(`Nueva temática "${name}" creada`);
  }

  const filteredPosts = activeTopic === 'todos' ? posts : posts.filter(p => p.topic === activeTopic);
  const friends = [
    { name: 'Camila Reyes', desc: 'Comunidad de Ansiedad', initials: 'CR', color: 'from-teal-300 to-teal-400' },
    { name: 'Daniela Muñoz', desc: '5 amigos en común', initials: 'DM', color: 'from-orange-200 to-orange-300' },
    { name: 'Ale Torres', desc: 'Comunidad de Vínculos', initials: 'AT', color: 'from-blue-300 to-blue-400' },
  ];

  const glassPanelClass = "bg-white/60 backdrop-blur-[22px] border border-white/70 rounded-[28px] shadow-[0_20px_45px_rgba(0,0,0,0.05)]";

  return (
    <div className="flex flex-col gap-6 relative min-h-[600px] w-full max-w-[1400px] mx-auto px-4 md:px-0">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900/90 text-white px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md text-sm font-semibold animate-fade-in">
          {toastMsg}
        </div>
      )}

      <div 
        className={`grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_340px] gap-6 w-full ${!isAuthenticated ? 'blur-[4px] pointer-events-none select-none' : ''}`}
      >
        {/* Columna Izquierda: Perfil y Temáticas */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 h-max min-w-0">
          {isAuthenticated && (
            <div className={`${glassPanelClass} flex items-center gap-3 p-4`}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                {user?.nombres?.[0]?.toUpperCase() || 'TÚ'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[0.92rem] text-gray-900">{user?.nombres || 'Miembro Activo'}</span>
                <span className="text-[0.76rem] text-gray-500">Miembro de la comunidad</span>
              </div>
            </div>
          )}

          <div className={`${glassPanelClass} pb-3`}>
            <div className="flex items-center justify-between px-5 pt-5 pb-2 text-[0.78rem] font-extrabold uppercase tracking-wider text-gray-400">
              <span>Temáticas</span>
            </div>
            <ul className="flex flex-col gap-1 p-2.5">
              {topics.map(t => {
                const isActive = activeTopic === t.id;
                const count = t.id === 'todos' ? posts.length : posts.filter(p => p.topic === t.id).length;
                return (
                  <li key={t.id}>
                    <button 
                      onClick={() => setActiveTopic(t.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all ${isActive ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-gray-500/5'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_0_4px_rgba(0,0,0,0.03)] ${t.color}`} />
                      <div className="flex flex-col min-w-0 flex-1 pr-1">
                        <span className="font-semibold text-[0.88rem] text-gray-900 truncate">{t.name}</span>
                        <span className="text-[0.7rem] text-gray-500 truncate">{t.desc}</span>
                      </div>
                      <span className={`text-[0.68rem] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-blue-500/15 text-blue-600' : 'bg-gray-500/10 text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Añadir temática dinámica */}
            <div className="px-3 pt-2">
              {isAddingTopic ? (
                <form onSubmit={handleAddTopic} className="flex flex-col gap-2 p-3 bg-gray-500/5 rounded-2xl border border-gray-200/60">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Nueva temática…"
                    maxLength={30}
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="w-full px-3 py-2 text-[0.82rem] bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-gray-900"
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" disabled={!newTopicName.trim()} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[0.75rem] rounded-xl disabled:opacity-50 transition-colors">
                      Crear
                    </button>
                    <button type="button" onClick={() => { setIsAddingTopic(false); setNewTopicName(''); }} className="px-3 py-1.5 bg-gray-200 text-gray-700 font-semibold text-[0.75rem] rounded-xl hover:bg-gray-300 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTopic(true)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-gray-300/80 rounded-2xl text-[0.82rem] font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir temática</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Columna Central: Feed */}
        <div className="flex flex-col gap-5 min-w-0">
          {isAuthenticated ? (
            <>
              {/* Composer */}
              <form onSubmit={handleCreatePost} className={`${glassPanelClass} p-5 flex flex-col gap-3.5 overflow-hidden`}>
                <div className="flex gap-3.5 items-start w-full">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                    {user?.nombres?.[0]?.toUpperCase() || 'TÚ'}
                  </div>
                  <textarea
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder="¿Qué estás pensando o sintiendo hoy? Compártelo con la comunidad…"
                    className="flex-1 min-w-0 min-h-[64px] resize-none border-none outline-none bg-gray-500/5 focus:bg-gray-500/10 focus:ring-[3px] focus:ring-blue-500/15 rounded-2xl p-3.5 text-[0.95rem] text-gray-900 transition-all placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap w-full pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <select 
                      value={composerTopic}
                      onChange={(e) => setComposerTopic(e.target.value)}
                      className="border border-gray-300/40 bg-white/70 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold text-gray-800 outline-none hover:bg-white transition-colors"
                    >
                      {topics.filter(t => t.id !== 'todos').map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 font-medium cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={composerAnon}
                        onChange={(e) => setComposerAnon(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Modo Incógnito</span>
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!composerText.trim()}
                    className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-[0.88rem] shadow-[0_8px_18px_rgba(62,123,250,0.25)] transition-all hover:scale-[1.03]"
                  >
                    Publicar
                  </button>
                </div>
              </form>

              {/* Feed Filter Indicator */}
              <div className="flex items-center gap-2.5 px-1 py-1 text-gray-500 text-[0.85rem]">
                <span>Mostrando temáticas:</span>
                <strong className="text-gray-900 font-bold">
                  {topics.find(t => t.id === activeTopic)?.name || 'Todas'}
                </strong>
                {activeTopic !== 'todos' && (
                  <button type="button" onClick={() => setActiveTopic('todos')} className="ml-auto text-blue-600 font-bold text-[0.8rem] hover:underline">
                    Ver todas
                  </button>
                )}
              </div>

              {/* Feed Posts */}
              <div className="flex flex-col gap-4">
                {filteredPosts.length === 0 ? (
                  <div className={`${glassPanelClass} p-8 text-center text-gray-500 text-sm`}>
                    No hay publicaciones en esta temática todavía. ¡Sé el primero en compartir!
                  </div>
                ) : (
                  filteredPosts.map(post => {
                    const topicObj = topics.find(t => t.id === post.topic);
                    return (
                      <div key={post.id} className={`${glassPanelClass} p-5 flex flex-col gap-3.5 hover:shadow-[0_24px_50px_rgba(0,0,0,0.07)] transition-shadow`}>
                        <div className="flex gap-3 items-start justify-between">
                          <div className="flex gap-3 items-start">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 bg-gradient-to-br ${post.color} shadow-sm`}>
                              {post.initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-[0.94rem] text-gray-900">{post.author}</span>
                              <div className="flex items-center gap-1.5 text-[0.76rem] text-gray-500 flex-wrap">
                                <span>{post.time}</span>
                                <span>·</span>
                                {topicObj && (
                                  <span className="font-bold px-2 py-0.5 rounded-full text-[0.68rem] bg-blue-500/10 text-blue-600">
                                    {topicObj.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Trash button for owned posts */}
                          {post.isMine && (
                            <button 
                              onClick={() => deletePost(post.id)}
                              title="Eliminar publicación"
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <p className="text-[0.96rem] leading-relaxed text-gray-800 whitespace-pre-wrap">
                          {post.text}
                        </p>

                        <div className="flex items-center gap-3 border-t border-gray-200/60 pt-2.5 mt-1">
                          <button 
                            onClick={() => toggleLike(post.id)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.82rem] font-semibold transition-colors ${post.liked ? 'bg-red-500/10 text-red-500' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                          >
                            <Heart className={`w-[17px] h-[17px] ${post.liked ? 'fill-red-500' : ''}`} /> 
                            <span>{post.likes}</span>
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.82rem] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            <MessageSquare className="w-[17px] h-[17px]" /> 
                            <span>{post.comments?.length || 0}</span>
                          </button>
                          <button onClick={() => showToast('Enlace copiado al portapapeles')} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.82rem] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors ml-auto">
                            <Share2 className="w-[17px] h-[17px]" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`${glassPanelClass} p-5 h-[120px] bg-white/40`} />
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Comunidad y amigos */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 h-max hidden md:flex min-w-0">
          <div className={`${glassPanelClass} overflow-hidden`}>
            <div className="flex items-center justify-between px-5 pt-5 pb-1 text-[0.78rem] font-extrabold uppercase tracking-wider text-gray-400">
              <span>Comunidad y amigos</span>
            </div>
            <div className="flex gap-1 px-2 pt-3.5">
              {['Sugerencias', 'Solicitudes', 'Mis amigos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFriendTab(tab.toLowerCase())}
                  className={`relative flex-1 text-center py-2 px-1 rounded-xl font-bold text-[0.68rem] transition-colors ${activeFriendTab === tab.toLowerCase() ? 'bg-blue-500/10 text-blue-600' : 'text-gray-500 hover:bg-gray-500/5'}`}
                >
                  <span className="whitespace-nowrap">{tab}</span>
                  {tab === 'Solicitudes' && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[0.55rem] font-extrabold min-w-[16px] h-[16px] rounded-full flex items-center justify-center border border-white">2</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-3.5 flex flex-col gap-2.5 max-h-[420px] overflow-y-auto">
              {activeFriendTab === 'sugerencias' && friends.map(f => (
                <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-500/5 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-[0.75rem] shrink-0 bg-gradient-to-br shadow-sm ${f.color}`}>
                    {f.initials}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 pr-1">
                    <span className="font-bold text-[0.84rem] text-gray-900 truncate">{f.name}</span>
                    <span className="text-[0.72rem] text-gray-500 truncate">{f.desc}</span>
                  </div>
                  <button onClick={() => showToast(`Solicitud enviada a ${f.name}`)} className="shrink-0 max-w-[85px] border-none rounded-full px-2.5 py-1.5 text-[0.7rem] font-bold bg-blue-600 text-white hover:scale-105 hover:bg-blue-700 transition-all whitespace-nowrap">
                    + Agregar
                  </button>
                </div>
              ))}
              {activeFriendTab !== 'sugerencias' && (
                <div className="text-center py-6 px-2 text-gray-500 text-[0.85rem]">
                  No hay {activeFriendTab} por ahora.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Overlay para no autenticados */}
      {!isAuthenticated && <GuestOverlay />}
    </div>
  );
}
