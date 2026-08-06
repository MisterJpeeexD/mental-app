import { useEffect, useRef, useState } from 'react';
import { EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import '../styles/comunidad.css';
import { useAuth } from '../context/useAuth';
import { apiRequest } from '../services/apiClient';

// ---------- Íconos (copia exacta de los SVG usados en la versión legacy) ----------
const IconLike = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.017 2.803a3.5 3.5 0 0 1 4.95 4.95L12 14.72l-6.967-6.966a3.5 3.5 0 0 1 4.95-4.95L12 4.72l2.017-1.917z" />
  </svg>
);
const IconComment = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const IconShare = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconEmptyPeople = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ---------- Datos (mock, en memoria — a la espera de una API real) ----------
// Ya no es posible crear temáticas nuevas desde la interfaz: el listado es
// fijo y ahora incluye "Temática libre" para publicaciones sin categoría.
const INITIAL_TOPICS = [
  { id: 'todos', name: 'Todas las temáticas', color: 'blue', desc: 'Todo el muro' },
  { id: 'ansiedad', name: 'Ansiedad y estrés', color: 'blue', desc: 'Herramientas y apoyo diario' },
  { id: 'duelo', name: 'Duelo y pérdidas', color: 'purple', desc: 'Acompañamiento en el proceso' },
  { id: 'crecimiento', name: 'Crecimiento personal', color: 'orange', desc: 'Metas y hábitos' },
  { id: 'vinculos', name: 'Relaciones y vínculos', color: 'teal', desc: 'Familia, pareja y amistad' },
  { id: 'autoestima', name: 'Autoestima', color: 'orange', desc: 'Autoconocimiento' },
  { id: 'mindfulness', name: 'Mindfulness y hábitos', color: 'teal', desc: 'Presencia y calma' },
  { id: 'libre', name: 'Temática libre', color: 'blue', desc: 'Comparte lo que quieras, sin categoría' },
];

const CHIP_COLORS = {
  blue: ['rgba(62,123,250,0.14)', 'var(--brand-blue)'],
  orange: ['rgba(255,138,101,0.17)', '#b65031'],
  teal: ['rgba(77,208,225,0.16)', '#19707d'],
  purple: ['rgba(186,104,200,0.18)', '#8e3aa1'],
};

const INITIAL_POSTS = [
  {
    id: 'p1', author: 'Camila R.', initials: 'CR', color: 'teal', topic: 'ansiedad', time: 'hace 2 h', anonymous: false, isMine: false,
    text: 'Hoy tuve un día difícil, pero practiqué la respiración 4-7-8 antes de la reunión y me ayudó muchísimo a bajar el ritmo cardíaco. Si alguien más la usa, ¿qué variante les funciona mejor?',
    likes: 14, liked: false,
    comments: [{ author: 'Martín V.', text: 'A mí me funciona mejor contar hasta 6 en vez de 7, ¡cada cuerpo es distinto!', anonymous: false }],
  },
  {
    id: 'p2', author: 'Jorge P.', initials: 'JP', color: 'purple', topic: 'duelo', time: 'hace 4 h', anonymous: false,
    text: "Se cumple un año desde que perdí a mi papá. Gracias a este espacio y a mi terapeuta he podido hablar de ello sin sentir que estoy 'exagerando'. Hoy solo quería dejarlo escrito.",
    likes: 32, liked: false,
    comments: [
      { author: 'Sofía V.', text: 'Te mando un abrazo enorme, Jorge. Escribirlo también es parte de sanar.', anonymous: false },
      { author: 'Miembro anónimo', text: 'Gracias por compartirlo, seguro le ayuda a más personas en este grupo.', anonymous: true },
    ],
  },
  {
    id: 'p3', author: 'Daniela M.', initials: 'DM', color: 'orange', topic: 'crecimiento', time: 'hace 6 h', anonymous: false,
    text: 'Llevo 21 días seguidos escribiendo mi diario emocional antes de dormir. No pensé que un hábito tan pequeño cambiaría tanto cómo entiendo mis propias reacciones. ¡Anímense a intentarlo!',
    likes: 21, liked: false, comments: [],
  },
  {
    id: 'p4', author: 'Miembro anónimo', initials: '', color: 'blue', topic: 'vinculos', time: 'hace 1 día', anonymous: true,
    text: '¿Alguien tiene tips para poner límites sanos con familiares sin sentir culpa después? Estoy trabajando esto en terapia pero me vendría bien leer otras experiencias.',
    likes: 9, liked: false,
    comments: [{ author: 'Camila R.', text: 'Practicar frases cortas y neutras me ha ayudado, sin justificar de más.', anonymous: false }],
  },
];

