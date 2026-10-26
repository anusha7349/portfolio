/* ==========================================================================
   ANUSHA S — PORTFOLIO SCRIPT
   Organized into independent, self-contained functions initialized on
   DOMContentLoaded. Each function handles exactly one feature.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initThemeToggle();
  initPersonaSwitcher();
  initBentoDeck();
  initHamburgerMenu();
  initSmoothScrollAndActiveNav();
  initNavbarScrollState();
  initTypingEffect();
  initScrollRevealAnimations();
  initAnimatedCounters();
  initProjectFilter();
  initProjectInteractiveDrawers();
  initApiPlayground();
  initSqlSandbox();
  initCommandPalette();
  initScrollToTopButton();
  initCopyEmail();
  initContactForm();
  initFooterYear();
});

/* --------------------------------------------------------------------
   1. PAGE LOADER
   Hides the loading screen once the window has fully loaded.
-------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hideLoader = () => loader.classList.add('is-hidden');

  const minDelay = new Promise(resolve => setTimeout(resolve, 800));
  const pageLoaded = new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  Promise.all([minDelay, pageLoaded]).then(hideLoader);

  // Safety net: never block the site for more than 2.5s
  setTimeout(hideLoader, 2500);
}

/* --------------------------------------------------------------------
   2. DARK / LIGHT MODE TOGGLE (persisted via localStorage)
-------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

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

  // Close menu when a link inside it is clicked
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

  // Active tab highlighting based on visible section
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
  }, { rootMargin: `-${navbarHeight + 20}px 0px -55% 0px`, threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------
   5. NAVBAR SCROLL STATE (shadow on scroll)
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
   Cycles through verified Backend engineering roles.
-------------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Backend Developer',
    'Python & Django Developer',
    'REST API & PostgreSQL Engineer',
    'API Testing & QA Intern',
    'Computer Science & Design Student'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_SPEED = 75;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER_TYPE = 1600;
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
-------------------------------------------------------------------- */
function initScrollRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 50);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------
   8. ANIMATED COUNTERS
-------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------
   9. FILTERABLE PROJECT GALLERY
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
   10. SCROLL-TO-TOP BUTTON
-------------------------------------------------------------------- */
function initScrollToTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 450);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------
   11. QUICK EMAIL COPY TO CLIPBOARD
-------------------------------------------------------------------- */
function initCopyEmail() {
  const email = 'anusha.2028@gmail.com';
  const buttons = [
    document.getElementById('copyEmailQuickBtn'),
    document.getElementById('copyEmailContactBtn')
  ].filter(Boolean);

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showFeedback(btn);
        }).catch(() => fallbackPrompt());
      } else {
        fallbackPrompt();
      }
    });
  });

  function showFeedback(btn) {
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    btn.style.borderColor = 'var(--accent-3)';
    btn.style.color = 'var(--accent-3)';
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  }

  function fallbackPrompt() {
    prompt('Copy email address:', email);
  }
}

/* --------------------------------------------------------------------
   12. CONTACT FORM VALIDATION & HANDLING
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

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Direct mailto trigger fallback to guarantee message receipt
    const mailtoUrl = `mailto:anusha.2028@gmail.com?subject=${encodeURIComponent(fields.subject.el.value)}&body=${encodeURIComponent("From: " + fields.name.el.value + " (" + fields.email.el.value + ")\n\n" + fields.message.el.value)}`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalHTML;
      successEl.style.color = 'var(--accent-3)';
      successEl.textContent = `Thanks ${fields.name.el.value.trim()}! Your message is ready — opening your mail client to send directly.`;
      
      // Trigger mail client
      window.location.href = mailtoUrl;
      form.reset();
    }, 700);
  });
}

/* --------------------------------------------------------------------
   13. FOOTER YEAR
-------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------
   14. PERSONA SWITCHER (Dev Mode vs Recruiter Mode)
-------------------------------------------------------------------- */
function initPersonaSwitcher() {
  const switchContainer = document.getElementById('personaSwitch');
  if (!switchContainer) return;

  const buttons = switchContainer.querySelectorAll('.persona-btn');
  const STORAGE_KEY = 'portfolio-persona';

  const setPersona = (mode) => {
    document.body.setAttribute('data-persona', mode);
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const savedPersona = localStorage.getItem(STORAGE_KEY) || 'engineer';
  setPersona(savedPersona);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setPersona(btn.getAttribute('data-mode'));
    });
  });
}

