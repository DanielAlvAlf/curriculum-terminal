/* ============================================
   CV Terminal — main.js
   Skins, command palette, scroll reveal, typing
   ============================================ */

import {
  profile,
  experience,
  projects,
  skills,
  education,
  certifications,
} from "./data.js";

// ─── UTILIDADES ──────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function getStored(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

// ─── SKINS ───────────────────────────────────────────────
const root = document.documentElement;
const skinCycle = $("#skin-cycle");
const skinLabel = $("#skin-label");

const skins = ["debian", "debian-light", "win98", "ubuntu", "ubuntu-gtk"];

const skinIcons = {
  "debian": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M5 11c1-3 2.5-5 4-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  "debian-light": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M5 11c1-3 2.5-5 4-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 1.5"/></svg>`,
  "win98": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="5" x2="14" y2="5" stroke="currentColor" stroke-width="1.2"/><rect x="3" y="6" width="3" height="2" fill="currentColor" opacity="0.5"/><rect x="7" y="6" width="3" height="2" fill="currentColor" opacity="0.5"/></svg>`,
  "ubuntu": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="3" r="1.2" fill="currentColor"/><circle cx="3.7" cy="10.5" r="1.2" fill="currentColor"/><circle cx="12.3" cy="10.5" r="1.2" fill="currentColor"/></svg>`,
  "ubuntu-gtk": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="3" r="1.2" fill="currentColor"/><circle cx="3.7" cy="10.5" r="1.2" fill="currentColor"/><circle cx="12.3" cy="10.5" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1" stroke-dasharray="2 1.5"/></svg>`,
};

function applySkin(name) {
  root.dataset.skin = name;
  skinLabel.innerHTML = `${skinIcons[name]} $ theme ${name}`;
  store("cv-skin", name);
}

function initSkin() {
  const stored = getStored("cv-skin", "debian");
  const valid = skins.includes(stored) ? stored : "debian";
  applySkin(valid);
}

skinCycle.addEventListener("click", () => {
  const current = root.dataset.skin || "debian";
  const nextIndex = (skins.indexOf(current) + 1) % skins.length;
  applySkin(skins[nextIndex]);
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "T") {
    e.preventDefault();
    const current = root.dataset.skin || "debian";
    const nextIndex = (skins.indexOf(current) + 1) % skins.length;
    applySkin(skins[nextIndex]);
  }
});

// ─── TYPING EFFECT ──────────────────────────────────────
const typingTarget = $("#typing-target");
const taglineEl = $("#tagline");

