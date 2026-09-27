/* ============================================
   CV Retro OS — main.js
   Pinta las ventanas desde data.js (CV) y gestiona
   tema, menús, sonidos, tecleo, scroll y reloj.
   ============================================ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function getStored(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function store(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

// ─── 1. CONFIGURACIÓN DE TEMAS ──────────────────────────
// Cada tema define el prompt de la terminal y el título de cada ventana.
const THEMES = {
  win95: {
    prompt: "C:\\CV>",
    titles: {
      hero: "MS-DOS Prompt",
      "sobre-mi": "sobre-mi.txt - Bloc de notas",
      experiencia: "Explorando - C:\\Experiencia",
      proyectos: "proyectos.zip - WinZip",
      skills: "Propiedades del sistema",
      educacion: "educacion.doc - WordPad",
      certificaciones: "Microsoft Excel - certificaciones.xls",
    },
  },
  ubuntu: {
    prompt: "daniel@lucid:~$",
    titles: {
      hero: "daniel@lucid: ~",
      "sobre-mi": "sobre-mi.txt (~/cv) - gedit",
      experiencia: "experiencia - Navegador de archivos",
      proyectos: "proyectos.tar.gz - Gestor de archivadores",
      skills: "Gestor de paquetes Synaptic",
      educacion: "educacion.odt - OpenOffice.org Writer",
      certificaciones: "certificaciones.ods - OpenOffice.org Calc",
    },
  },
};
const SKINS = Object.keys(THEMES);

// ─── 2. RENDER DE SECCIONES ─────────────────────────────
const { profile, experience, projects, skills, education, certifications } = CV;

const SECTIONS = [
  { id: "sobre-mi", label: "Sobre mí", icon: "📝", render: () =>
    `<p class="mb-0">${profile.about}</p>` },

  { id: "experiencia", label: "Experiencia", icon: "📁", render: () =>
    experience.map((job) => `
      <article class="entry">
        <div class="d-flex flex-wrap justify-content-between">
          <strong class="entry__title">${job.role} · ${job.company}</strong>
          <span class="entry__meta">${job.period}</span>
        </div>
        <ul class="entry__list">${job.achievements.map((a) => `<li>${a}</li>`).join("")}</ul>
      </article>`).join("") },

  { id: "proyectos", label: "Proyectos", icon: "🗜️", render: () =>
    `<div class="row">${projects.map((p) => `
      <div class="col-md-6 mb-3">
        <article class="panel h-100">
          <h3 class="entry__title">${p.name}</h3>
          <p>${p.description}</p>
          <div class="mb-2">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
          ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">Ver código →</a>` : ""}
        </article>
      </div>`).join("")}</div>` },

  { id: "skills", label: "Skills", icon: "⚙️", render: () =>
    Object.entries(skills).map(([group, list]) => `
      <fieldset class="group">
        <legend class="group__title">${group}</legend>
        <ul class="checklist">${list.map((s) => `<li><span class="check" aria-hidden="true">✓</span>${s}</li>`).join("")}</ul>
      </fieldset>`).join("") },

  { id: "educacion", label: "Educación", icon: "🎓", render: () =>
    education.map((e) => `
      <article class="entry">
        <div class="d-flex flex-wrap justify-content-between">
          <strong class="entry__title">${e.degree}</strong>
          <span class="entry__meta">${e.year}</span>
        </div>
        <span>${e.institution}</span>
      </article>`).join("") },

  { id: "certificaciones", label: "Certificaciones", icon: "📊", render: () => {
    let row = 0; // numeración continua, como las filas de una hoja de cálculo
    return `
    <div class="table-responsive">
      <table class="table table-sm sheet mb-0">
        <thead><tr><th></th><th>Curso</th><th>Entidad</th><th>Año</th></tr></thead>
        <tbody>${Object.entries(certifications).map(([group, list]) => `
          <tr class="sheet__group"><th scope="row">${++row}</th><td colspan="3">${group}</td></tr>
          ${list.map((c) => `
          <tr><th scope="row">${++row}</th><td>${c.name}</td><td>${c.issuer}</td><td>${c.year}</td></tr>`).join("")}`).join("")}
        </tbody>
      </table>
    </div>`;
  } },
];

// Ventana genérica: barra de título + menú + contenido
function windowHtml(id, label, body, extraClass = "") {
  const menubar = extraClass ? "" : `
    <div class="window__menubar" aria-hidden="true">
      <span><u>A</u>rchivo</span><span><u>E</u>dición</span><span><u>V</u>er</span><span>Ay<u>u</u>da</span>
    </div>`;
  return `
    <section class="window ${extraClass}" id="${id}" aria-labelledby="${id}-title" data-reveal>
      <header class="window__titlebar">
        <span class="window__title" id="${id}-title"></span>
        <span class="window__controls" aria-hidden="true"><i class="btn-min"></i><i class="btn-max"></i><i class="btn-close"></i></span>
      </header>
      ${menubar}
      <div class="window__body">
        <h2 class="sr-only print-heading">${label}</h2>
        ${body}
      </div>
    </section>`;
}

function heroHtml() {
  const links = [
    `<a href="${profile.github}" target="_blank" rel="noopener">GitHub</a>`,
    `<a href="mailto:${profile.email}">${profile.email}</a>`,
    profile.linkedin && `<a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`,
  ].filter(Boolean).join(" · ");

  return windowHtml("hero", "Cabecera", `
    <p class="term-line"><span class="prompt"></span> <span id="typing">whoami</span><span class="cursor" aria-hidden="true"></span></p>
    <h1 class="hero__name">${profile.name}</h1>
    <p class="hero__role">${profile.role}</p>
    <p class="hero__tagline" id="tagline">${profile.tagline}</p>
    <p class="hero__links mb-0">${links}</p>`, "window--terminal");
}

// Menús: apps = secciones, places = enlaces, system = acciones
function menuHtml(group) {
  const item = (href, text, attrs = "") => `<a class="dropdown-item" href="${href}" ${attrs}>${text}</a>`;
  const groups = {
    apps: [item("#hero", "💻 Terminal"), ...SECTIONS.map((s) => item(`#${s.id}`, `${s.icon} ${s.label}`))],
    places: [
      item(profile.github, "🌐 GitHub", 'target="_blank" rel="noopener"'),
      item(`mailto:${profile.email}`, "✉️ Email"),
      profile.linkedin && item(profile.linkedin, "💼 LinkedIn", 'target="_blank" rel="noopener"'),
    ].filter(Boolean),
    system: [
      item("#", "🎨 Cambiar tema", 'data-action="skin"'),
      item("#", "🖨️ Guardar como PDF", 'data-action="print"'),
    ],
  };
  return group.split(" ").map((g) => groups[g].join("")).join('<div class="dropdown-divider"></div>');
}

function render() {
  $("#desktop").innerHTML = heroHtml() + SECTIONS.map((s) => windowHtml(s.id, s.label, s.render())).join("");
  $$("[data-menu]").forEach((el) => { el.innerHTML = menuHtml(el.dataset.menu); });
}

// ─── 3. TEMA ────────────────────────────────────────────
function applySkin(name) {
  const theme = THEMES[name];
  document.documentElement.dataset.skin = name;
  Object.entries(theme.titles).forEach(([id, title]) => { $(`#${id}-title`).textContent = title; });
  $(".prompt").textContent = theme.prompt;
  store("cv-skin", name);
  updateClock();
}

function nextSkin() {
  const current = document.documentElement.dataset.skin;
  applySkin(SKINS[(SKINS.indexOf(current) + 1) % SKINS.length]);
  sounds.skin();
}

// ─── 4. SONIDOS (Web Audio API) ─────────────────────────
let audioCtx;
let muted = getStored("cv-muted", "false") === "true";

function playTone(freq, duration, type = "square", vol = 0.06) {
  if (muted) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {}
}

const sounds = {
  click: () => playTone(800, 0.05),
  hover: () => playTone(600, 0.03, "sine", 0.03),
  type: () => playTone(900 + Math.random() * 200, 0.02, "square", 0.02),
  skin: () => [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.1), i * 80)),
};

function setMuted(value) {
  muted = value;
  store("cv-muted", value);
  const btn = $("#mute-btn");
  btn.classList.toggle("is-muted", value);
  btn.setAttribute("aria-pressed", value);
  btn.setAttribute("aria-label", value ? "Activar sonidos" : "Silenciar sonidos");
}

// ─── 5. EFECTO DE TECLEO ────────────────────────────────
function typeText(el, text, speed) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      el.textContent += text[i++];
      sounds.type();
      if (i >= text.length) { clearInterval(timer); resolve(); }
    }, speed);
  });
}

async function runTyping() {
  await typeText($("#typing"), "whoami", 80);
  await new Promise((r) => setTimeout(r, 400));
  await typeText($("#tagline"), profile.tagline, 30);
}

// ─── 6. APARICIÓN AL HACER SCROLL ───────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  $$("[data-reveal]").forEach((el) => observer.observe(el));
}

// ─── 7. RELOJ ───────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  const day = now.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  $("#clock").textContent = document.documentElement.dataset.skin === "ubuntu" ? `${day}, ${time}` : time;
}

// ─── 8. EVENTOS ─────────────────────────────────────────
function bindEvents() {
  // Acciones del menú Sistema
  document.addEventListener("click", (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action) e.preventDefault();
    if (action === "skin") nextSkin();
    if (action === "print") window.print();
    if (e.target.closest("a, button")) sounds.click();
  });

  // Hover: suena una vez al entrar en un enlace o botón (no en sus hijos)
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest("a, button");
    if (el && !el.contains(e.relatedTarget)) sounds.hover();
  });

  $("#mute-btn").addEventListener("click", () => setMuted(!muted));

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "T") { e.preventDefault(); nextSkin(); }
  });
}

// ─── INICIO ─────────────────────────────────────────────
function init() {
  render();
  applySkin(SKINS.includes(document.documentElement.dataset.skin) ? document.documentElement.dataset.skin : "win95");
  setMuted(muted);
  bindEvents();
  setInterval(updateClock, 30000);

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$("[data-reveal]").forEach((el) => el.classList.add("visible"));
  } else {
    initScrollReveal();
    runTyping();
  }
}

init();