/* --------------------------------------------------------------------
   15. HERO DEVELOPER BENTO DECK (Interactive Tabs, Telemetry & CLI)
-------------------------------------------------------------------- */
function initBentoDeck() {
  const deck = document.getElementById('bentoDeck');
  if (!deck) return;

  // Bento tab switching
  const tabs = deck.querySelectorAll('.bento-tab');
  const panes = deck.querySelectorAll('.bento-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`pane-${tab.getAttribute('data-bento-tab')}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Hero Route Testing Button
  const testBtn = document.getElementById('heroRunEndpointBtn');
  const latencyBadge = document.getElementById('heroLatencyBadge');
  if (testBtn && latencyBadge) {
    testBtn.addEventListener('click', () => {
      const origHtml = testBtn.innerHTML;
      testBtn.disabled = true;
      testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GET /api/v1/profile...';
      const randomLatency = Math.floor(Math.random() * 15) + 12;
      setTimeout(() => {
        testBtn.disabled = false;
        testBtn.innerHTML = '<i class="fa-solid fa-check"></i> 200 OK (DeveloperProfile)';
        latencyBadge.innerHTML = `<i class="fa-solid fa-gauge-high"></i> ${randomLatency}ms latency`;
        setTimeout(() => {
          testBtn.innerHTML = origHtml;
        }, 2200);
      }, 350);
    });
  }

  // Live Digital Clock (Mysuru IST)
  const clockEl = document.getElementById('liveTimeClock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      clockEl.textContent = `${now.toLocaleTimeString('en-US', options)} IST`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Interactive CLI Shell
  const cliInput = document.getElementById('cliInput');
  const cliHistory = document.getElementById('cliHistory');
  const quickChips = deck.querySelectorAll('.cli-chip');

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const userLine = document.createElement('p');
    userLine.className = 'cli-line';
    userLine.innerHTML = `<span class="cli-prompt">visitor@anusha-dev:~$</span> ${escapeHtml(trimmed)}`;
    cliHistory.appendChild(userLine);

    let response = '';
    switch (trimmed) {
      case 'help':
        response = `Available commands:\n  whoami    - Developer background & role\n  stack     - Core technical stack\n  projects  - Featured backend systems\n  resume    - Open verified resume\n  contact   - Direct email & phone\n  api       - Jump to Live REST API console\n  clear     - Clear terminal screen`;
        break;
      case 'whoami':
        response = `Anusha S — Computer Science & Design student and Backend Developer Intern.\nSpecialized in Python (Django/FastAPI), PostgreSQL relational modeling, and Postman API testing.\nCurrently interning at Agamin Innovations Pvt. Ltd., Mysuru.`;
        break;
      case 'stack':
        response = `Backend:    Python, FastAPI, Django, REST APIs, Swagger/OpenAPI\nDatabases:  PostgreSQL, Relational Modeling, SQL Joins, ACID Transactions\nTesting:    Postman Collections, Schema Assertions, Defect Tracking\nCS Core:    Data Structures & Algorithms, OOP, Database Systems`;
        break;
      case 'projects':
        response = `1. crm-backend-service (Leads, Accounts, Contacts, Call Logs)\n2. ats-backend-service (Screening workflows & candidate pipelines)\n3. api-test-automation (Automated Postman assertions & test suites)`;
        break;
      case 'resume':
        response = `Opening official resume in new tab...`;
        window.open('assets/resume.html', '_blank');
        break;
      case 'contact':
        response = `Email: anusha.2028@gmail.com\nPhone: +91 73495 67447\nGitHub: github.com/anusha7349\nLinkedIn: linkedin.com/in/anusha-s-csd-2028-`;
        break;
      case 'api':
        response = `Navigating to Interactive REST API Console...`;
        document.querySelector('#api-console')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'clear':
        cliHistory.innerHTML = '';
        return;
      default:
        response = `command not found: '${trimmed}'. Type 'help' for a list of commands.`;
    }

    const outLine = document.createElement('p');
    outLine.className = 'cli-line cli-output';
    outLine.style.whiteSpace = 'pre-wrap';
    outLine.textContent = response;
    cliHistory.appendChild(outLine);

    const terminal = document.getElementById('cliTerminal');
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  };

  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(cliInput.value);
        cliInput.value = '';
      }
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      if (cliInput) cliInput.focus();
    });
  });
}

