/**
 * DENAR B. MONTAÑO SEJAS - CV & PORTFOLIO INTERACTIVO
 * Script principal: Animaciones Avanzadas, Canvas de Red TI, Typewriter, 3D Tilt,
 * Foco de Luz del Cursor, Terminal SysAdmin con Tipeo en Vivo y Scroll Reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientBlobs();
  initNetworkCanvas();
  initTypewriter();
  init3DTiltAndSpotlight();
  initScrollReveal();
  initSkillsProgress();
  initThemeToggle();
  initTerminalTabs();
  initSkillsFilter();
  initCounters();
  initMobileMenu();
  initClipboardAndActions();
  initContactForm();
  initButtonRipples();
});

/* ==========================================================================
   1. ORBES AMBIENTALES DINÁMICOS
   ========================================================================== */
function initAmbientBlobs() {
  if (document.querySelector('.ambient-glow')) return;
  const b1 = document.createElement('div');
  b1.className = 'ambient-glow glow-1';
  const b2 = document.createElement('div');
  b2.className = 'ambient-glow glow-2';
  const b3 = document.createElement('div');
  b3.className = 'ambient-glow glow-3';
  document.body.prepend(b3);
  document.body.prepend(b2);
  document.body.prepend(b1);
}

/* ==========================================================================
   2. CANVAS DE RED TI INTERACTIVO (Partículas & Nodos Conectados)
   ========================================================================== */
function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 75;
  const maxDistance = 145;
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2.2 + 1.2;
      this.pulse = Math.random() * Math.PI;
      this.pulseSpeed = 0.03 + Math.random() * 0.02;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const currentRadius = this.radius + Math.sin(this.pulse) * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.45)' : 'rgba(0, 210, 255, 0.65)';
      ctx.shadowBlur = 8;
      ctx.shadowColor = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(0, 210, 255, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? 'rgba(2, 132, 199,' : 'rgba(0, 210, 255,';
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      // Conexión entre nodos
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${lineColor} ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      // Conexión con el puntero del ratón e interactividad
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.55;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${lineColor} ${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
          
          // Suave atracción hacia el mouse
          particles[i].x -= dx * 0.015;
          particles[i].y -= dy * 0.015;
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   3. TYPEWRITER EFFECT (Texto que se Escribe Solo)
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;
  
  const words = [
    'Soporte TI N1/N2 & Microinformática',
    'Microsoft Intune (MDM Android & iOS)',
    'Active Directory & Entra ID Security',
    'Gestión de Incidencias en ServiceNow',
    'Salas de Videoconferencia Cisco & Logitech',
    'Power BI Dashboards & Excel Especialista',
    'Redes Cisco CCNA & Cableado Estructurado'
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 90;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 85;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2200; // Pausa antes de borrar
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400; // Pausa antes de empezar la nueva palabra
    }
    
    setTimeout(type, delay);
  }
  
  type();
}

/* ==========================================================================
   4. EFECTO 3D TILT & MOUSE SPOTLIGHT (Foco de Luz en las Tarjetas)
   ========================================================================== */
function init3DTiltAndSpotlight() {
  const cards = document.querySelectorAll('.bento-card, .exp-card, .cert-card, .terminal-card, .education-banner');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Actualizar variables CSS para la luz de foco
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Si la tarjeta soporta 3D Tilt suave
      if (window.innerWidth > 992 && !card.classList.contains('no-tilt')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   5. SCROLL REVEAL (Aparición Fluida al Desplazar)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Escalonamiento visual (stagger)
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, idx * 75);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. BARRAS DE PROGRESO DE HABILIDADES CON ANIMACIÓN FLUIDA
   ========================================================================== */
function initSkillsProgress() {
  const bars = document.querySelectorAll('.skill-progress-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width') || bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 150);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  
  const skillsSection = document.getElementById('habilidades');
  if (skillsSection) observer.observe(skillsSection);
}