const colorClass = (c) => `avatar-${c}`;
const dotClass = (c) => `topic-dot ${c}`;
const initialsOf = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);

// Avatar de una persona: si la publicación/comentario es anónimo, muestra un ícono
// neutro en vez de las iniciales reales, para que no quede ningún rastro del autor.
function PersonAvatar({ anonymous, color, initials, size }) {
  if (anonymous) {
    return (
      <div className="avatar avatar-anon" style={size ? { width: size, height: size } : undefined}>
        <EyeOff size={size ? Math.round(size * 0.5) : 18} strokeWidth={2} />
      </div>
    );
  }
  return (
    <div className={`avatar ${colorClass(color)}`} style={size ? { width: size, height: size, fontSize: size < 40 ? '0.65rem' : undefined } : undefined}>
      {initials}
    </div>
  );
}

// ---------- Toasts ----------
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, visible: false }]);
    requestAnimationFrame(() => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, visible: true } : t)));
    });
    setTimeout(() => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, visible: false } : t)));
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 250);
    }, 2600);
  };
  return { toasts, showToast };
}

function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 2200, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: 'var(--text-main)', color: 'var(--bg-base)', padding: '12px 20px', borderRadius: 100,
            fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 15px 30px rgba(0,0,0,0.18)',
            opacity: t.visible ? 1 : 0, transform: t.visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.25s ease',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ---------- Modal de confirmación de eliminación (mismo estilo que el modal de Terapia) ----------
