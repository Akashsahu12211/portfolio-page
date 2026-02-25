/**
 * AKASH SAHU — PORTFOLIO  |  script.js
 * Vanilla JS: Cursor, Navbar, Typed Text, Scroll Reveal,
 * Counters, DSA Bars, Contribution Graph, Modal, Form Validation
 */

'use strict';

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Ring follows with lag
  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow on interactive elements
  const interactables = 'a, button, input, textarea, [onclick]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(interactables) || e.target.closest(interactables)) {
      ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
      ring.style.borderColor = 'rgba(59,130,246,0.8)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(interactables) || e.target.closest(interactables)) {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'rgba(59,130,246,0.5)';
    }
  });
})();

/* ═══════════════════════════════════════════
   NAVBAR — scroll effect & active link
═══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('.nav-link');
  const sections = [];

  // Collect sections matching nav links
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const sec = document.querySelector(href);
      if (sec) sections.push({ el: sec, link });
    }
  });

  window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach(({ el, link }) => {
      const top = el.offsetTop;
      const bot = top + el.offsetHeight;
      if (scrollMid >= top && scrollMid < bot) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ═══════════════════════════════════════════
   TYPED TEXT (hero role)
═══════════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Full Stack Java Developer',
    'Spring Boot Engineer',
    'DSA Enthusiast',
    'Aspiring FAANG SDE',
    'React.js Developer',
  ];

  let pi = 0, ci = 0, deleting = false;

  function type() {
    const current = phrases[pi];
    if (!deleting) {
      el.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) {
        setTimeout(() => { deleting = true; requestAnimationFrame(tick); }, 1800);
        return;
      }
    } else {
      el.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    requestAnimationFrame(tick);
  }

  let last = 0;
  function tick(ts) {
    const delay = deleting ? 45 : 70;
    if (ts - last >= delay) {
      last = ts;
      type();
    } else {
      requestAnimationFrame(tick);
    }
  }

  setTimeout(() => requestAnimationFrame(tick), 600);
})();

/* ═══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const dur = 1800;
      let start = null;

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / dur, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ═══════════════════════════════════════════
   DSA PROGRESS BARS
═══════════════════════════════════════════ */
(function initDsaBars() {
  const bars = document.querySelectorAll('.dsa-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const w = bar.dataset.width || '0';
      setTimeout(() => {
        bar.style.width = w + '%';
      }, 200);
      obs.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
})();

/* ═══════════════════════════════════════════
   GITHUB CONTRIBUTION GRAPH (static mock)
═══════════════════════════════════════════ */
(function initContribGraph() {
  const container = document.getElementById('contribGraph');
  if (!container) return;

  const weeks = 53;
  const days = 7;

  // Weighted random: more empty cells, occasional bursts
  function randomLevel() {
    const r = Math.random();
    if (r < 0.38) return 0;
    if (r < 0.60) return 1;
    if (r < 0.78) return 2;
    if (r < 0.91) return 3;
    return 4;
  }

  const colorMap = {
    0: 'rgba(255,255,255,0.05)',
    1: 'rgba(59,130,246,0.22)',
    2: 'rgba(59,130,246,0.42)',
    3: 'rgba(59,130,246,0.65)',
    4: '#3b82f6',
  };

  for (let w = 0; w < weeks; w++) {
    const col = document.createElement('div');
    col.className = 'contrib-week';
    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      cell.className = 'contrib-cell';
      const level = randomLevel();
      cell.style.background = colorMap[level];
      cell.title = `${level > 0 ? level + ' contribution' + (level > 1 ? 's' : '') : 'No contributions'}`;
      col.appendChild(cell);
    }
    container.appendChild(col);
  }
})();

