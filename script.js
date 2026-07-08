/* ==========================================================================
   ANUSHA S — PORTFOLIO SCRIPT
   Organized into independent, self-contained functions initialized on
   DOMContentLoaded. Each function handles exactly one feature.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initThemeToggle();
  initHamburgerMenu();
  initSmoothScrollAndActiveNav();
  initNavbarScrollState();
  initTypingEffect();
  initScrollRevealAnimations();
  initAnimatedCounters();
  initSkillProgressBars();
  initProjectFilter();
  initScrollToTopButton();
  initContactForm();
  initResumeDownload();
  initFooterYear();
});

/* --------------------------------------------------------------------
   1. PAGE LOADER
   Hides the loading screen once the window has fully loaded (or after
   a minimum delay so the animation is visible even on fast connections).
-------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hideLoader = () => loader.classList.add('is-hidden');

  // Minimum display time of 900ms for a smooth experience, capped at 2.5s max wait.
  const minDelay = new Promise(resolve => setTimeout(resolve, 900));
  const pageLoaded = new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  Promise.all([minDelay, pageLoaded]).then(hideLoader);

  // Safety net: never let the loader block the site for more than 2.5s.
  setTimeout(hideLoader, 2500);
}

/* --------------------------------------------------------------------
   2. DARK / LIGHT MODE TOGGLE (persisted via localStorage)
-------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

  // Apply saved preference, or fall back to system preference.
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
  applyTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }
}

/* --------------------------------------------------------------------
   3. MOBILE HAMBURGER MENU
-------------------------------------------------------------------- */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu whenever a link inside it is clicked.
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------
   4. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHTING
   All [data-nav] links get smooth-scroll behavior, and the tab bar
   highlights the section currently in view using IntersectionObserver.
-------------------------------------------------------------------- */
function initSmoothScrollAndActiveNav() {
  const navLinks = document.querySelectorAll('[data-nav]');
  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Active tab highlighting based on visible section.
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const desktopTabs = document.querySelectorAll('.navbar__tabs .tab');
  const mobileTabs = document.querySelectorAll('.mobile-menu .tab');

  const setActive = (id) => {
    [...desktopTabs, ...mobileTabs].forEach(tab => {
      const match = tab.getAttribute('href') === `#${id}`;
      tab.classList.toggle('active', match);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { rootMargin: `-${navbarHeight + 20}px 0px -60% 0px`, threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------
   5. NAVBAR SCROLL STATE (subtle shadow once page is scrolled)
-------------------------------------------------------------------- */
function initNavbarScrollState() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 6px 20px rgba(0,0,0,0.25)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------
   6. HERO TYPING EFFECT
   Cycles through a list of professional titles/roles.
-------------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Full Stack Development Trainee',
    'Python Developer',
    'React.js Enthusiast',
    'API Testing Intern',
    'Aspiring Software Engineer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_SPEED = 80;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER_TYPE = 1500;
  const PAUSE_AFTER_DELETE = 400;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentPhrase.slice(0, charIndex);
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = currentPhrase.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* --------------------------------------------------------------------
   7. SCROLL REVEAL ANIMATIONS
   Fades/slides elements with the `.reveal` class into view once, the
   first time they cross into the viewport.
-------------------------------------------------------------------- */
function initScrollRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Small stagger for elements revealing together.
        setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------
   8. ANIMATED COUNTERS
   Counts each `.counter` element up to its `data-target` value once
   visible on screen.
-------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------
   9. SKILL PROGRESS BARS
   Fills each `.skill-bar__fill` to its `data-fill` percentage once
   the skills section scrolls into view.
-------------------------------------------------------------------- */
function initSkillProgressBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const fill = bar.getAttribute('data-fill') || '0';
        // Delay slightly so the width transition is visible.
        requestAnimationFrame(() => {
          bar.style.width = `${fill}%`;
        });
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* --------------------------------------------------------------------
   10. FILTERABLE PROJECT GALLERY
-------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        const shouldShow = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });
}

/* --------------------------------------------------------------------
   11. SCROLL-TO-TOP BUTTON
-------------------------------------------------------------------- */
function initScrollToTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------
   12. CONTACT FORM VALIDATION (frontend-only, no backend)
-------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), errorEl: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), errorEl: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), errorEl: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), errorEl: document.getElementById('messageError') },
  };
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    field.el.classList.toggle('invalid', Boolean(message));
    field.errorEl.textContent = message || '';
  }

  function validateField(key) {
    const field = fields[key];
    const value = field.el.value.trim();

    if (key === 'name') {
      if (!value) return setError(field, 'Please enter your name.'), false;
      if (value.length < 2) return setError(field, 'Name looks too short.'), false;
    }
    if (key === 'email') {
      if (!value) return setError(field, 'Please enter your email.'), false;
      if (!EMAIL_REGEX.test(value)) return setError(field, 'Please enter a valid email address.'), false;
    }
    if (key === 'subject') {
      if (!value) return setError(field, 'Please enter a subject.'), false;
    }
    if (key === 'message') {
      if (!value) return setError(field, 'Please write a message.'), false;
      if (value.length < 10) return setError(field, 'Message should be at least 10 characters.'), false;
    }
    setError(field, '');
    return true;
  }

  // Validate on blur for real-time feedback.
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successEl.textContent = '';

    const results = Object.keys(fields).map(key => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) {
      successEl.style.color = 'var(--danger)';
      successEl.textContent = 'Please fix the highlighted fields above.';
      return;
    }

    // Simulate sending (no backend attached — this is a frontend-only demo).
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalHTML;
      successEl.style.color = 'var(--accent-3)';
      successEl.textContent = `Thanks, ${fields.name.el.value.trim()}! Your message has been noted. I'll get back to you soon.`;
      form.reset();
    }, 900);
  });
}

