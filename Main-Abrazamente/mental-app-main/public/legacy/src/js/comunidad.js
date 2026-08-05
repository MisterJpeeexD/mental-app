// src/js/comunidad.js
// Lógica de la pestaña "Comunidad": muro de publicaciones, temáticas,
// solicitudes de amistad y chat privado. Todo en memoria (mock data),
// pensado para conectarse luego a una API real.

const ICONS = {
  like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.017 2.803a3.5 3.5 0 0 1 4.95 4.95L12 14.72l-6.967-6.966a3.5 3.5 0 0 1 4.95-4.95L12 4.72l2.017-1.917z"></path></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  addFriend: '<svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>',
  check: '<svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  x: '<svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  msg: '<svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  emptyPeople: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
};

const TOPICS = [
  { id: "todos", name: "Todas las temáticas", color: "blue", desc: "Todo el muro" },
  { id: "ansiedad", name: "Ansiedad y estrés", color: "blue", desc: "Herramientas y apoyo diario" },
  { id: "duelo", name: "Duelo y pérdidas", color: "purple", desc: "Acompañamiento en el proceso" },
  { id: "crecimiento", name: "Crecimiento personal", color: "orange", desc: "Metas y hábitos" },
  { id: "vinculos", name: "Relaciones y vínculos", color: "teal", desc: "Familia, pareja y amistad" },
  { id: "autoestima", name: "Autoestima", color: "orange", desc: "Autoconocimiento" },
  { id: "mindfulness", name: "Mindfulness y hábitos", color: "teal", desc: "Presencia y calma" },
];

const TOPIC_MAP = Object.fromEntries(TOPICS.map(t => [t.id, t]));

function colorClass(c) { return `avatar-${c}`; }
function dotClass(c) { return `topic-dot ${c}`; }

let posts = [
  {
    id: "p1", author: "Camila R.", initials: "CR", color: "teal", topic: "ansiedad",
    time: "hace 2 h",
    text: "Hoy tuve un día difícil, pero practiqué la respiración 4-7-8 antes de la reunión y me ayudó muchísimo a bajar el ritmo cardíaco. Si alguien más la usa, ¿qué variante les funciona mejor?",
    likes: 14, liked: false, comments: [
      { author: "Martín V.", text: "A mí me funciona mejor contar hasta 6 en vez de 7, ¡cada cuerpo es distinto!" },
    ],
  },
  {
    id: "p2", author: "Jorge P.", initials: "JP", color: "purple", topic: "duelo",
    time: "hace 4 h",
    text: "Se cumple un año desde que perdí a mi papá. Gracias a este espacio y a mi terapeuta he podido hablar de ello sin sentir que estoy 'exagerando'. Hoy solo quería dejarlo escrito.",
    likes: 32, liked: false, comments: [
      { author: "Sofía V.", text: "Te mando un abrazo enorme, Jorge. Escribirlo también es parte de sanar." },
      { author: "Elena R.", text: "Gracias por compartirlo, seguro le ayuda a más personas en este grupo." },
    ],
  },
  {
    id: "p3", author: "Daniela M.", initials: "DM", color: "orange", topic: "crecimiento",
    time: "hace 6 h",
    text: "Llevo 21 días seguidos escribiendo mi diario emocional antes de dormir. No pensé que un hábito tan pequeño cambiaría tanto cómo entiendo mis propias reacciones. ¡Anímense a intentarlo!",
    likes: 21, liked: false, comments: [],
  },
  {
    id: "p4", author: "Ale T.", initials: "AT", color: "blue", topic: "vinculos",
    time: "hace 1 día",
    text: "¿Alguien tiene tips para poner límites sanos con familiares sin sentir culpa después? Estoy trabajando esto en terapia pero me vendría bien leer otras experiencias.",
    likes: 9, liked: false, comments: [
      { author: "Camila R.", text: "Practicar frases cortas y neutras me ha ayudado, sin justificar de más." },
    ],
  },
];