/* ═══════════════════════════════════════════
   PROJECT MODAL DATA
═══════════════════════════════════════════ */
const projectData = {
  qr: {
    tag: 'Full Stack · Academic Automation',
    title: 'QR-Based Attendance System',
    desc: 'A comprehensive academic automation system built to eliminate proxy attendance and manual record-keeping. The system uses dynamically generated QR codes for session-based attendance marking with real-time validation against a MySQL database.',
    features: [
      'Secure login system with role-based access (Admin / Student)',
      'Dynamic QR code generation per session with time-bound validation',
      'Real-time attendance validation against database records',
      'Admin dashboard for managing students, courses, and attendance logs',
      'Database-driven attendance reports with export functionality',
      'Proxy attendance prevention through session-specific QR codes',
    ],
    tech: ['Spring Boot', 'Spring Data JPA', 'REST APIs', 'React.js', 'MySQL', 'JWT Authentication'],
    problem: 'Traditional attendance systems are plagued by proxy marking and manual data entry errors. This system completely automates the process, ensuring accuracy and eliminating the possibility of proxy attendance through time-bound, session-unique QR codes.',
    github: null,
    live: null,
  },
  task: {
    tag: 'Backend · Console Application',
    title: 'Task Scheduling System',
    desc: 'A robust console-based task management and scheduling system built with Core Java and JDBC. Designed to demonstrate real-world database connectivity, structured relational design, and clean Java code architecture.',
    features: [
      'Full CRUD operations: Create, Read, Update, Delete tasks',
      'Direct JDBC database connectivity without ORM overhead',
      'Structured relational schema with proper indexing',
      'Task scheduling logic with priority and deadline tracking',
      'Console-driven menu interface with input validation',
      'Clean separation of concerns: DAO, Service, and Model layers',
    ],
    tech: ['Core Java', 'JDBC', 'MySQL', 'OOP Design', 'DAO Pattern'],
    problem: 'Manual task tracking with spreadsheets lacks automation and is error-prone. This system provides a database-backed solution that automates task lifecycle management with persistent storage and structured querying.',
    github: 'https://github.com/Akashsahu12211/Task_Scheduling_System',
    live: null,
  },
};

/**
 * openModal(projectId) — render and show modal
 */
window.openModal = function(id) {
  const data = projectData[id];
  if (!data) return;

  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <span class="modal-tag">${data.tag}</span>
    <h2>${data.title}</h2>
    <p class="modal-desc">${data.desc}</p>

    <span class="modal-section-label">Key Features</span>
    <ul class="modal-features">
      ${data.features.map(f => `<li>${f}</li>`).join('')}
    </ul>

    <span class="modal-section-label">Tech Stack</span>
    <div class="modal-tech-row">
      ${data.tech.map(t => `<span>${t}</span>`).join('')}
    </div>

    <span class="modal-section-label">Problem Solved</span>
    <div class="modal-problem"><p>${data.problem}</p></div>

    <div class="modal-actions">
      ${data.github
        ? `<a href="${data.github}" target="_blank" rel="noopener" class="btn-primary">View on GitHub →</a>`
        : '<span style="font-size:0.8rem;color:var(--text-dim);font-family:var(--font-mono)">GitHub coming soon</span>'
      }
      ${data.live
        ? `<a href="${data.live}" target="_blank" rel="noopener" class="btn-ghost">Live Demo →</a>`
        : ''
      }
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

/**
 * closeModal() — hide modal
 */
window.closeModal = function() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ═══════════════════════════════════════════
   CONTACT FORM VALIDATION
═══════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
  };
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  // Validators
  const validators = {
    name:    v => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.',
    message: v => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.',
  };

  function showError(field, msg) {
    fields[field].el.classList.toggle('error', !!msg);
    fields[field].err.textContent = msg;
  }

  function validateField(name) {
    const val = fields[name].el.value;
    const err = validators[name](val);
    showError(name, err);
    return !err;
  }

  // Live validation on blur
  Object.keys(fields).forEach(name => {
    fields[name].el.addEventListener('blur', () => validateField(name));
    fields[name].el.addEventListener('input', () => {
      if (fields[name].el.classList.contains('error')) validateField(name);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all
    const valid = Object.keys(fields).map(name => validateField(name)).every(Boolean);
    if (!valid) return;

    // Simulate form submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <span>&#8594;</span>';
      formSuccess.classList.add('show');
      form.reset();
      Object.keys(fields).forEach(name => fields[name].el.classList.remove('error'));

      // Hide success after 5s
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1400);
  });
})();

/* ═══════════════════════════════════════════
   SMOOTH SCROLL for all anchor links
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════
   PAGE LOAD — animate hero elements immediately
═══════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  // Trigger hero reveal elements with stagger
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay + 200);
  });
});