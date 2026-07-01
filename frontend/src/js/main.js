// src/js/main.js
import { initThemeToggle } from './theme.js';
import { initUIEffects } from './ui.js';
import { initFAQ } from './faq.js';

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de componentes de UI y lógica general
  initUIEffects();
  initFAQ();

  // Función para cargar componentes HTML externos con la ruta corregida
  const cargarComponente = (url, id, callback) => {
    fetch(`${url}?v=${new Date().getTime()}`)
      .then(res => {
        if (!res.ok) throw new Error(`No se pudo cargar: ${url}`);
        return res.text();
      })
      .then(html => {
        document.getElementById(id).innerHTML = html;
        if (callback) callback();
      })
      .catch(err => console.error(err));
  };

  // Rutas actualizadas a src/components/common/
  cargarComponente('../src/components/common/header.html', 'header-container', initThemeToggle);
  
  cargarComponente('../src/components/common/footer.html', 'footer-container', () => {
    const footer = document.querySelector('.mente-footer.reveal');
    if (footer) setTimeout(() => footer.classList.add('active'), 50);
  });
});