let friends = [
  { id: "f1", name: "Sofía Vargas", initials: "SV", color: "teal", status: "En línea", online: true },
  { id: "f2", name: "Martín Villalobos", initials: "MV", color: "orange", status: "Hace 20 min", online: false },
];

let requests = [
  { id: "r1", name: "Elena Ramírez", initials: "ER", color: "purple", sub: "3 amigos en común" },
  { id: "r2", name: "Jorge Pardo", initials: "JP", color: "blue", sub: "Comunidad de Duelo" },
];

let suggestions = [
  { id: "s1", name: "Camila Reyes", initials: "CR", color: "teal", sub: "Comunidad de Ansiedad", sent: false },
  { id: "s2", name: "Daniela Muñoz", initials: "DM", color: "orange", sub: "5 amigos en común", sent: false },
  { id: "s3", name: "Ale Torres", initials: "AT", color: "blue", sub: "Comunidad de Vínculos", sent: false },
];

const chatScripts = {
  f1: ["¡Hola! ¿Cómo va tu semana? 🌿", "Yo también empecé a meditar 5 min al día", "¡Vamos genial! Cuéntame cómo te fue en tu sesión"],
  f2: ["Hey, ¿leíste el post de Daniela sobre el diario emocional?", "Se ve interesante, capaz lo intento", "Avísame cómo te va 😊"],
};

let activeTopic = "todos";
let activeFriendsTab = "sugerencias";
const openChats = [];

// ---------- utilidades ----------
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- TEMÁTICAS ----------
function renderTopics() {
  const list = document.getElementById("topicList");
  if (!list) return;
  list.innerHTML = "";
  TOPICS.forEach(topic => {
    const count = topic.id === "todos"
      ? posts.length
      : posts.filter(p => p.topic === topic.id).length;
    const btn = el(`
      <li>
        <button class="topic-btn ${topic.id === activeTopic ? "active" : ""}" data-topic="${topic.id}">
          <span class="${dotClass(topic.color)}"></span>
          <span class="topic-info">
            <span class="topic-name">${topic.name}</span>
            <span class="topic-meta">${topic.desc}</span>
          </span>
          <span class="topic-count">${count}</span>
        </button>
      </li>
    `);
    btn.querySelector(".topic-btn").addEventListener("click", () => {
      activeTopic = topic.id;
      renderTopics();
      renderFeed();
    });
    list.appendChild(btn);
  });

  // select del composer
  const select = document.getElementById("composerTopic");
  if (select) {
    select.innerHTML = TOPICS.filter(t => t.id !== "todos")
      .map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  }
}

