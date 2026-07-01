// --- GESTIÓN DE TEMA (MODO OSCURO) ---
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (!toggleBtn) return;

  // Revisar preferencia guardada
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    setSunIcon(themeIcon);
  } else {
    setMoonIcon(themeIcon);
  }

  toggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setMoonIcon(themeIcon);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setSunIcon(themeIcon);
    }
  });
}

// Icono del sol (Modo Claro activo - clic para oscuro)
function setSunIcon(icon) {
  icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
}

// Icono de la luna (Modo Oscuro activo - clic para claro)
function setMoonIcon(icon) {
  icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
}

// --- EFECTOS HOVER DE LOS ORBES (TOOLTIP APPLE) ---
const orbs = document.querySelectorAll('.orb');

orbs.forEach(orb => {
  orb.addEventListener('mouseenter', (e) => {
    const emotionName = orb.dataset.emotion;
    if (!emotionName) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'apple-tooltip';
    tooltip.textContent = emotionName;
    document.body.appendChild(tooltip);

    const rect = orb.getBoundingClientRect();
    
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    tooltip.style.top = `${rect.top - 10}px`;

    requestAnimationFrame(() => {
      tooltip.classList.add('visible');
    });

    orb._tooltip = tooltip;
  });

  orb.addEventListener('mouseleave', () => {
    if (orb._tooltip) {
      orb._tooltip.classList.remove('visible');
      setTimeout(() => orb._tooltip.remove(), 200);
      orb._tooltip = null;
    }
  });
});

// --- ANIMACIÓN DE REVELADO AL SCROLLEAR ---
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });
});

// --- LÓGICA DEL ACORDEÓN (FAQ) ---
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});

// --- CARGAR COMPONENTES MODULARES (HEADER Y FOOTER) ---
document.addEventListener("DOMContentLoaded", () => {

  // Cargar Header Dinámico
  fetch('header.html?v=' + new Date().getTime())
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el header');
      return response.text();
    })
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      // Inicializar el botón de tema luego de inyectar el HTML
      initThemeToggle();
    })
    .catch(error => console.error('Error cargando el header:', error));

  // Cargar Footer Dinámico
  fetch('footer.html?v=' + new Date().getTime())
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el footer');
      return response.text();
    })
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
      
      const inyectedFooter = document.querySelector('.mente-footer.reveal');
      if (inyectedFooter) {
        setTimeout(() => {
          inyectedFooter.classList.add('active');
        }, 50);
      }
    })
    .catch(error => console.error('Error cargando el footer:', error));
});