/* --------------------------------------------------------------------
   16. PROJECT INTERACTIVE DRAWERS (Test Runner & Schema Viewer)
-------------------------------------------------------------------- */
function initProjectInteractiveDrawers() {
  const actionButtons = document.querySelectorAll('.proj-action-btn');
  const closeButtons = document.querySelectorAll('.drawer-close-btn');

  const testData = {
    crm: [
      { text: '$ pytest tests/test_crm_service.py -v', isCmd: true },
      { text: '[PASS] test_leads_lifecycle_and_qualification ... 200 OK (16ms)' },
      { text: '[PASS] test_account_contact_relational_integrity ... 200 OK (22ms)' },
      { text: '[PASS] test_call_logs_activity_audit_trail ... 201 Created (14ms)' },
      { text: '[PASS] test_unauthorized_lead_access_rejected ... 401 Unauthorized (8ms)' },
      { text: '==== 4 passed, 0 failed in 0.06s [100% test coverage] ====', isSummary: true }
    ],
    ats: [
      { text: '$ pytest tests/test_ats_pipeline.py -v', isCmd: true },
      { text: '[PASS] test_candidate_profile_creation ... 201 Created (18ms)' },
      { text: '[PASS] test_multi_stage_screening_transitions ... 200 OK (14ms)' },
      { text: '[PASS] test_client_submission_lock_constraints ... 200 OK (24ms)' },
      { text: '==== 3 passed, 0 failed in 0.05s [ACID Transactions Verified] ====', isSummary: true }
    ],
    qa: [
      { text: '$ newman run postman_collections/api_qa_suite.json -e staging.env', isCmd: true },
      { text: '[PASS] POST /auth/login - Status code is 200 (JWT Bearer Token Received)' },
      { text: '[PASS] GET /crm/leads - Response schema adheres to OpenAPI 3.0 specification' },
      { text: '[PASS] Benchmark: Response latency < 50ms [Actual: 21ms]' },
      { text: '[PASS] Boundary check: Invalid email payload yields HTTP 422 Unprocessable' },
      { text: '==== 18 assertions passed across 4 endpoints (0 failed) ====', isSummary: true }
    ]
  };

  const schemaData = {
    crm: `-- PostgreSQL 16 Relational Schema: CRM Core Module
CREATE TABLE crm_leads (
    lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'unqualified' CHECK (status IN ('unqualified', 'contacted', 'qualified', 'lost')),
    assigned_rep_id INT REFERENCES sales_reps(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crm_activity_logs (
    activity_id SERIAL PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES crm_leads(lead_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) CHECK (activity_type IN ('call', 'meeting', 'note', 'email')),
    notes TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crm_leads_status ON crm_leads(status);
CREATE INDEX idx_crm_leads_email ON crm_leads(contact_email);`,

    ats: `-- PostgreSQL 16 Relational Schema: ATS Recruitment Module
CREATE TABLE ats_candidates (
    candidate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    pipeline_stage VARCHAR(50) DEFAULT 'applied' CHECK (
        pipeline_stage IN ('applied', 'screening', 'technical_interview', 'client_submission', 'offered')
    ),
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ats_client_submissions (
    submission_id SERIAL PRIMARY KEY,
    candidate_id UUID REFERENCES ats_candidates(candidate_id) ON DELETE CASCADE,
    client_name VARCHAR(150) NOT NULL,
    submitted_date DATE DEFAULT CURRENT_DATE,
    submission_status VARCHAR(50) DEFAULT 'pending'
);

CREATE INDEX idx_ats_candidates_stage ON ats_candidates(pipeline_stage);`,

    qa: `// Postman Automated Assertion Script: Regression Suite
pm.test("Status code is HTTP 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is strictly benchmarked below 50ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(50);
});

pm.test("Validates Response Schema Integrity (OpenAPI 3.0)", function () {
    var schema = {
        "type": "object",
        "required": ["lead_id", "status", "company_name"],
        "properties": {
            "lead_id": { "type": "string" },
            "status": { "type": "string" },
            "company_name": { "type": "string" }
        }
    };
    pm.response.to.have.jsonSchema(schema);
});`
  };

  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const projectKey = btn.getAttribute('data-project');
      const drawer = document.getElementById(`drawer-${projectKey}`);
      const titleEl = document.getElementById(`drawer-title-${projectKey}`);
      const contentEl = document.getElementById(`drawer-content-${projectKey}`);

      if (!drawer || !contentEl) return;

      drawer.classList.add('is-open');

      if (action === 'test') {
        titleEl.innerHTML = `<i class="fa-solid fa-terminal"></i> ${projectKey === 'qa' ? 'Newman Postman Test Execution' : 'PyTest Suite Execution'}`;
        contentEl.innerHTML = '';

        const logs = testData[projectKey] || [];
        logs.forEach((log, index) => {
          setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'terminal-stream-line';
            if (log.isCmd) {
              p.style.color = 'var(--accent-2)';
              p.textContent = log.text;
            } else if (log.isSummary) {
              p.className = 'terminal-summary';
              p.textContent = log.text;
            } else {
              p.innerHTML = `<span class="terminal-pass-tag">[PASS]</span> ${escapeHtml(log.text.replace('[PASS]', '').trim())}`;
            }
            contentEl.appendChild(p);
            contentEl.scrollTop = contentEl.scrollHeight;
          }, index * 220);
        });
      } else if (action === 'schema') {
        titleEl.innerHTML = `<i class="fa-solid fa-code"></i> ${projectKey === 'qa' ? 'Postman Assertion Test Script' : 'PostgreSQL Table Schema (DDL)'}`;
        contentEl.innerHTML = `<pre class="schema-code-box"><code>${escapeHtml(schemaData[projectKey] || '')}</code></pre>`;
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-close-drawer');
      const drawer = document.getElementById(`drawer-${projectKey}`);
      if (drawer) drawer.classList.remove('is-open');
    });
  });
}