// ---------- FEED ----------
function postCard(post) {
  const topic = TOPIC_MAP[post.topic];
  const card = el(`
    <article class="glass-panel post-card" data-id="${post.id}">
      <div class="post-head">
        <div class="avatar ${colorClass(post.color)}">${post.initials}</div>
        <div class="post-author-info">
          <span class="post-author-name">${post.author}</span>
          <span class="post-meta-line">
            <span>${post.time}</span> · 
            <span class="post-topic-chip" style="background:var(--chip-bg);color:var(--chip-color)">${topic.name}</span>
          </span>
        </div>
      </div>
      <p class="post-text"></p>
      <div class="post-actions">
        <button class="post-action-btn like-btn ${post.liked ? "liked" : ""}">${ICONS.like}<span>${post.likes}</span></button>
        <button class="post-action-btn comment-toggle-btn">${ICONS.comment}<span>${post.comments.length} comentarios</span></button>
        <button class="post-action-btn share-btn">${ICONS.share}<span>Compartir</span></button>
      </div>
      <div class="post-comments" hidden>
        <div class="comment-list"></div>
        <form class="comment-form">
          <input type="text" placeholder="Escribe un comentario…" maxlength="240">
          <button type="submit" class="comment-send">Enviar</button>
        </form>
      </div>
    </article>
  `);

  card.querySelector(".post-text").textContent = post.text;

  const chip = card.querySelector(".post-topic-chip");
  const chipColors = {
    blue: ["rgba(62,123,250,0.14)", "var(--brand-blue)"],
    orange: ["rgba(255,138,101,0.17)", "#b65031"],
    teal: ["rgba(77,208,225,0.16)", "#19707d"],
    purple: ["rgba(186,104,200,0.18)", "#8e3aa1"],
  };
  const [bg, color] = chipColors[topic.color] || chipColors.blue;
  chip.style.background = bg;
  chip.style.color = color;

  // like
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    likeBtn.classList.toggle("liked", post.liked);
    likeBtn.querySelector("span").textContent = post.likes;
  });

  // comentarios: toggle
  const commentsBox = card.querySelector(".post-comments");
  const commentList = card.querySelector(".comment-list");
  function renderComments() {
    commentList.innerHTML = "";
    post.comments.forEach(c => {
      commentList.appendChild(el(`
        <div class="comment-row">
          <div class="avatar avatar-blue" style="width:32px;height:32px;font-size:0.65rem">${c.author.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div class="comment-bubble"><strong>${escapeHTML(c.author)}</strong>${escapeHTML(c.text)}</div>
        </div>
      `));
    });
  }
  renderComments();

  card.querySelector(".comment-toggle-btn").addEventListener("click", () => {
    commentsBox.hidden = !commentsBox.hidden;
  });

  card.querySelector(".comment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    post.comments.push({ author: "Tú", text });
    input.value = "";
    renderComments();
    const countSpan = card.querySelector(".comment-toggle-btn span");
    countSpan.textContent = `${post.comments.length} comentarios`;
    commentsBox.hidden = false;
  });

  card.querySelector(".share-btn").addEventListener("click", () => {
    showToast("Publicación compartida en tu muro");
  });

  return card;
}

function renderFeed() {
  const list = document.getElementById("feedList");
  if (!list) return;
  list.innerHTML = "";

  const filtered = activeTopic === "todos" ? posts : posts.filter(p => p.topic === activeTopic);

  const filterBar = document.getElementById("feedFilterBar");
  if (activeTopic === "todos") {
    filterBar.hidden = true;
  } else {
    filterBar.hidden = false;
    filterBar.querySelector("strong").textContent = TOPIC_MAP[activeTopic].name;
  }

  if (filtered.length === 0) {
    list.appendChild(el(`<div class="glass-panel empty-mini" style="padding:40px 20px">No hay publicaciones en esta temática todavía. ¡Sé la primera persona en compartir algo!</div>`));
    return;
  }

  filtered.forEach(p => list.appendChild(postCard(p)));
}

function initComposer() {
  const form = document.getElementById("composerForm");
  const textarea = document.getElementById("composerText");
  const select = document.getElementById("composerTopic");
  const btn = document.getElementById("composerSubmit");

  function refreshBtn() { btn.disabled = textarea.value.trim().length === 0; }
  textarea.addEventListener("input", refreshBtn);
  refreshBtn();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) return;
    const newPost = {
      id: "p" + Date.now(),
      author: "Tú",
      initials: "TÚ",
      color: "blue",
      topic: select.value,
      time: "justo ahora",
      text,
      likes: 0,
      liked: false,
      comments: [],
    };
    posts.unshift(newPost);
    textarea.value = "";
    refreshBtn();
    activeTopic = "todos";
    renderTopics();
    renderFeed();
    showToast("Tu publicación fue compartida con la comunidad");
  });
}

// ---------- AMIGOS / SOLICITUDES ----------
function renderFriendsPanel() {
  document.querySelectorAll(".friends-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === activeFriendsTab);
  });
  document.querySelectorAll(".friends-view").forEach(view => {
    view.hidden = view.dataset.view !== activeFriendsTab;
  });

  const reqBadge = document.getElementById("requestsBadge");
  reqBadge.hidden = requests.length === 0;
  reqBadge.textContent = requests.length;

  renderSuggestions();
  renderRequests();
  renderFriendsList();
}