function typeText(element, text, speed = 60) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = "";
    const interval = setInterval(() => {
      element.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function runTypingEffect() {
  await typeText(typingTarget, "whoami", 80);
  await new Promise((r) => setTimeout(r, 400));
  await typeText(taglineEl, profile.tagline, 30);
}

// ─── RENDER CONTenido ───────────────────────────────────
function renderAbout() {
  $("#about-text").textContent = profile.about;
}

function renderExperience() {
  const container = $("#experience-list");
  container.innerHTML = experience
    .map(
      (job) => `
    <article class="timeline__item" data-reveal role="listitem">
      <div class="timeline__header">
        <span class="timeline__role">${job.role}</span>
        <span class="timeline__company">${job.company}</span>
        <span class="timeline__period">${job.period}</span>
      </div>
      <ul class="timeline__list">
        ${job.achievements.map((a) => `<li>${a}</li>`).join("")}
      </ul>
    </article>
  `
    )
    .join("");
}

function renderProjects() {
  const container = $("#projects-list");
  container.innerHTML = projects
    .map(
      (p) => `
    <article class="project-card" data-reveal>
      <h3 class="project-card__name">${p.name}</h3>
      <p class="project-card__desc">${p.description}</p>
      <div class="project-card__stack">
        ${p.stack.map((s) => `<span class="project-card__tag">${s}</span>`).join("")}
      </div>
      <p class="project-card__result">${p.result}</p>
    </article>
  `
    )
    .join("");
}

function renderSkills() {
  const container = $("#skills-list");
  const categories = [
    { key: "languages", title: "Lenguajes" },
    { key: "frontend", title: "Frontend" },
    { key: "backend", title: "Backend" },
    { key: "tools", title: "Herramientas" },
  ];
  container.innerHTML = categories
    .map(
      (cat) => `
    <div class="skills-category" data-reveal>
      <h3 class="skills-category__title">${cat.title}</h3>
      <ul class="skills-category__list">
        ${skills[cat.key].map((s) => `<li>${s}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");
}

function renderEducation() {
  const container = $("#education-list");
  container.innerHTML = education
    .map(
      (edu) => `
    <div class="education-item" data-reveal>
      <span class="education-item__degree">${edu.degree}</span>
      <span class="education-item__institution">${edu.institution}</span>
      <span class="education-item__year">${edu.year}</span>
    </div>
  `
    )
    .join("");
}

function renderCertifications() {
  const container = $("#certifications-list");
  container.innerHTML = certifications
    .map(
      (cert) => `
    <div class="certification-item" data-reveal>
      <span class="certification-item__name">${cert.name}</span>
      <span class="certification-item__year">${cert.year}</span>
    </div>
  `
    )
    .join("");
}

// ─── SCROLL REVEAL ──────────────────────────────────────
function initScrollReveal() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) {
    $$("[data-reveal]").forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  $$("[data-reveal]").forEach((el) => observer.observe(el));
}

// ─── COMMAND PALETTE ────────────────────────────────────
const paletteOverlay = $("#palette-overlay");
const paletteInput = $("#palette-input");
const paletteResults = $("#palette-results");
const paletteOpenBtn = $("#palette-open");

const sections = [
  { id: "hero", label: "Cabecera", prompt: "$ whoami" },
  { id: "sobre-mi", label: "Sobre mí", prompt: "$ cat about.md" },
  { id: "experiencia", label: "Experiencia", prompt: "$ ls experience/" },
  { id: "proyectos", label: "Proyectos", prompt: "$ ls projects/" },
  { id: "skills", label: "Skills", prompt: "$ cat skills.json" },
  { id: "educacion", label: "Educación", prompt: "$ cat education.log" },
  { id: "certificaciones", label: "Certificaciones", prompt: "$ cat certifications.log" },
];

let paletteActiveIndex = 0;

function openPalette() {
  paletteOverlay.classList.add("open");
  paletteOverlay.setAttribute("aria-hidden", "false");
  paletteInput.value = "";
  paletteActiveIndex = 0;
  renderPaletteResults(sections);
  paletteInput.focus();
}

function closePalette() {
  paletteOverlay.classList.remove("open");
  paletteOverlay.setAttribute("aria-hidden", "true");
  paletteInput.value = "";
}

function renderPaletteResults(items) {
  paletteResults.innerHTML = items
    .map(
      (s, i) => `
    <li data-index="${i}" data-id="${s.id}" role="option"
        class="${i === paletteActiveIndex ? "active" : ""}">
      <span class="palette-results__prompt">${s.prompt}</span>
      ${s.label}
    </li>
  `
    )
    .join("");
}

function filterPalette(query) {
  const q = query.toLowerCase().trim();
  if (!q) return sections;
  return sections.filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.prompt.toLowerCase().includes(q)
  );
}

function navigatePalette(direction) {
  const items = $$(".palette-results li");
  if (!items.length) return;
  items[paletteActiveIndex]?.classList.remove("active");
  paletteActiveIndex =
    (paletteActiveIndex + direction + items.length) % items.length;
  items[paletteActiveIndex]?.classList.add("active");
  items[paletteActiveIndex]?.scrollIntoView({ block: "nearest" });
}

function selectPaletteItem() {
  const items = $$(".palette-results li");
  const selected = items[paletteActiveIndex];
  if (!selected) return;
  const id = selected.dataset.id;
  const section = $(`#${id}`);
  closePalette();
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

paletteOpenBtn.addEventListener("click", openPalette);

paletteOverlay.addEventListener("click", (e) => {
  if (e.target === paletteOverlay) closePalette();
});

paletteInput.addEventListener("input", () => {
  const filtered = filterPalette(paletteInput.value);
  paletteActiveIndex = 0;
  renderPaletteResults(filtered);
});

paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    navigatePalette(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    navigatePalette(-1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    selectPaletteItem();
  } else if (e.key === "Escape") {
    closePalette();
  }
});

paletteResults.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  paletteActiveIndex = parseInt(li.dataset.index, 10);
  selectPaletteItem();
});

// Atajo Ctrl+K / Cmd+K
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    if (paletteOverlay.classList.contains("open")) {
      closePalette();
    } else {
      openPalette();
    }
  }
  if (e.key === "Escape" && paletteOverlay.classList.contains("open")) {
    closePalette();
  }
});

// ─── PRINT / PDF ────────────────────────────────────────
$("#print-btn").addEventListener("click", () => {
  window.print();
});

// ─── INIT ───────────────────────────────────────────────
function init() {
  initSkin();
  renderAbout();
  renderExperience();
  renderProjects();
  renderSkills();
  renderEducation();
  renderCertifications();

  // Scroll reveal después de renderizar
  requestAnimationFrame(() => {
    initScrollReveal();
  });

  // Typing effect
  runTypingEffect();
}

init();