/* --------------------------------------------------------------------
   13. RESUME DOWNLOAD
   Generates a plain-text resume on the fly from the page's own content
   so the button works immediately. Replace this with a direct link to
   a hosted PDF (e.g. href="assets/Anusha_S_Resume.pdf") when ready.
-------------------------------------------------------------------- */
function initResumeDownload() {
  const btn = document.getElementById('downloadResumeBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const resumeText = `ANUSHA S
+91 73495 67447 | anusha.s2028@gmail.com | Mysuru, Karnataka, India

CAREER OBJECTIVE
Motivated and enthusiastic student seeking an internship opportunity to apply
academic knowledge, learn practical skills, and contribute positively to the
organization while gaining real-world experience.

TECHNICAL SKILLS
Programming Languages: Python, C, C++, JavaScript, SQL
Web Technologies: HTML, CSS, JavaScript, React.js
Frameworks: Django
Database: SQL / RDBMS (queries, joins, normalization, DDL, DML, TCL, DCL)
Tools & Platforms: VS Code, Postman, Git, GitHub
Concepts: Data Structures & Algorithms, OOP

EDUCATION
Bachelor of Engineering, Computer Science & Design (2022 - 2026)
Mysore University School of Engineering

Pre-University Course - PCMB (2020 - 2022)
BGS Girls PU College, Mysuru | Board of Intermediate Education

Secondary School - Class X (2019 - 2020)
Presentation Public School, Mysuru | CBSE

INTERNSHIPS & TRAINING
Python Full Stack Development Trainee - QSpiders, Mysuru (Ongoing)
- Learning backend development using Python and Django framework
- Developing front-end skills with HTML, CSS, JavaScript and React.js
- Working on full-stack projects and REST API integration

Application & API Testing Intern - IVIS Labs
- Performed API testing using Postman and learned testing workflows
- Created and executed test cases and bug reports
- Gained knowledge of manual testing and software quality assurance

CERTIFICATIONS
1. Python Full Stack Development - QSpiders
2. Application and API Testing - IVIS Labs
3. C Programming - Vision Computers
4. Computer Applications - Vision Computers

Note: This is an auto-generated plain-text summary from the portfolio site.
Please replace this download with your official formatted resume PDF.`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Anusha_S_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

/* --------------------------------------------------------------------
   14. FOOTER YEAR
-------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