function renderSuggestions() {
  const box = document.querySelector('[data-view="sugerencias"]');
  box.innerHTML = "";
  if (suggestions.length === 0) {
    box.appendChild(emptyState("No hay más sugerencias por ahora."));
    return;
  }
  suggestions.forEach(p => {
    const row = el(`
      <div class="person-row">
        <div class="avatar ${colorClass(p.color)}">${p.initials}</div>
        <div class="person-info">
          <div class="person-name">${p.name}</div>
          <div class="person-sub">${p.sub}</div>
        </div>
        <div class="person-actions">
          <button class="pill-btn ${p.sent ? "pill-ghost" : "pill-primary"}" ${p.sent ? "disabled" : ""}>
            ${p.sent ? "Solicitud enviada" : ICONS.addFriend + "Agregar"}
          </button>
        </div>
      </div>
    `);
    row.querySelector("button").addEventListener("click", () => {
      p.sent = true;
      renderSuggestions();
      showToast(`Solicitud de amistad enviada a ${p.name}`);
    });
    box.appendChild(row);
  });
}

function renderRequests() {
  const box = document.querySelector('[data-view="solicitudes"]');
  box.innerHTML = "";
  if (requests.length === 0) {
    box.appendChild(emptyState("No tienes solicitudes pendientes."));
    return;
  }
  requests.forEach(r => {
    const row = el(`
      <div class="person-row">
        <div class="avatar ${colorClass(r.color)}">${r.initials}</div>
        <div class="person-info">
          <div class="person-name">${r.name}</div>
          <div class="person-sub">${r.sub}</div>
        </div>
        <div class="person-actions">
          <button class="pill-btn pill-success accept-btn" title="Aceptar">${ICONS.check}</button>
          <button class="pill-btn pill-ghost reject-btn" title="Rechazar">${ICONS.x}</button>
        </div>
      </div>
    `);
    row.querySelector(".accept-btn").addEventListener("click", () => {
      requests = requests.filter(x => x.id !== r.id);
      friends.push({ id: r.id, name: r.name, initials: r.initials, color: r.color, status: "En línea", online: true });
      renderFriendsPanel();
      showToast(`Ahora eres amigo/a de ${r.name}`);
    });
    row.querySelector(".reject-btn").addEventListener("click", () => {
      requests = requests.filter(x => x.id !== r.id);
      renderFriendsPanel();
    });
    box.appendChild(row);
  });
}

function renderFriendsList() {
  const box = document.querySelector('[data-view="amigos"]');
  box.innerHTML = "";
  if (friends.length === 0) {
    box.appendChild(emptyState("Todavía no tienes amigos agregados."));
    return;
  }
  friends.forEach(f => {
    const row = el(`
      <div class="person-row">
        <div class="avatar-wrap">
          <div class="avatar ${colorClass(f.color)}">${f.initials}</div>
          <span class="presence-dot ${f.online ? "online" : ""}"></span>
        </div>
        <div class="person-info">
          <div class="person-name">${f.name}</div>
          <div class="person-sub">${f.status}</div>
        </div>
        <div class="person-actions">
          <button class="pill-btn pill-primary msg-btn" title="Enviar mensaje">${ICONS.msg}</button>
        </div>
      </div>
    `);
    row.querySelector(".msg-btn").addEventListener("click", () => openChat(f));
    box.appendChild(row);
  });
}

function emptyState(msg) {
  return el(`<div class="empty-mini">${ICONS.emptyPeople}<div>${msg}</div></div>`);
}

function initFriendsTabs() {
  document.querySelectorAll(".friends-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      activeFriendsTab = tab.dataset.tab;
      renderFriendsPanel();
    });
  });
}

