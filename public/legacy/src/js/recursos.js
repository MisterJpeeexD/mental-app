/* ============================================================
   RECURSOS — Biblioteca de material de salud mental.
   Implementación de frontend con datos de ejemplo (mock data).
   Diseñada para reemplazar fácilmente las funciones fetchXxx()
   por llamadas reales a la API REST cuando el backend esté listo.
   ============================================================ */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. ICONOGRAFÍA (mismo lenguaje visual: SVG stroke, 24x24)
     --------------------------------------------------------- */
  const ICONS = {
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    video: '<polygon points="5 3 19 12 5 21 5 3"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    clipboard: '<path d="M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1z"/><rect x="4" y="4" width="16" height="18" rx="2"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="15" y2="15"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    bookOpen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    warn: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  };

  function icon(name, extraAttrs = "") {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extraAttrs}>${ICONS[name] || ""}</svg>`;
  }

  /* ---------------------------------------------------------
     2. TAXONOMÍA
     --------------------------------------------------------- */
  const CATEGORIES = [
    { slug: "depresion", label: "Depresión" },
    { slug: "ansiedad", label: "Ansiedad" },
    { slug: "angustia", label: "Angustia emocional" },
    { slug: "estres", label: "Estrés" },
    { slug: "burnout", label: "Burnout" },
    { slug: "bipolar", label: "Trastorno Bipolar" },
    { slug: "tdah", label: "TDAH" },
    { slug: "autismo", label: "Autismo" },
    { slug: "toc", label: "TOC" },
    { slug: "duelo", label: "Duelo" },
    { slug: "autoestima", label: "Autoestima" },
    { slug: "trauma", label: "Trauma" },
    { slug: "violencia", label: "Violencia" },
    { slug: "relaciones", label: "Relaciones" },
    { slug: "sexualidad", label: "Sexualidad" },
    { slug: "adicciones", label: "Adicciones" },
    { slug: "mindfulness", label: "Mindfulness" },
    { slug: "psicologia", label: "Psicología" },
    { slug: "psiquiatria", label: "Psiquiatría" },
    { slug: "neurociencia", label: "Neurociencia" },
    { slug: "regulacion", label: "Regulación emocional" },
    { slug: "tcc", label: "Terapia Cognitivo Conductual" },
    { slug: "act", label: "ACT" },
    { slug: "dbt", label: "DBT" },
    { slug: "emdr", label: "EMDR" },
    { slug: "psicoanalisis", label: "Psicoanálisis" },
    { slug: "crisis", label: "Crisis" },
    { slug: "prevencion-suicidio", label: "Prevención del suicidio" },
  ];
  const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label]));

  const LANGUAGES = ["Español", "Inglés", "Portugués"];

  const COVER_COLORS = ["blue", "orange", "teal", "purple"];

  // Cada categoría recibe un color fijo de la misma paleta que usa el resto
  // del sitio (orb-blue / orb-orange / orb-teal / orb-purple), rotando en
  // orden para que la variedad de color sea pareja en toda la sección.
  const CAT_COLOR = Object.fromEntries(
    CATEGORIES.map((c, i) => [c.slug, COVER_COLORS[i % COVER_COLORS.length]])
  );

  const TYPES = {
    libro: { label: "Libro", icon: "book", cta: "Comprar", ctaIcon: "cart", action: "buy" },
    pdf: { label: "PDF", icon: "file", cta: "Descargar PDF", ctaIcon: "download", action: "download" },
    articulo: { label: "Artículo", icon: "file", cta: "Leer", ctaIcon: "bookOpen", action: "read" },
    investigacion: { label: "Investigación", icon: "chart", cta: "Leer", ctaIcon: "bookOpen", action: "read" },
    revista: { label: "Revista", icon: "file", cta: "Leer", ctaIcon: "bookOpen", action: "read" },
    manual: { label: "Manual", icon: "clipboard", cta: "Descargar", ctaIcon: "download", action: "download" },
    guia: { label: "Guía", icon: "clipboard", cta: "Leer", ctaIcon: "bookOpen", action: "read" },
    "material-clinico": { label: "Material clínico", icon: "clipboard", cta: "Descargar", ctaIcon: "download", action: "download" },
    protocolo: { label: "Protocolo", icon: "clipboard", cta: "Descargar", ctaIcon: "download", action: "download" },
    infografia: { label: "Infografía", icon: "chart", cta: "Descargar", ctaIcon: "download", action: "download" },
    podcast: { label: "Podcast", icon: "mic", cta: "Escuchar", ctaIcon: "play", action: "listen" },
    video: { label: "Video", icon: "video", cta: "Ver video", ctaIcon: "play", action: "watch" },
    educativo: { label: "Educativo", icon: "book", cta: "Leer", ctaIcon: "bookOpen", action: "read" },
  };

  const COVER_COLORS_LIST = COVER_COLORS;
  function coverColorFor(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return COVER_COLORS_LIST[h % COVER_COLORS_LIST.length];
  }

  /* ---------------------------------------------------------
     3. DATOS DE EJEMPLO (mock) — reemplazar por fetch('/api/recursos')
     --------------------------------------------------------- */
  const RAW = [
    ["Calma en la Tormenta: Herramientas Prácticas para la Ansiedad", "Dra. Renata Solís", "Nimbus Editorial", 2024, "Español", "libro", ["ansiedad", "regulacion", "tcc"], ["respiración", "pensamientos automáticos", "exposición gradual"], "978-1-56619-909-4", 248, 4.7, 3120, 15900, false, true, "2026-03-02", true],
    ["Manual de Primeros Auxilios Psicológicos en Crisis", "Equipo Clínico Abraza", "Abraza Mente Ediciones", 2025, "Español", "protocolo", ["crisis", "prevencion-suicidio"], ["contención", "escucha activa", "derivación"], null, 36, 4.9, 8940, 22100, true, true, "2026-05-18", true],
    ["El Peso Invisible: Comprender la Depresión", "Psic. Ignacio Farfán", "Editorial Umbral", 2023, "Español", "libro", ["depresion", "psicologia"], ["anhedonia", "psicoeducación", "apoyo familiar"], "978-0-19-852663-1", 210, 4.5, 2870, 12400, false, true, "2026-01-14", true],
    ["Guía Breve de Grounding 5-4-3-2-1", "Equipo Clínico Abraza", "Abraza Mente Ediciones", 2025, "Español", "guia", ["angustia", "ansiedad", "regulacion"], ["grounding", "crisis de pánico", "autorregulación"], null, 8, 4.8, 5410, 31200, true, true, "2026-06-01", true],
    ["Burnout: Cuando el Trabajo Agota el Alma", "Dra. Marcela Iturra", "Nimbus Editorial", 2022, "Español", "libro", ["burnout", "estres"], ["agotamiento laboral", "límites", "recuperación"], "978-1-4028-9462-6", 264, 4.4, 1980, 9800, false, true, "2025-11-20", false],
    ["TDAH en Adultos: Diagnóstico y Vida Cotidiana", "Dr. Samuel Reyes", "Editorial Umbral", 2024, "Español", "investigacion", ["tdah", "neurociencia"], ["función ejecutiva", "diagnóstico diferencial", "organización"], null, 42, 4.6, 1540, 7600, false, true, "2026-02-10", true],
    ["Vivir con Autismo: Una Guía para Familias", "Lic. Camila Duarte", "Editorial Puente", 2023, "Español", "manual", ["autismo"], ["neurodivergencia", "comunicación", "sensorial"], null, 58, 4.7, 2210, 11300, true, true, "2025-09-05", true],
    ["TOC Explicado: Pensamientos, Rituales y Tratamiento", "Dr. Álvaro Ponce", "Editorial Umbral", 2022, "Español", "articulo", ["toc", "tcc"], ["obsesiones", "compulsiones", "exposición con prevención de respuesta"], null, 14, 4.5, 990, 5200, true, false, "2025-08-12", false],
    ["Duelo: Acompañar la Pérdida sin Prisa", "Psic. Fernanda Ossa", "Editorial Puente", 2021, "Español", "libro", ["duelo"], ["pérdida", "etapas del duelo", "acompañamiento"], "978-0-14-303943-3", 192, 4.8, 3340, 16700, false, true, "2025-12-01", true],
    ["Reconstruir la Autoestima: Ejercicios Prácticos", "Lic. Bárbara Concha", "Nimbus Editorial", 2024, "Español", "libro", ["autoestima", "regulacion"], ["autocompasión", "diálogo interno", "límites"], "978-1-59327-928-5", 176, 4.6, 2640, 13800, false, true, "2026-04-08", false],
    ["Trauma y Cuerpo: Fundamentos del Enfoque Somático", "Dr. Tomás Beltrán", "Editorial Umbral", 2023, "Español", "investigacion", ["trauma", "neurociencia"], ["hipervigilancia", "regulación fisiológica", "memoria traumática"], null, 46, 4.7, 1720, 8900, false, true, "2026-01-29", true],
    ["Salir del Silencio: Guía sobre Violencia en el Hogar", "Equipo Clínico Abraza", "Abraza Mente Ediciones", 2025, "Español", "guia", ["violencia", "crisis"], ["seguridad", "redes de apoyo", "denuncia"], null, 20, 4.9, 4120, 19700, true, true, "2026-05-02", true],
    ["Hablemos de Vínculos: Apego y Relaciones Adultas", "Psic. Daniela Rojas", "Editorial Puente", 2023, "Español", "libro", ["relaciones", "psicologia"], ["apego", "comunicación", "conflicto de pareja"], "978-0-06-231609-7", 232, 4.5, 2010, 10500, false, true, "2025-10-17", false],
    ["Sexualidad y Bienestar Emocional", "Dra. Valentina Muñoz", "Editorial Umbral", 2022, "Español", "articulo", ["sexualidad", "autoestima"], ["identidad", "consentimiento", "comunicación en pareja"], null, 12, 4.3, 860, 4300, true, false, "2025-07-22", false],
    ["Adicciones: Comprender el Ciclo y Buscar Ayuda", "Dr. Rodrigo Sepúlveda", "Nimbus Editorial", 2024, "Español", "libro", ["adicciones", "regulacion"], ["dependencia", "recaída", "tratamiento"], "978-1-250-30697-7", 256, 4.6, 1890, 9200, false, true, "2026-02-27", false],
    ["Mindfulness Clínico: 8 Semanas de Práctica Guiada", "Lic. Josefa Peralta", "Editorial Puente", 2023, "Español", "manual", ["mindfulness", "regulacion"], ["atención plena", "body scan", "meditación guiada"], null, 64, 4.8, 3980, 21400, true, true, "2026-03-19", true],
    ["Fundamentos de Psicología Clínica Contemporánea", "Dr. Esteban Larraín", "Editorial Umbral", 2021, "Español", "libro", ["psicologia"], ["evaluación clínica", "modelos teóricos", "ética profesional"], "978-1-108-42095-8", 412, 4.4, 1230, 6100, false, true, "2025-06-30", false],
    ["Psiquiatría para No Psiquiatras: Guía Introductoria", "Dr. Matías Cordero", "Editorial Umbral", 2022, "Español", "manual", ["psiquiatria"], ["psicofarmacología", "diagnóstico", "interconsulta"], null, 88, 4.5, 1440, 7300, false, true, "2025-09-28", false],
    ["Neurociencia de las Emociones: Lo Esencial", "Dra. Paula Ibáñez", "Editorial Umbral", 2024, "Español", "investigacion", ["neurociencia", "regulacion"], ["sistema límbico", "amígdala", "corteza prefrontal"], null, 34, 4.7, 1670, 8500, true, true, "2026-01-05", true],
    ["Regulación Emocional en 10 Técnicas Prácticas", "Equipo Clínico Abraza", "Abraza Mente Ediciones", 2025, "Español", "infografia", ["regulacion", "ansiedad"], ["autorregulación", "técnicas rápidas", "gestión del estrés"], null, 1, 4.9, 6720, 34500, true, true, "2026-06-01", true],
    ["Terapia Cognitivo Conductual Paso a Paso", "Dr. Ignacio Farfán", "Nimbus Editorial", 2023, "Español", "libro", ["tcc", "psicologia"], ["reestructuración cognitiva", "registro de pensamientos", "tareas terapéuticas"], "978-1-59947-707-8", 288, 4.7, 2450, 12900, false, true, "2025-11-11", true],
    ["Introducción a la Terapia de Aceptación y Compromiso (ACT)", "Lic. Carolina Bravo", "Editorial Puente", 2022, "Español", "guia", ["act", "regulacion"], ["defusión cognitiva", "valores", "flexibilidad psicológica"], null, 40, 4.6, 1310, 6700, true, true, "2025-08-30", false],
    ["DBT en la Práctica: Regulación Emocional y Crisis", "Dra. Antonia Vergara", "Editorial Umbral", 2023, "Español", "manual", ["dbt", "crisis", "regulacion"], ["tolerancia al malestar", "mindfulness", "efectividad interpersonal"], null, 76, 4.8, 1980, 10100, false, true, "2026-02-14", true],
    ["EMDR: Reprocesamiento de Experiencias Traumáticas", "Dr. Tomás Beltrán", "Editorial Umbral", 2021, "Español", "investigacion", ["emdr", "trauma"], ["desensibilización", "movimientos oculares", "memoria"], null, 30, 4.5, 1050, 5400, false, true, "2025-05-19", false],
    ["Introducción al Psicoanálisis Contemporáneo", "Dr. Esteban Larraín", "Editorial Umbral", 2020, "Español", "libro", ["psicoanalisis"], ["inconsciente", "transferencia", "asociación libre"], "978-0-393-30158-4", 320, 4.3, 780, 3900, false, true, "2025-04-02", false],
    ["Señales de Alerta: Prevención del Suicidio para Comunidades", "Equipo Clínico Abraza", "Abraza Mente Ediciones", 2025, "Español", "protocolo", ["prevencion-suicidio", "crisis"], ["factores de riesgo", "primer contacto", "líneas de ayuda"], null, 24, 5.0, 9870, 41200, true, true, "2026-05-30", true],
    ["Respirar para Calmar: Ejercicio Guiado de 8 Minutos", "Lic. Josefa Peralta", "Abraza Mente Ediciones", 2026, "Español", "video", ["ansiedad", "mindfulness"], ["respiración diafragmática", "técnica de caja", "audio guiado"], null, null, 4.8, 5230, 28900, true, false, "2026-06-10", true],
    ["Episodio 12: Hablemos de Ansiedad sin Filtros", "Podcast Mente Conecta", "Mente Conecta Media", 2026, "Español", "podcast", ["ansiedad", "psicologia"], ["testimonios", "conversación clínica", "estrategias cotidianas"], null, null, 4.6, 3410, 17800, true, false, "2026-05-25", false],
    ["Cerebro Bajo Presión: Neurociencia del Estrés", "Dra. Paula Ibáñez", "Mente Conecta Media", 2026, "Español", "video", ["estres", "neurociencia"], ["cortisol", "sistema nervioso", "recuperación"], null, null, 4.5, 2190, 12300, true, false, "2026-04-22", false],
    ["Revista Bienestar Nº14: Salud Mental en el Trabajo", "Equipo Editorial Umbral", "Editorial Umbral", 2026, "Español", "revista", ["burnout", "estres", "psicologia"], ["clima laboral", "prevención", "liderazgo"], null, 52, 4.4, 1120, 6300, true, true, "2026-03-15", false],
    ["Ficha Descargable: Diario de Emociones Semanal", "Equipo Clínico Abraza", "Abraza Mente Ediciones", 2026, "Español", "pdf", ["regulacion", "autoestima"], ["diario emocional", "autoconocimiento", "seguimiento semanal"], null, 6, 4.7, 4300, 15200, true, true, "2026-05-10", false],
    ["Cuestionario de Autoevaluación de Estrés Percibido", "Dra. Marcela Iturra", "Nimbus Editorial", 2025, "Español", "pdf", ["estres", "burnout"], ["autoevaluación", "escala validada", "seguimiento"], null, 4, 4.4, 2100, 9800, true, true, "2025-12-20", false],
    ["Protocolo Clínico de Evaluación de Riesgo Suicida", "Dr. Matías Cordero", "Editorial Umbral", 2024, "Español", "material-clinico", ["prevencion-suicidio", "crisis", "psiquiatria"], ["evaluación de riesgo", "entrevista clínica", "derivación"], null, 28, 4.9, 1560, 6700, false, true, "2026-01-22", true],
    ["Curso Introductorio: Primeros Pasos en Terapia", "Lic. Carolina Bravo", "Editorial Puente", 2025, "Español", "educativo", ["psicologia", "ansiedad"], ["qué esperar de terapia", "primera sesión", "mitos comunes"], null, 18, 4.6, 1980, 8100, true, false, "2026-03-25", false],
  ];

  const RESOURCES = RAW.map((r, i) => {
    const [title, author, publisher, year, language, type, categories, tags, isbn, pages, rating, downloads, views, free, downloadable, dateAdded, featured] = r;
    return {
      id: "r" + (i + 1),
      title, author, publisher, year, language, type, categories, tags, isbn, pages,
      rating, downloads, views, free, downloadable, dateAdded, featured,
      available: true,
      coverColor: coverColorFor(title),
      description: buildShortDescription(title, tags),
      longDescription: buildLongDescription(title, categories, tags),
    };
  });

  function buildShortDescription(title, tags) {
    const t = tags.slice(0, 2).join(" y ");
    return `Material seleccionado por el equipo clínico sobre ${t}, pensado para autogestión y acompañamiento profesional.`;
  }
  function buildLongDescription(title, categories, tags) {
    const catLabels = categories.map((c) => CAT_MAP[c]).join(", ");
    return `«${title}» aborda ${catLabels} con un enfoque práctico y basado en evidencia. Incluye orientaciones sobre ${tags.join(", ")}, pensadas tanto para quienes atraviesan el proceso como para profesionales que acompañan. Este contenido es informativo y no reemplaza una evaluación clínica individual.`;
  }

  /* ---------------------------------------------------------
     4. UTILIDADES
     --------------------------------------------------------- */
  function normalize(str) {
    return (str || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function formatNumber(n) {
    if (n === null || n === undefined) return "—";
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + "k";
    return String(n);
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
  }

  function starRow(rating) {
    const full = Math.round(rating);
    let out = "";
    for (let i = 0; i < 5; i++) out += i < full ? "★" : "☆";
    return out;
  }

  function amazonSearchUrl(title, author) {
    const q = encodeURIComponent(`${title} ${author}`);
    return `https://www.amazon.com/s?k=${q}`;
  }

  /* ---------------------------------------------------------
     5. PERSISTENCIA LOCAL (favoritos / historial)
     --------------------------------------------------------- */
  const LS_FAV = "mc_resources_favorites";
  const LS_HISTORY = "mc_resources_history";

  function getFavorites() {
    try { return new Set(JSON.parse(localStorage.getItem(LS_FAV)) || []); }
    catch { return new Set(); }
  }
  function saveFavorites(set) {
    localStorage.setItem(LS_FAV, JSON.stringify([...set]));
  }
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || []; }
    catch { return []; }
  }
  function pushHistory(id) {
    let h = getHistory().filter((x) => x !== id);
    h.unshift(id);
    h = h.slice(0, 8);
    localStorage.setItem(LS_HISTORY, JSON.stringify(h));
  }

  let favorites = getFavorites();

  /* ---------------------------------------------------------
     6. ESTADO
     --------------------------------------------------------- */
  const state = {
    query: "",
    categories: new Set(),
    types: new Set(),
    languages: new Set(),
    price: "all",
    downloadableOnly: false,
    availableOnly: false,
    sort: "relevancia",
    page: 1,
    pageSize: 9,
  };

  /* ---------------------------------------------------------
     7. FILTRADO / ORDEN
     --------------------------------------------------------- */
  function matchesQuery(res, q) {
    if (!q) return true;
    const nq = normalize(q);
    const haystack = normalize(
      [
        res.title, res.author, res.publisher, res.isbn,
        res.categories.map((c) => CAT_MAP[c]).join(" "),
        res.tags.join(" "), res.description, TYPES[res.type].label,
      ].join(" ")
    );
    return haystack.includes(nq);
  }

  function getFilteredResources() {
    return RESOURCES.filter((res) => {
      if (!matchesQuery(res, state.query)) return false;
      if (state.categories.size && !res.categories.some((c) => state.categories.has(c))) return false;
      if (state.types.size && !state.types.has(res.type)) return false;
      if (state.languages.size && !state.languages.has(res.language)) return false;
      if (state.price === "free" && !res.free) return false;
      if (state.price === "paid" && res.free) return false;
      if (state.downloadableOnly && !res.downloadable) return false;
      if (state.availableOnly && !res.available) return false;
      return true;
    });
  }

  function getSortedResources(list) {
    const arr = [...list];
    switch (state.sort) {
      case "popularidad": return arr.sort((a, b) => b.views - a.views);
      case "valoracion": return arr.sort((a, b) => b.rating - a.rating);
      case "recientes": return arr.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      case "descargas": return arr.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case "az": return arr.sort((a, b) => a.title.localeCompare(b.title, "es"));
      default: return arr; // relevancia: orden natural / coincidencia de búsqueda
    }
  }

  /* ---------------------------------------------------------
     8. RENDER: TARJETAS
     --------------------------------------------------------- */
  const grid = document.getElementById("resource-grid");
  const skeletonGrid = document.getElementById("skeleton-grid");
  const emptyState = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  const loadMoreWrapper = document.getElementById("load-more-wrapper");
  const loadMoreBtn = document.getElementById("load-more-btn");

  function coverIconSvg(res) {
    return icon(TYPES[res.type].icon);
  }

  function renderCard(res) {
    const t = TYPES[res.type];
    const isFav = favorites.has(res.id);
    const card = document.createElement("article");
    card.className = "resource-card";
    card.dataset.id = res.id;

    card.innerHTML = `
      <div class="card-cover cover-${res.coverColor}" data-open="${res.id}">
        <span class="card-type-badge">${t.label}</span>
        <button class="card-fav-btn ${isFav ? "is-fav" : ""}" data-fav="${res.id}" aria-label="Guardar en favoritos" aria-pressed="${isFav}">
          ${icon("heart")}
        </button>
        ${coverIconSvg(res)}
        ${res.featured ? `<span class="card-badge-featured">${icon("check")} Recomendado</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-categories">
          ${res.categories.slice(0, 2).map((c) => `<span class="mini-tag tag-${CAT_COLOR[c]}">${CAT_MAP[c]}</span>`).join("")}
        </div>
        <h3 class="card-title" data-open="${res.id}">${res.title}</h3>
        <p class="card-meta">${res.author} · ${res.publisher} · ${res.year}</p>
        <p class="card-desc">${res.description}</p>
        <div class="card-stats-row">
          <span class="stars">★ ${res.rating.toFixed(1)}</span>
          <span>${icon("download")} ${formatNumber(res.downloads)}</span>
          <span>${icon("eye")} ${formatNumber(res.views)}</span>
        </div>
        <div class="card-footer">
          <button class="card-cta cta-primary" data-action="${t.action}" data-id="${res.id}">
            ${icon(t.ctaIcon)} ${t.cta}
          </button>
          <button class="card-detail-btn" data-open="${res.id}" aria-label="Ver detalle">
            ${icon("bookOpen")}
          </button>
        </div>
      </div>
    `;
    return card;
  }

  function renderSkeletonCards(count) {
    skeletonGrid.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "skeleton-card";
      s.innerHTML = `
        <div class="skeleton-cover skeleton-shimmer"></div>
        <div class="skeleton-line skeleton-shimmer w-60" style="margin-top:18px;"></div>
        <div class="skeleton-line skeleton-shimmer w-90"></div>
        <div class="skeleton-line skeleton-shimmer w-40" style="margin-bottom:16px;"></div>
      `;
      skeletonGrid.appendChild(s);
    }
  }

  let cardObserver = null;
  function observeCardReveal(card) {
    if (!cardObserver) {
      cardObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("card-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
      );
    }
    cardObserver.observe(card);
  }

  let currentFiltered = [];
  let renderedCount = 0;
  let loadingBatch = false;

  function updateStatPills() {
    document.getElementById("stat-total").textContent = RESOURCES.length;
    document.getElementById("stat-free").textContent = RESOURCES.filter((r) => r.free).length;
  }

  function updateResultsCount(total) {
    if (state.query) {
      resultsCount.innerHTML = `<strong>${total}</strong> resultado${total === 1 ? "" : "s"} para “${escapeHtml(state.query)}”`;
    } else {
      resultsCount.innerHTML = `<strong>${total}</strong> recurso${total === 1 ? "" : "s"} disponibles`;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function runSearchAndRender({ resetPage = true } = {}) {
    if (resetPage) state.page = 1;
    skeletonGrid.hidden = false;
    grid.style.opacity = "0.3";
    renderSkeletonCards(state.pageSize);

    // Simula latencia de red para mostrar el skeleton loading.
    window.clearTimeout(runSearchAndRender._t);
    runSearchAndRender._t = window.setTimeout(() => {
      const filtered = getFilteredResources();
      currentFiltered = getSortedResources(filtered);
      renderedCount = 0;
      grid.innerHTML = "";
      grid.style.opacity = "1";
      skeletonGrid.hidden = true;

      updateResultsCount(currentFiltered.length);
      updateActiveChips();

      if (currentFiltered.length === 0) {
        emptyState.hidden = false;
        loadMoreWrapper.hidden = true;
        return;
      }
      emptyState.hidden = true;
      appendNextBatch();
    }, 380);
  }

  function appendNextBatch() {
    if (loadingBatch) return;
    const slice = currentFiltered.slice(renderedCount, renderedCount + state.pageSize);
    if (slice.length === 0) {
      loadMoreWrapper.hidden = true;
      return;
    }
    loadingBatch = true;
    slice.forEach((res) => {
      const card = renderCard(res);
      grid.appendChild(card);
      requestAnimationFrame(() => observeCardReveal(card));
    });
    renderedCount += slice.length;
    loadMoreWrapper.hidden = renderedCount >= currentFiltered.length;
    loadingBatch = false;
  }

  /* ---------------------------------------------------------
     9. FILTROS SIDEBAR: construcción dinámica
     --------------------------------------------------------- */
  function buildCategoryFilters() {
    const wrap = document.getElementById("category-chips");
    wrap.innerHTML = CATEGORIES.map((c) => {
      const count = RESOURCES.filter((r) => r.categories.includes(c.slug)).length;
      return `
        <label class="filter-checkbox">
          <input type="checkbox" value="${c.slug}" data-filter="category">
          <span class="cat-dot dot-${CAT_COLOR[c.slug]}"></span>
          <span>${c.label}</span>
          <span class="count">${count}</span>
        </label>`;
    }).join("");
  }

  function buildTypeFilters() {
    const wrap = document.getElementById("type-chips");
    wrap.innerHTML = Object.entries(TYPES).map(([slug, t]) => {
      const count = RESOURCES.filter((r) => r.type === slug).length;
      return `
        <label class="filter-checkbox">
          <input type="checkbox" value="${slug}" data-filter="type">
          <span>${t.label}</span>
          <span class="count">${count}</span>
        </label>`;
    }).join("");
  }

  function buildLanguageFilters() {
    const wrap = document.getElementById("language-chips");
    wrap.innerHTML = LANGUAGES.map((lang) => {
      const count = RESOURCES.filter((r) => r.language === lang).length;
      if (!count) return "";
      return `
        <label class="filter-checkbox">
          <input type="checkbox" value="${lang}" data-filter="language">
          <span>${lang}</span>
          <span class="count">${count}</span>
        </label>`;
    }).join("");
  }

  function countActiveFilters() {
    return state.categories.size + state.types.size + state.languages.size +
      (state.price !== "all" ? 1 : 0) + (state.downloadableOnly ? 1 : 0) + (state.availableOnly ? 1 : 0);
  }

  function updateFiltersBadge() {
    const n = countActiveFilters();
    const badge = document.getElementById("filters-count-badge");
    badge.hidden = n === 0;
    badge.textContent = n;
  }

  function updateActiveChips() {
    const wrap = document.getElementById("active-filter-chips");
    const chips = [];

    state.categories.forEach((slug) => chips.push({ label: CAT_MAP[slug], color: CAT_COLOR[slug], clear: () => toggleSetFilter("category", slug) }));
    state.types.forEach((slug) => chips.push({ label: TYPES[slug].label, clear: () => toggleSetFilter("type", slug) }));
    state.languages.forEach((lang) => chips.push({ label: lang, clear: () => toggleSetFilter("language", lang) }));
    if (state.price === "free") chips.push({ label: "Gratuitos", clear: () => setPrice("all") });
    if (state.price === "paid") chips.push({ label: "De pago", clear: () => setPrice("all") });
    if (state.downloadableOnly) chips.push({ label: "Descargable", clear: () => { state.downloadableOnly = false; document.getElementById("filter-downloadable").checked = false; runSearchAndRender(); updateFiltersBadge(); } });
    if (state.availableOnly) chips.push({ label: "Disponible", clear: () => { state.availableOnly = false; document.getElementById("filter-available").checked = false; runSearchAndRender(); updateFiltersBadge(); } });

    wrap.hidden = chips.length === 0;
    wrap.innerHTML = chips.map((c, i) => `
      <span class="chip ${c.color ? "chip-" + c.color : ""}" data-chip-index="${i}">${escapeHtml(c.label)}<button aria-label="Quitar filtro">${icon("close")}</button></span>
    `).join("");

    [...wrap.querySelectorAll(".chip button")].forEach((btn, i) => {
      btn.addEventListener("click", () => chips[i].clear());
    });
  }

  function toggleSetFilter(kind, value) {
    const map = { category: state.categories, type: state.types, language: state.languages };
    const set = map[kind];
    if (set.has(value)) set.delete(value); else set.add(value);

    const selector = kind === "category" ? `#category-chips input[value="${cssEscape(value)}"]`
      : kind === "type" ? `#type-chips input[value="${cssEscape(value)}"]`
      : `#language-chips input[value="${cssEscape(value)}"]`;
    const input = document.querySelector(selector);
    if (input) input.checked = set.has(value);

    runSearchAndRender();
    updateFiltersBadge();
  }

  function cssEscape(v) {
    return String(v).replace(/(["\\])/g, "\\$1");
  }

  function setPrice(val) {
    state.price = val;
    document.querySelectorAll('input[name="price"]').forEach((r) => (r.checked = r.value === val));
    runSearchAndRender();
    updateFiltersBadge();
  }

  function clearAllFilters() {
    state.categories.clear();
    state.types.clear();
    state.languages.clear();
    state.price = "all";
    state.downloadableOnly = false;
    state.availableOnly = false;
    document.querySelectorAll('#category-chips input, #type-chips input, #language-chips input').forEach((i) => (i.checked = false));
    document.querySelectorAll('input[name="price"]').forEach((r) => (r.checked = r.value === "all"));
    document.getElementById("filter-downloadable").checked = false;
    document.getElementById("filter-available").checked = false;
    runSearchAndRender();
    updateFiltersBadge();
  }

  /* ---------------------------------------------------------
     10. BUSCADOR + SUGERENCIAS
     --------------------------------------------------------- */
  const searchInput = document.getElementById("resource-search");
  const searchClear = document.getElementById("search-clear");
  const suggestionsBox = document.getElementById("search-suggestions");

  function renderSuggestions(q) {
    if (!q) { suggestionsBox.hidden = true; return; }
    const matches = RESOURCES.filter((r) => matchesQuery(r, q)).slice(0, 6);
    if (matches.length === 0) {
      suggestionsBox.innerHTML = `<div class="suggestion-empty">Sin coincidencias para “${escapeHtml(q)}”</div>`;
    } else {
      suggestionsBox.innerHTML = matches.map((r) => `
        <div class="suggestion-item" data-suggest="${r.id}">
          <div class="suggestion-thumb cover-${r.coverColor}">${coverIconSvg(r)}</div>
          <div class="suggestion-text">
            <strong>${escapeHtml(r.title)}</strong>
            <span>${escapeHtml(r.author)} · ${TYPES[r.type].label}</span>
          </div>
        </div>
      `).join("");
    }
    suggestionsBox.hidden = false;
  }

  const debouncedSearch = debounce((val) => {
    state.query = val.trim();
    renderSuggestions(state.query);
    runSearchAndRender();
  }, 260);

  searchInput.addEventListener("input", (e) => {
    searchClear.hidden = !e.target.value;
    debouncedSearch(e.target.value);
  });
  searchInput.addEventListener("focus", () => { if (state.query) renderSuggestions(state.query); });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-shell")) suggestionsBox.hidden = true;
  });
  suggestionsBox.addEventListener("click", (e) => {
    const item = e.target.closest("[data-suggest]");
    if (!item) return;
    suggestionsBox.hidden = true;
    openResourceModal(item.dataset.suggest);
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    state.query = "";
    searchClear.hidden = true;
    suggestionsBox.hidden = true;
    runSearchAndRender();
  });

  /* ---------------------------------------------------------
     11. TOASTS
     --------------------------------------------------------- */
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const iconName = type === "success" ? "check" : type === "error" ? "warn" : "heart";
    toast.innerHTML = `<span class="toast-icon">${icon(iconName)}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-leaving");
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  /* ---------------------------------------------------------
     12. FAVORITOS
     --------------------------------------------------------- */
  function toggleFavorite(id, sourceEl) {
    const res = RESOURCES.find((r) => r.id === id);
    if (!res) return;
    if (favorites.has(id)) {
      favorites.delete(id);
      showToast(`Quitaste “${res.title}” de tus favoritos`, "info");
    } else {
      favorites.add(id);
      showToast(`Guardaste “${res.title}” en favoritos`, "success");
    }
    saveFavorites(favorites);

    document.querySelectorAll(`[data-fav="${id}"]`).forEach((btn) => {
      btn.classList.toggle("is-fav", favorites.has(id));
      btn.setAttribute("aria-pressed", favorites.has(id));
    });
    document.querySelectorAll(`[data-modal-fav="${id}"]`).forEach((btn) => {
      btn.classList.toggle("is-fav", favorites.has(id));
    });
  }

  /* ---------------------------------------------------------
     13. ACCIONES SEGÚN TIPO DE RECURSO
     --------------------------------------------------------- */
  function handleResourceAction(id, action) {
    const res = RESOURCES.find((r) => r.id === id);
    if (!res) return;
    switch (action) {
      case "buy":
        window.open(amazonSearchUrl(res.title, res.author), "_blank", "noopener,noreferrer");
        break;
      case "download":
        showToast(`Descargando “${res.title}”…`, "success");
        break;
      case "listen":
        showToast(`Reproduciendo audio: “${res.title}”`, "success");
        break;
      case "watch":
        openVideoModal(res);
        break;
      case "read":
      default:
        openResourceModal(id, { readMode: true });
        break;
    }
  }

  document.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) { toggleFavorite(favBtn.dataset.fav, favBtn); return; }

    const modalFavBtn = e.target.closest("[data-modal-fav]");
    if (modalFavBtn) { toggleFavorite(modalFavBtn.dataset.modalFav, modalFavBtn); return; }

    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) { handleResourceAction(actionBtn.dataset.id, actionBtn.dataset.action); return; }

    const openTrigger = e.target.closest("[data-open]");
    if (openTrigger) { openResourceModal(openTrigger.dataset.open); return; }
  });

  /* ---------------------------------------------------------
     14. RECOMENDACIONES ("También te puede interesar")
     --------------------------------------------------------- */
  function scoreRelation(base, candidate) {
    if (base.id === candidate.id) return -1;
    let score = 0;
    score += candidate.categories.filter((c) => base.categories.includes(c)).length * 3;
    score += candidate.tags.filter((t) => base.tags.includes(t)).length * 2;
    if (candidate.author === base.author) score += 2;
    if (candidate.publisher === base.publisher) score += 1;
    return score;
  }

  function getRecommendationBlocks(base) {
    const others = RESOURCES.filter((r) => r.id !== base.id);

    const related = [...others]
      .map((r) => ({ r, s: scoreRelation(base, r) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((x) => x.r);

    const relatedIds = new Set(related.map((r) => r.id));

    const popular = [...others]
      .filter((r) => !relatedIds.has(r.id))
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
    const popularIds = new Set(popular.map((r) => r.id));

    const recent = [...others]
      .filter((r) => !relatedIds.has(r.id) && !popularIds.has(r.id))
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, 4);
    const recentIds = new Set(recent.map((r) => r.id));

    const professional = [...others]
      .filter((r) => r.featured && !relatedIds.has(r.id) && !popularIds.has(r.id) && !recentIds.has(r.id))
      .slice(0, 4);

    const blocks = [
      { key: "related", emoji: "📚", label: "Recursos relacionados", items: related },
      { key: "popular", emoji: "⭐", label: "Más populares", items: popular },
      { key: "new", emoji: "🆕", label: "Nuevos recursos", items: recent },
      { key: "pro", emoji: "👨‍⚕️", label: "Recomendados por profesionales", items: professional },
    ];

    if (favorites.size > 0) {
      const favTags = new Set();
      const favCats = new Set();
      favorites.forEach((fid) => {
        const fr = RESOURCES.find((r) => r.id === fid);
        if (!fr) return;
        fr.tags.forEach((t) => favTags.add(t));
        fr.categories.forEach((c) => favCats.add(c));
      });
      const personalized = others
        .filter((r) => !favorites.has(r.id))
        .map((r) => ({ r, s: r.categories.filter((c) => favCats.has(c)).length + r.tags.filter((t) => favTags.has(t)).length }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 4)
        .map((x) => x.r);
      if (personalized.length) {
        blocks.push({ key: "personal", emoji: "❤️", label: "Basados en tus intereses", items: personalized });
      }
    }

    return blocks.filter((b) => b.items.length > 0);
  }

  function renderRecoCard(res) {
    return `
      <div class="reco-card" data-open="${res.id}">
        <div class="reco-cover cover-${res.coverColor}">${coverIconSvg(res)}</div>
        <div class="reco-info">
          <h5>${escapeHtml(res.title)}</h5>
          <span>${escapeHtml(res.author)} · ★ ${res.rating.toFixed(1)}</span>
        </div>
      </div>`;
  }

  function renderRecommendationsHtml(base) {
    const blocks = getRecommendationBlocks(base);
    if (!blocks.length) return "";
    return `
      <div class="modal-divider"></div>
      <div class="modal-section">
        <h4 style="font-size:1.05rem; margin-bottom:18px;">También te puede interesar</h4>
        ${blocks.map((b) => `
          <div class="reco-block">
            <div class="reco-block-header"><span class="reco-emoji">${b.emoji}</span><h4>${b.label}</h4></div>
            <div class="reco-row">${b.items.map(renderRecoCard).join("")}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  /* ---------------------------------------------------------
     15. MODAL DE DETALLE
     --------------------------------------------------------- */
  const resourceModal = document.getElementById("resource-modal");
  const modalBody = document.getElementById("modal-body");

  function openResourceModal(id) {
    const res = RESOURCES.find((r) => r.id === id);
    if (!res) return;
    const t = TYPES[res.type];
    pushHistory(res.id);
    renderRecentSection();

    const isFav = favorites.has(res.id);

    modalBody.innerHTML = `
      <div class="modal-top">
        <div class="modal-cover cover-${res.coverColor}">${coverIconSvg(res)}</div>
        <div class="modal-header-info">
          <div class="modal-categories">${res.categories.map((c) => `<span class="mini-tag tag-${CAT_COLOR[c]}">${CAT_MAP[c]}</span>`).join("")}</div>
          <h2 id="modal-title" class="modal-title">${escapeHtml(res.title)}</h2>
          <p class="modal-authorline">Por <strong>${escapeHtml(res.author)}</strong> · ${escapeHtml(res.publisher)} · ${res.year}</p>
          <div class="modal-rating-row">
            <span class="stars">${starRow(res.rating)} ${res.rating.toFixed(1)}</span>
            <span>${icon("download", 'style="width:14px;height:14px;vertical-align:-2px;"')} ${formatNumber(res.downloads)} descargas</span>
            <span>${icon("eye", 'style="width:14px;height:14px;vertical-align:-2px;"')} ${formatNumber(res.views)} vistas</span>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" data-action="${t.action}" data-id="${res.id}">${icon(t.ctaIcon)} ${t.cta}</button>
            <button class="icon-btn ${isFav ? "is-fav" : ""}" data-modal-fav="${res.id}" aria-label="Guardar en favoritos">${icon("heart")}</button>
            <button class="icon-btn" data-share="${res.id}" aria-label="Compartir">${icon("share")}</button>
          </div>
        </div>
      </div>

      <div class="modal-section">
        <h4>Descripción</h4>
        <p>${escapeHtml(res.longDescription)}</p>
      </div>

      <div class="modal-section">
        <h4>Información del recurso</h4>
        <div class="modal-detail-grid">
          <div class="modal-detail-item"><span class="label">Autor</span><span class="value">${escapeHtml(res.author)}</span></div>
          <div class="modal-detail-item"><span class="label">Editorial</span><span class="value">${escapeHtml(res.publisher)}</span></div>
          ${res.isbn ? `<div class="modal-detail-item"><span class="label">ISBN</span><span class="value">${res.isbn}</span></div>` : ""}
          <div class="modal-detail-item"><span class="label">Idioma</span><span class="value">${res.language}</span></div>
          ${res.pages ? `<div class="modal-detail-item"><span class="label">Páginas</span><span class="value">${res.pages}</span></div>` : ""}
          <div class="modal-detail-item"><span class="label">Publicado</span><span class="value">${formatDate(res.dateAdded)}</span></div>
          <div class="modal-detail-item"><span class="label">Tipo</span><span class="value">${t.label}</span></div>
          <div class="modal-detail-item"><span class="label">Acceso</span><span class="value">${res.free ? "Gratuito" : "De pago"}</span></div>
        </div>
      </div>

      <div class="modal-section">
        <h4>Etiquetas</h4>
        <div class="modal-tags">${res.tags.map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}</div>
      </div>

      ${renderRecommendationsHtml(res)}
    `;

    resourceModal.hidden = false;
    document.body.style.overflow = "hidden";
    resourceModal.querySelector(".modal-close-btn").focus();
  }

  function closeResourceModal() {
    resourceModal.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("modal-close").addEventListener("click", closeResourceModal);
  resourceModal.addEventListener("click", (e) => { if (e.target === resourceModal) closeResourceModal(); });

  modalBody.addEventListener("click", (e) => {
    const shareBtn = e.target.closest("[data-share]");
    if (shareBtn) {
      const res = RESOURCES.find((r) => r.id === shareBtn.dataset.share);
      const url = `${location.origin}${location.pathname}#${res.id}`;
      if (navigator.share) {
        navigator.share({ title: res.title, url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => showToast("Enlace copiado al portapapeles", "success"));
      } else {
        showToast("Enlace: " + url, "info");
      }
    }
  });

  /* ---------------------------------------------------------
     16. MODAL DE VIDEO
     --------------------------------------------------------- */
  const videoModal = document.getElementById("video-modal");
  const videoModalBody = document.getElementById("video-modal-body");

  function openVideoModal(res) {
    videoModalBody.innerHTML = `
      <div class="video-placeholder cover-${res.coverColor}">
        <div class="play-badge">${icon("play")}</div>
        <span style="font-size:0.8rem; opacity:0.85;">Reproductor de video (vista previa)</span>
      </div>
      <div class="video-modal-caption">
        <h3 id="video-modal-title">${escapeHtml(res.title)}</h3>
        <p>${escapeHtml(res.author)} · ${res.year}</p>
      </div>
    `;
    videoModal.hidden = false;
    document.body.style.overflow = "hidden";
    pushHistory(res.id);
  }
  document.getElementById("video-modal-close").addEventListener("click", () => {
    videoModal.hidden = true;
    document.body.style.overflow = "";
  });
  videoModal.addEventListener("click", (e) => { if (e.target === videoModal) { videoModal.hidden = true; document.body.style.overflow = ""; } });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!resourceModal.hidden) closeResourceModal();
    if (!videoModal.hidden) { videoModal.hidden = true; document.body.style.overflow = ""; }
  });

  /* ---------------------------------------------------------
     17. VISTOS RECIENTEMENTE
     --------------------------------------------------------- */
  function renderRecentSection() {
    const ids = getHistory();
    const section = document.getElementById("recent-section");
    const grid = document.getElementById("recent-grid");
    if (!ids.length) { section.hidden = true; return; }
    const items = ids.map((id) => RESOURCES.find((r) => r.id === id)).filter(Boolean);
    if (!items.length) { section.hidden = true; return; }
    grid.innerHTML = items.map(renderRecoCard).join("");
    section.hidden = false;
    section.classList.add("reveal", "active");
  }

  /* ---------------------------------------------------------
     18. SCROLL INFINITO + BOTÓN DE RESPALDO
     --------------------------------------------------------- */
  function initInfiniteScroll() {
    const sentinel = document.getElementById("scroll-sentinel");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loadMoreWrapper.hidden) appendNextBatch();
      });
    }, { rootMargin: "300px" });
    io.observe(sentinel);

    loadMoreBtn.addEventListener("click", appendNextBatch);
  }

  /* ---------------------------------------------------------
     19. FILTROS: EVENTOS
     --------------------------------------------------------- */
  function initFilterEvents() {
    document.getElementById("category-chips").addEventListener("change", (e) => {
      if (e.target.dataset.filter === "category") toggleSetFilter("category", e.target.value);
    });
    document.getElementById("type-chips").addEventListener("change", (e) => {
      if (e.target.dataset.filter === "type") toggleSetFilter("type", e.target.value);
    });
    document.getElementById("language-chips").addEventListener("change", (e) => {
      if (e.target.dataset.filter === "language") toggleSetFilter("language", e.target.value);
    });
    document.querySelectorAll('input[name="price"]').forEach((r) => {
      r.addEventListener("change", (e) => setPrice(e.target.value));
    });
    document.getElementById("filter-downloadable").addEventListener("change", (e) => {
      state.downloadableOnly = e.target.checked;
      runSearchAndRender();
      updateFiltersBadge();
    });
    document.getElementById("filter-available").addEventListener("change", (e) => {
      state.availableOnly = e.target.checked;
      runSearchAndRender();
      updateFiltersBadge();
    });
    document.getElementById("filters-clear").addEventListener("click", clearAllFilters);
    document.getElementById("empty-clear-btn").addEventListener("click", clearAllFilters);

    document.querySelectorAll(".filter-group-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const body = document.getElementById(btn.dataset.target);
        const open = body.dataset.open === "true";
        body.dataset.open = String(!open);
        btn.setAttribute("aria-expanded", String(!open));
      });
    });

    document.getElementById("sort-select").addEventListener("change", (e) => {
      state.sort = e.target.value;
      runSearchAndRender({ resetPage: false });
    });

    // Filtros en móvil (drawer)
    const toggleBtn = document.getElementById("filters-toggle");
    const sidebar = document.getElementById("filters-sidebar");
    const scrim = document.getElementById("filters-scrim");
    function openDrawer() {
      sidebar.classList.add("is-open");
      scrim.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
    function closeDrawer() {
      sidebar.classList.remove("is-open");
      scrim.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });
    scrim.addEventListener("click", closeDrawer);
  }

  /* ---------------------------------------------------------
     20. INIT
     --------------------------------------------------------- */
  function init() {
    updateStatPills();
    buildCategoryFilters();
    buildTypeFilters();
    buildLanguageFilters();
    initFilterEvents();
    initInfiniteScroll();
    renderRecentSection();
    runSearchAndRender();

    // Abrir directamente un recurso si llega por hash (#rXX), útil para compartir enlaces.
    if (location.hash) {
      const id = location.hash.replace("#", "");
      if (RESOURCES.some((r) => r.id === id)) openResourceModal(id);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