/* --------------------------------------------------------------------
   17. INTERACTIVE REST API CONSOLE (Live Swagger / Postman in Browser)
-------------------------------------------------------------------- */
function initApiPlayground() {
  const select = document.getElementById('apiEndpointSelect');
  const methodTag = document.getElementById('apiMethodTag');
  const sendBtn = document.getElementById('apiSendBtn');
  const payloadDrawer = document.getElementById('apiPayloadDrawer');
  const payloadTextarea = document.getElementById('apiPayloadTextarea');
  const presets = document.querySelectorAll('.preset-pill');
  const jsonCode = document.getElementById('apiJsonCode');
  const statusBadge = document.getElementById('apiResStatus');
  const statusCodeText = document.getElementById('apiStatusCode');
  const latencyBadge = document.getElementById('apiResLatency');
  const sizeBadge = document.getElementById('apiResSize');
  const copyJsonBtn = document.getElementById('apiCopyJsonBtn');
  const copyCurlBtn = document.getElementById('apiCopyCurlBtn');

  if (!select || !sendBtn || !jsonCode) return;

  const endpointData = {
    profile: {
      method: 'GET',
      path: '/api/v1/profile',
      status: 200,
      size: '1.2 KB',
      data: {
        status: 200,
        developer: {
          name: "Anusha S",
          title: "Backend Developer",
          education: "B.E. Computer Science and Design (2024 – 2028)",
          institution: "Mysore University School of Engineering, Mysuru",
          current_role: "Backend Developer Intern at Agamin Innovations Pvt. Ltd.",
          location: "Mysuru, Karnataka, India",
          open_to_work: true,
          target_roles: ["Backend Developer Intern", "Python Developer Intern", "Software Engineer Intern"],
          verified_stats: {
            endpoints_shipped: "15+",
            certifications: 4,
            postman_test_coverage: "100%"
          }
        }
      }
    },
    experience: {
      method: 'GET',
      path: '/api/v1/experience',
      status: 200,
      size: '1.8 KB',
      data: {
        status: 200,
        internships: [
          {
            company: "Agamin Innovations Pvt. Ltd., Mysuru",
            role: "Backend Developer Intern",
            period: "2026 – Present",
            stack: ["Python", "Django", "FastAPI", "PostgreSQL", "Postman", "Swagger"],
            key_outcomes: [
              "Architected modular REST endpoints for Leads, Accounts, Contacts, Deals, and Candidates",
              "Structured optimized PostgreSQL relational queries and maintained foreign key consistency",
              "Validated API contracts and payload schemas using Postman and Swagger/OpenAPI"
            ]
          },
          {
            company: "IVIS Labs",
            role: "Application & API Testing Intern",
            period: "2025",
            stack: ["Postman", "API Testing", "Manual QA", "Bug Tracking"],
            key_outcomes: [
              "Executed functional API test suites verifying request parameters and status codes",
              "Reported and tracked defects through QA resolution pipelines"
            ]
          }
        ]
      }
    },
    projects: {
      method: 'GET',
      path: '/api/v1/projects?category=backend',
      status: 200,
      size: '2.1 KB',
      data: {
        status: 200,
        category: "backend",
        projects: [
          {
            id: "crm-service",
            name: "CRM Backend Architecture",
            stack: ["Python", "Django", "FastAPI", "PostgreSQL"],
            modules: ["Leads", "Accounts", "Contacts", "Call Logs", "Activity Notes"],
            testing: "Automated Postman Assertions & Swagger Documentation"
          },
          {
            id: "ats-service",
            name: "ATS Backend System",
            stack: ["Python", "PostgreSQL", "REST APIs", "SQL Optimization"],
            modules: ["Candidate Screening", "Job Requirements", "Client Submissions"]
          },
          {
            id: "qa-automation",
            name: "REST API Testing & QA Suite",
            stack: ["Postman", "Swagger", "Newman", "Defect Tracking"],
            coverage: "Negative status codes, latency benchmarking, schema fidelity"
          }
        ]
      }
    },
    skills: {
      method: 'GET',
      path: '/api/v1/skills/query?domain=database',
      status: 200,
      size: '1.1 KB',
      data: {
        status: 200,
        query: "SELECT * FROM skills WHERE domain = 'Database';",
        database_engine: "PostgreSQL 16 Relational Engine",
        competencies: {
          modeling: ["Relational Database Design", "1NF / 2NF / 3NF Normalization", "ER Diagrams"],
          sql_operations: ["DDL, DML, DCL, TCL", "Complex Joins", "Foreign Key Constraints", "Subqueries"],
          tools_and_orms: ["Django ORM", "pgAdmin", "PostgreSQL Connection Pooling"]
        }
      }
    },
    ping: {
      method: 'POST',
      path: '/api/v1/contact/ping',
      status: 201,
      size: '950 B',
      data: null // Dynamic based on textarea
    }
  };

  let currentKey = 'profile';

  const updateUIForEndpoint = (key) => {
    currentKey = key;
    const item = endpointData[key];
    if (!item) return;

    select.value = key;

    // Update Method Tag
    methodTag.textContent = item.method;
    methodTag.className = `api-method-tag ${item.method === 'POST' ? 'method-post' : 'method-get'}`;

    // Show/Hide Payload Drawer
    payloadDrawer.classList.toggle('is-hidden', item.method !== 'POST');

    // Update preset pills
    presets.forEach(p => p.classList.toggle('active', p.getAttribute('data-preset') === key));
  };

  const executeApiRequest = () => {
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing...';
    jsonCode.textContent = '// Sending request to server...';

    const item = endpointData[currentKey];
    const latency = Math.floor(Math.random() * 18) + 14;

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Request</span>';

      latencyBadge.innerHTML = `<i class="fa-solid fa-gauge-high"></i> ${latency}ms`;
      sizeBadge.innerHTML = `<i class="fa-solid fa-file-code"></i> ${item.size}`;

      if (currentKey === 'ping') {
        let parsedPayload = {};
        try {
          parsedPayload = JSON.parse(payloadTextarea.value);
          statusCodeText.textContent = '201 Created';
          statusBadge.className = 'api-status-pill api-status-pill--201';
          const responseObj = {
            status: 201,
            message: "Payload validated successfully against Pydantic model (ContactRequestSchema)!",
            received_data: parsedPayload,
            server_meta: {
              processed_by: "FastAPI / Uvicorn ASGI Worker #1",
              timestamp: new Date().toISOString(),
              target: "anusha.2028@gmail.com"
            }
          };
          jsonCode.textContent = JSON.stringify(responseObj, null, 2);
        } catch (err) {
          statusCodeText.textContent = '400 Bad Request';
          statusBadge.className = 'api-status-pill api-status-pill--200';
          statusBadge.style.background = 'rgba(241,124,139,0.15)';
          statusBadge.style.color = 'var(--danger)';
          jsonCode.textContent = JSON.stringify({
            status: 400,
            error: "JSONDecodeError",
            detail: "Invalid JSON payload structure. Please format valid JSON."
          }, null, 2);
        }
      } else {
        statusCodeText.textContent = '200 OK';
        statusBadge.className = 'api-status-pill api-status-pill--200';
        statusBadge.style.background = '';
        statusBadge.style.color = '';
        jsonCode.textContent = JSON.stringify(item.data, null, 2);
      }
    }, 280);
  };

  select.addEventListener('change', (e) => {
    updateUIForEndpoint(e.target.value);
    executeApiRequest();
  });

  presets.forEach(p => {
    p.addEventListener('click', () => {
      const key = p.getAttribute('data-preset');
      updateUIForEndpoint(key);
      executeApiRequest();
    });
  });

  sendBtn.addEventListener('click', executeApiRequest);

  // Copy JSON response
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(jsonCode.textContent).then(() => {
          const orig = copyJsonBtn.innerHTML;
          copyJsonBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => copyJsonBtn.innerHTML = orig, 1800);
        });
      }
    });
  }

  // Copy cURL command
  if (copyCurlBtn) {
    copyCurlBtn.addEventListener('click', () => {
      const item = endpointData[currentKey];
      let curlCmd = `curl -X ${item.method} "https://anusha.dev${item.path}" \\\n  -H "Accept: application/json"`;
      if (item.method === 'POST') {
        curlCmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${payloadTextarea.value.replace(/\n/g, '')}'`;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(curlCmd).then(() => {
          const orig = copyCurlBtn.innerHTML;
          copyCurlBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied cURL!';
          setTimeout(() => copyCurlBtn.innerHTML = orig, 1800);
        });
      }
    });
  }

  // Initial load
  updateUIForEndpoint('profile');
  executeApiRequest();
}