/* ==========================================================================
   7. TERMINAL SYSADMIN CON TIPEO EN VIVO (Simulador Interactivo)
   ========================================================================== */
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.term-tab');
  const body = document.getElementById('terminal-body');
  if (!tabs.length || !body) return;
  
  const terminalData = {
    whoami: {
      cmd: 'whoami --profile',
      html: `
        • <strong>Nombre:</strong> Denar B. Montaño Sejas<br>
        • <strong>Título:</strong> Ingeniero de Sistemas (UTEPSA)<br>
        • <strong>Rol Principal:</strong> Soporte TI N1/N2 & Microinformática Especializada<br>
        • <strong>Ubicación:</strong> Santa Cruz, Bolivia (Disponible presencial / remoto / híbrido)<br>
        • <strong>Estado:</strong> <span class="status-ok">● LISTO PARA NUEVAS OPORTUNIDADES</span>
      `
    },
    services: {
      cmd: 'get-service-status --critical',
      html: `
        [+] Microsoft Intune MDM .......... <span class="status-ok">[ENFORCE POLICIES: 100%]</span><br>
        [+] Active Directory / Entra ID .... <span class="status-ok">[SYNCED & SECURED]</span><br>
        [+] ServiceNow ITSM Engine ........ <span class="status-ok">[SLA COMPLIANCE: OPTIMAL]</span><br>
        [+] Salas Cisco/Logitech Video .... <span class="status-ok">[OPERATIVAS N1/N2]</span><br>
        [+] MS Defender for Endpoint ...... <span class="status-ok">[PROTECTION ACTIVE]</span>
      `
    },
    infra: {
      cmd: 'show-stats --historical',
      html: `
        • <strong>Experiencia TI:</strong> +5 Años en entornos corporativos de alta demanda (Repsol, Tigo)<br>
        • <strong>Atención al Usuario:</strong> +10 Años de excelencia en servicio y resolución<br>
        • <strong>Gestión de Activos:</strong> Inventario, ciclo de vida hardware y renovación de licencias<br>
        • <strong>Dashboards:</strong> Métricas en Excel y Power BI para control de suministros
      `
    },
    contact: {
      cmd: 'curl -s https://denar.contact/quick',
      html: `
        • <strong>Email:</strong> <a href="mailto:denarms@gmail.com" style="color:var(--primary);text-decoration:none;font-weight:700;">denarms@gmail.com</a><br>
        • <strong>Móvil / WhatsApp:</strong> <a href="https://wa.me/59177806866" target="_blank" style="color:#25d366;text-decoration:none;font-weight:700;">+591 77806866</a><br>
        • <strong>Ciudad:</strong> Santa Cruz, Bolivia<br>
        • <strong>Acción:</strong> Pulsa el botón "Contactar por WhatsApp" o "Descargar CV"
      `
    }
  };
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-tab');
      
      if (terminalData[key]) {
        // Efecto de tipeo rápido en la consola
        body.innerHTML = `
          <div class="term-line"><span class="term-prompt">denar@sysadmin:~$</span> <span class="term-cmd" id="typed-cmd"></span></div>
          <div class="term-output" id="typed-out" style="display:none;"></div>
        `;
        
        const cmdSpan = document.getElementById('typed-cmd');
        const outDiv = document.getElementById('typed-out');
        const cmdText = terminalData[key].cmd;
        let cIdx = 0;
        
        const timer = setInterval(() => {
          cmdSpan.textContent = cmdText.substring(0, cIdx + 1);
          cIdx++;
          if (cIdx >= cmdText.length) {
            clearInterval(timer);
            setTimeout(() => {
              outDiv.innerHTML = terminalData[key].html;
              outDiv.style.display = 'block';
            }, 100);
          }
        }, 22);
      }
    });
  });
}

/* ==========================================================================
   8. FILTRADO DE HABILIDADES TÉCNICAS
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92) translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 240);
        }
      });
    });
  });
}

/* ==========================================================================
   9. MODO CLARO / OSCURO (THEME SWITCHER)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const savedTheme = localStorage.getItem('denar_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('denar_theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  function updateThemeIcon(theme) {
    toggleBtn.innerHTML = theme === 'dark' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }
}

/* ==========================================================================
   10. CONTADORES ANIMADOS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'), 10);
          if (isNaN(target)) return;
          let count = 0;
          const duration = 1600;
          const step = Math.ceil(target / (duration / 30));
          
          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.textContent = '+' + target;
              clearInterval(timer);
            } else {
              counter.textContent = '+' + count;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

/* ==========================================================================
   11. ONDA EXPANSIVA EN CLIC DE BOTONES (RIPPLE EFFECT)
   ========================================================================== */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.background = 'rgba(255, 255, 255, 0.45)';
      circle.style.transform = 'scale(0)';
      circle.style.animation = 'ripple 0.6s linear';
      circle.style.pointerEvents = 'none';
      
      const prevRipple = this.querySelector('.ripple-effect');
      if (prevRipple) prevRipple.remove();
      
      circle.classList.add('ripple-effect');
      this.appendChild(circle);
      
      setTimeout(() => circle.remove(), 600);
    });
  });
  
  // Agregar keyframe de ripple dinámicamente si no existe
  if (!document.getElementById('ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(3.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ==========================================================================
   12. MENÚ MÓVIL
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
  });
  
  document.querySelectorAll('.nav-link, .mobile-drawer-item a, .mobile-drawer-item button').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Cerrar al hacer clic fuera del menú en móvil
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

/* ==========================================================================
   13. COPIAR CORREO / TELÉFONO & ACCIÓN DE IMPRIMIR
   ========================================================================== */
function initClipboardAndActions() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const printBtns = document.querySelectorAll('.print-cv-btn');
  
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('denarms@gmail.com').then(() => {
        showToast('¡Correo denarms@gmail.com copiado al portapapeles!');
      });
    });
  });
  
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('notification-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'notification-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   14. FORMULARIO DE CONTACTO RÁPIDO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('quick-contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    
    if (!name || !email || !message) {
      showToast('Por favor completa todos los campos.');
      return;
    }
    
    const subject = encodeURIComponent(`Contacto Profesional Portfolio: ${name}`);
    const bodyText = encodeURIComponent(`Hola Denar,\n\nSoy ${name} (${email}).\n\nMensaje:\n${message}`);
    
    window.location.href = `mailto:denarms@gmail.com?subject=${subject}&body=${bodyText}`;
    showToast('¡Abriendo tu cliente de correo para enviar el mensaje!');
    form.reset();
  });
}