function ConfirmDeleteModal({ open, onCancel, onConfirm }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  // Bloquea el scroll del fondo, enfoca el modal y devuelve el foco al cerrar.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="terapia-modal-overlay"
      onClick={(event) => { if (event.target === event.currentTarget) onCancel(); }}
    >
      <div
        className="terapia-modal confirm-delete-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmDeleteTitle"
      >
        <button type="button" className="terapia-modal-close" ref={closeRef} onClick={onCancel} aria-label="Cerrar">
          ✕
        </button>

        <div className="confirm-delete-icon" aria-hidden="true">
          <AlertTriangle size={26} />
        </div>

        <h3 id="confirmDeleteTitle">¿Eliminar esta publicación?</h3>
        <p className="terapia-modal-desc">
          Esta acción no se puede deshacer. La publicación y sus comentarios se eliminarán del muro para siempre.
        </p>

        <div className="terapia-modal-actions">
          <button type="button" className="btn-danger" onClick={onConfirm}>Eliminar publicación</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function ComunidadPage() {
  const { toasts, showToast } = useToasts();
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTopic, setActiveTopic] = useState('todos');
  const [composerText, setComposerText] = useState('');
  const [composerTopic, setComposerTopic] = useState('1');
  const [composerAnonymous, setComposerAnonymous] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentAnonDrafts, setCommentAnonDrafts] = useState({});
  const [postToDelete, setPostToDelete] = useState(null);

  const TOPIC_MAP = Object.fromEntries(topics.map((t) => [t.id, t]));
  const filteredPosts = activeTopic === 'todos' ? posts : posts.filter((p) => p.topic === activeTopic);

  useEffect(() => {
    let active = true;
    async function loadCommunity() {
      setLoadingPosts(true);
      try {
        const [forumData, topicData] = await Promise.all([
          apiRequest('/api/foros'),
          apiRequest('/api/foros/temas/recientes'),
        ]);
        if (!active) return;
        if (Array.isArray(forumData) && forumData.length > 0) {
          const colors = ['blue', 'purple', 'orange', 'teal'];
          setTopics([
            { id: 'todos', name: 'Todas las temáticas', color: 'blue', desc: 'Todo el muro' },
            ...forumData.map((forum, index) => ({
              id: String(forum.id), name: forum.nombre, color: colors[index % colors.length],
              desc: forum.descripcion || 'Espacio de acompañamiento',
            })),
          ]);
          setComposerTopic((current) => forumData.some((forum) => String(forum.id) === current) ? current : String(forumData[0].id));
        }
        if (Array.isArray(topicData)) {
          setPosts(topicData.map((topic) => ({
            id: topic.id, author: topic.autor || 'Miembro de la comunidad', initials: topic.iniciales || '',
            color: topic.anonimo ? 'purple' : 'blue', topic: String(topic.foroId), anonymous: Boolean(topic.anonimo),
            isMine: Boolean(user?.id && !topic.anonimo && topic.autorId === user.id),
            time: topic.fechaCreacion ? new Date(topic.fechaCreacion).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }) : 'reciente',
            text: topic.contenido ? `${topic.titulo}\n\n${topic.contenido}` : topic.titulo,
            likes: topic.vistas || 0, liked: false, comments: [],
          })));
        }
      } catch (error) {
        if (active) showToast('No se pudo cargar la comunidad. Intenta nuevamente.');
      } finally {
        if (active) setLoadingPosts(false);
      }
    }
    loadCommunity();
    return () => { active = false; };
  }, [user]);

  function toggleLike(postId) {
    setPosts((list) => list.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));
  }

  function toggleComments(postId) {
    setOpenComments((m) => ({ ...m, [postId]: !m[postId] }));
  }

  function requestDeletePost(postId) {
    setPostToDelete(postId);
  }

  function cancelDeletePost() {
    setPostToDelete(null);
  }

  async function confirmDeletePost() {
    if (!postToDelete) return;
    try {
      await apiRequest(`/api/foros/temas/${postToDelete}`, { method: 'DELETE' });
      setPosts((list) => list.filter((p) => p.id !== postToDelete));
      showToast('Tu publicación fue eliminada');
    } catch (error) {
      showToast(error.message || 'No se pudo eliminar la publicación.');
    } finally {
      setPostToDelete(null);
    }
  }

  function submitComment(postId, e) {
    e.preventDefault();
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;
    const anonymous = Boolean(commentAnonDrafts[postId]);
    setPosts((list) => list.map((p) => (
      p.id === postId
        ? { ...p, comments: [...p.comments, { author: anonymous ? 'Miembro anónimo' : 'Tú', text, anonymous }] }
        : p
    )));
    setCommentDrafts((m) => ({ ...m, [postId]: '' }));
    setCommentAnonDrafts((m) => ({ ...m, [postId]: false }));
    setOpenComments((m) => ({ ...m, [postId]: true }));
  }

  function submitPost(e) {
    e.preventDefault();
    const text = composerText.trim();
    if (!text) return;
    if (!isAuthenticated) {
      showToast('Inicia sesión para publicar en la comunidad.');
      return;
    }
    const [title, ...body] = text.split('\n');
    apiRequest('/api/foros/temas', {
      method: 'POST',
      body: JSON.stringify({ foroId: Number(composerTopic), titulo: title.slice(0, 255), contenido: body.join('\n').trim() || title, anonimo: composerAnonymous }),
    }).then((saved) => {
      const newPost = {
        id: saved.id, author: saved.autor, initials: saved.iniciales || '', color: saved.anonimo ? 'purple' : 'blue',
        anonymous: Boolean(saved.anonimo), isMine: true, topic: String(saved.foroId), time: 'justo ahora',
        text: saved.contenido ? `${saved.titulo}\n\n${saved.contenido}` : saved.titulo, likes: saved.vistas || 0, liked: false, comments: [],
      };
      setPosts((list) => [newPost, ...list]);
      setComposerText('');
      setActiveTopic('todos');
      showToast(composerAnonymous ? 'Tu publicación anónima fue compartida' : 'Tu publicación fue compartida con la comunidad');
    }).catch((error) => showToast(error.message || 'No se pudo guardar la publicación.'));
  }

  return (
    <div className="comunidad-body">
      {/* ===================== HERO ===================== */}
      <section className="social-hero">
        <div className="mesh-background">
          <div className="mesh-blob blob-blue" />
          <div className="mesh-blob blob-orange" />
          <div className="mesh-blob blob-teal" />
        </div>

        <div className="social-hero-inner">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Comunidad · Temáticas
          </div>
          <h1>
            Comparte tu proceso,
            <br />
            <span className="gradient-text">nunca estarás solo en esto.</span>
          </h1>
          <p className="subtitle">
            Un muro moderado para intercambiar ideas por temática y conectar con otras personas que entienden tu proceso, con la opción de compartir de forma anónima cuando lo necesites.
          </p>

          <div className="social-stat-pills">
            <div className="social-stat-pill"><strong>{topics.length - 1}</strong><span>&nbsp;temáticas</span></div>
            <div className="social-stat-pill"><strong>100%</strong><span>&nbsp;moderado por profesionales</span></div>
          </div>
        </div>
      </section>

      {/* ===================== APP: TEMÁTICAS + MURO ===================== */}
      <section className="social-app">
        {/* Columna izquierda: temáticas */}
        <div className="social-col topics-col">
          <div className="glass-panel mini-profile">
            <div className="avatar avatar-blue">TÚ</div>
            <div>
              <div className="mini-profile-name">Tu perfil</div>
              <div className="mini-profile-role">Miembro de la comunidad</div>
            </div>
          </div>

          <div className="glass-panel topics-panel">
            <div className="panel-title"><span>Temáticas</span></div>
            <ul className="topic-list">
              {topics.map((topic) => {
                const count = topic.id === 'todos' ? posts.length : posts.filter((p) => p.topic === topic.id).length;
                return (
                  <li key={topic.id}>
                    <button type="button" className={`topic-btn ${topic.id === activeTopic ? 'active' : ''}`} onClick={() => setActiveTopic(topic.id)}>
                      <span className={dotClass(topic.color)} />
                      <span className="topic-info">
                        <span className="topic-name">{topic.name}</span>
                        <span className="topic-meta">{topic.desc}</span>
                      </span>
                      <span className="topic-count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Columna: muro */}
        <div className="social-col feed-col">
          <form className="glass-panel composer" onSubmit={submitPost}>
            <div className="composer-top">
              <PersonAvatar anonymous={composerAnonymous} color="blue" initials="TÚ" size={44} />
              <textarea
                placeholder="¿Qué estás pensando o sintiendo hoy? Compártelo con la comunidad…"
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
              />
            </div>

            <label className={`composer-anon-toggle ${composerAnonymous ? 'active' : ''}`}>
              <input type="checkbox" checked={composerAnonymous} onChange={(e) => setComposerAnonymous(e.target.checked)} />
              <EyeOff size={14} />
              Publicar en modo incógnito
            </label>
            {composerAnonymous && (
              <p className="composer-anon-hint">Tu nombre no se mostrará: la publicación aparecerá como "Miembro anónimo".</p>
            )}

            <div className="composer-bottom">
              <select className="composer-topic-select" aria-label="Elegir temática" value={composerTopic} onChange={(e) => setComposerTopic(e.target.value)}>
                {topics.filter((t) => t.id !== 'todos').map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button type="submit" className="btn-post" disabled={composerText.trim().length === 0}>Publicar</button>
            </div>
          </form>

          {activeTopic !== 'todos' && (
            <div className="feed-filter-bar">
              Mostrando publicaciones de <strong>{TOPIC_MAP[activeTopic].name}</strong>
              <button type="button" className="feed-filter-clear" onClick={() => setActiveTopic('todos')}>Ver todas</button>
            </div>
          )}

          <div className="feed-list">
            {loadingPosts ? (
              <div className="glass-panel empty-mini" style={{ padding: '40px 20px' }}>Cargando publicaciones…</div>
            ) : filteredPosts.length === 0 ? (
              <div className="glass-panel empty-mini" style={{ padding: '40px 20px' }}>
                No hay publicaciones en esta temática todavía. ¡Sé la primera persona en compartir algo!
              </div>
            ) : (
              filteredPosts.map((post) => {
                const topic = TOPIC_MAP[post.topic];
                const [bg, color] = CHIP_COLORS[topic.color] || CHIP_COLORS.blue;
                const commentsOpen = Boolean(openComments[post.id]);
                return (
                  <article key={post.id} className="glass-panel post-card">
                    <div className="post-head">
                      <PersonAvatar anonymous={post.anonymous} color={post.color} initials={post.initials} />
                      <div className="post-author-info">
                        <span className="post-author-name">{post.author}</span>
                        <span className="post-meta-line">
                          <span>{post.time}</span> ·{' '}
                          <span className="post-topic-chip" style={{ background: bg, color }}>{topic.name}</span>
                        </span>
                      </div>
                    </div>

                    <p className="post-text">{post.text}</p>

                    <div className="post-actions">
                      <button type="button" className={`post-action-btn like-btn ${post.liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                        <IconLike /><span>{post.likes}</span>
                      </button>
                      <button type="button" className="post-action-btn comment-toggle-btn" onClick={() => toggleComments(post.id)}>
                        <IconComment /><span>{post.comments.length} comentarios</span>
                      </button>
                      <button type="button" className="post-action-btn share-btn" onClick={() => showToast('Publicación compartida en tu muro')}>
                        <IconShare /><span>Compartir</span>
                      </button>
                      {post.isMine && (
                        <button type="button" className="post-action-btn delete-btn" onClick={() => requestDeletePost(post.id)}>
                          <Trash2 size={16} /><span>Eliminar</span>
                        </button>
                      )}
                    </div>

                    {commentsOpen && (
                      <div className="post-comments">
                        <div className="comment-list">
                          {post.comments.length === 0 ? (
                            <div className="empty-mini"><IconEmptyPeople /><div>Sé la primera persona en comentar.</div></div>
                          ) : (
                            post.comments.map((c, i) => (
                              <div className="comment-row" key={i}>
                                <PersonAvatar anonymous={c.anonymous} color="blue" initials={initialsOf(c.author)} size={32} />
                                <div className="comment-bubble"><strong>{c.author}</strong>{c.text}</div>
                              </div>
                            ))
                          )}
                        </div>
                        <form className="comment-form" onSubmit={(e) => submitComment(post.id, e)}>
                          <label className="comment-anon-toggle">
                            <input
                              type="checkbox"
                              checked={Boolean(commentAnonDrafts[post.id])}
                              onChange={(e) => setCommentAnonDrafts((m) => ({ ...m, [post.id]: e.target.checked }))}
                            />
                            <EyeOff size={12} /> Comentar de forma anónima
                          </label>
                          <div className="comment-form-row">
                            <input
                              type="text" placeholder="Escribe un comentario…" maxLength={240}
                              value={commentDrafts[post.id] || ''}
                              onChange={(e) => setCommentDrafts((m) => ({ ...m, [post.id]: e.target.value }))}
                            />
                            <button type="submit" className="comment-send">Enviar</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <ConfirmDeleteModal
        open={Boolean(postToDelete)}
        onCancel={cancelDeletePost}
        onConfirm={confirmDeletePost}
      />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