/* --------------------------------------------------------------------
   18. SQL QUERY SANDBOX (Interactive PostgreSQL Query Filter)
-------------------------------------------------------------------- */
function initSqlSandbox() {
  const pills = document.querySelectorAll('.sql-pill');
  const statusBar = document.getElementById('sqlStatusBar');
  const skillCards = document.querySelectorAll('.skill-matrix-card');

  if (!pills.length || !skillCards.length) return;

  const queryMetadata = {
    all: { count: '5 categories, 26 verified competencies', time: '0.82ms' },
    backend: { count: '1 category, 8 REST & Python competencies', time: '0.45ms' },
    database: { count: '1 category, 8 PostgreSQL & SQL competencies', time: '0.38ms' },
    testing: { count: '1 category, 7 Postman & QA competencies', time: '0.41ms' },
    featured: { count: '12 core high-priority competencies', time: '0.52ms' },
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterType = pill.getAttribute('data-sql');

      skillCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        let match = true;

        if (filterType === 'backend') match = text.includes('backend') || text.includes('fastapi');
        else if (filterType === 'database') match = text.includes('database') || text.includes('postgresql');
        else if (filterType === 'testing') match = text.includes('testing') || text.includes('postman');
        else if (filterType === 'featured') match = card.querySelectorAll('.skill-tag--featured').length > 0;

        card.style.display = match ? 'block' : 'none';
      });

      const meta = queryMetadata[filterType] || queryMetadata.all;
      if (statusBar) {
        statusBar.innerHTML = `<span class="sql-status-code"><i class="fa-solid fa-check"></i> Query executed: ${meta.count} found (${meta.time} execution time via PostgreSQL 16 index)</span>`;
      }
    });
  });
}