// ---------- CHAT PRIVADO ----------
function openChat(friend) {
  if (openChats.find(c => c.id === friend.id)) {
    focusChat(friend.id);
    return;
  }
  const history = [
    { from: "them", text: chatScripts[friend.id] ? chatScripts[friend.id][0] : "¡Hola! ¿Cómo estás?" },
  ];
  openChats.push({ id: friend.id, friend, history, scriptIndex: 1 });
  if (openChats.length > 2) openChats.shift();
  renderChatDock();
}

function closeChat(id) {
  const idx = openChats.findIndex(c => c.id === id);
  if (idx !== -1) openChats.splice(idx, 1);
  renderChatDock();
}

function focusChat(id) {
  const input = document.querySelector(`.chat-window[data-id="${id}"] input`);
  if (input) input.focus();
}

function renderChatDock() {
  const dock = document.getElementById("chatDock");
  dock.innerHTML = "";
  openChats.forEach(chat => dock.appendChild(chatWindow(chat)));
}

function chatWindow(chat) {
  const { friend } = chat;
  const win = el(`
    <div class="chat-window" data-id="${friend.id}">
      <div class="chat-header">
        <div class="avatar ${colorClass(friend.color)}">${friend.initials}</div>
        <div class="chat-header-info">
          <div class="chat-header-name">${friend.name}</div>
          <div class="chat-header-status">${friend.online ? "En línea" : friend.status}</div>
        </div>
        <button class="chat-close-btn" aria-label="Cerrar chat">${ICONS.close}</button>
      </div>
      <div class="chat-messages"></div>
      <form class="chat-input-row">
        <input type="text" placeholder="Escribe un mensaje…" maxlength="300" autocomplete="off">
        <button type="submit" class="chat-send-btn" aria-label="Enviar">${ICONS.send}</button>
      </form>
    </div>
  `);

  const msgBox = win.querySelector(".chat-messages");
  function paint() {
    msgBox.innerHTML = "";
    chat.history.forEach(m => {
      msgBox.appendChild(el(`<div class="chat-bubble ${m.from === "me" ? "me" : "them"}">${escapeHTML(m.text)}</div>`));
    });
    msgBox.scrollTop = msgBox.scrollHeight;
  }
  paint();

  win.querySelector(".chat-close-btn").addEventListener("click", () => closeChat(friend.id));

  win.querySelector(".chat-input-row").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    chat.history.push({ from: "me", text });
    input.value = "";
    paint();

    // respuesta simulada
    const script = chatScripts[friend.id];
    const reply = script && script[chat.scriptIndex]
      ? script[chat.scriptIndex]
      : "¡Gracias por tu mensaje! Te cuento más en un rato 💬";
    chat.scriptIndex += 1;

    const typing = el(`<div class="chat-typing"><span></span><span></span><span></span></div>`);
    msgBox.appendChild(typing);
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
      typing.remove();
      chat.history.push({ from: "them", text: reply });
      paint();
    }, 1100 + Math.random() * 700);
  });

  return win;
}

// ---------- TOASTS ----------
function showToast(msg) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText = "position:fixed;bottom:24px;left:24px;z-index:2200;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(container);
  }
  const toast = el(`<div style="background:var(--text-main);color:var(--bg-base);padding:12px 20px;border-radius:100px;font-size:0.85rem;font-weight:600;box-shadow:0 15px 30px rgba(0,0,0,0.18);opacity:0;transform:translateY(8px);transition:all 0.25s ease;">${escapeHTML(msg)}</div>`);
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = "1"; toast.style.transform = "translateY(0)"; });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// ---------- INIT ----------
export function initComunidad() {
  renderTopics();
  renderFeed();
  initComposer();
  initFriendsTabs();
  renderFriendsPanel();
}

document.addEventListener("DOMContentLoaded", () => {
  // Espera a que el header/footer (cargados por main.js) estén listos;
  // la lógica de esta página no depende de ellos, así que inicia directo.
  initComunidad();
});