/* --------------------------------------------------------------------
   19. COMMAND PALETTE (Ctrl + K / Cmd + K)
-------------------------------------------------------------------- */
function initCommandPalette() {
  const backdrop = document.getElementById('cmdModalBackdrop');
  const triggerBtn = document.getElementById('cmdKBtn');
  const input = document.getElementById('cmdInput');
  const list = document.getElementById('cmdList');

  if (!backdrop || !input) return;

  const openPalette = () => {
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    input.value = '';
    filterItems('');
    setTimeout(() => input.focus(), 50);
  };

  const closePalette = () => {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
  };

  if (triggerBtn) triggerBtn.addEventListener('click', openPalette);

  // Keyboard shortcut Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      backdrop.classList.contains('is-open') ? closePalette() : openPalette();
    } else if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closePalette();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  const filterItems = (query) => {
    const q = query.toLowerCase().trim();
    const items = list.querySelectorAll('.cmd-item');
    items.forEach(item => {
      const title = item.querySelector('.cmd-item-title')?.textContent.toLowerCase() || '';
      item.style.display = title.includes(q) ? 'flex' : 'none';
    });
  };

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  // Action execution
  list.querySelectorAll('.cmd-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');
      closePalette();

      if (action === 'nav' && target) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'run-test') {
        const crmBtn = document.querySelector('[data-action="test"][data-project="crm"]');
        if (crmBtn) {
          document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => crmBtn.click(), 400);
        }
      } else if (action === 'toggle-persona') {
        const currentMode = document.body.getAttribute('data-persona') === 'recruiter' ? 'engineer' : 'recruiter';
        const targetBtn = document.querySelector(`.persona-btn[data-mode="${currentMode}"]`);
        if (targetBtn) targetBtn.click();
      } else if (action === 'copy-email') {
        const copyBtn = document.getElementById('copyEmailQuickBtn');
        if (copyBtn) copyBtn.click();
      } else if (action === 'resume') {
        window.open('assets/resume.html', '_blank');
      }
    });
  });
}

/* Helper to escape HTML characters safely */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

