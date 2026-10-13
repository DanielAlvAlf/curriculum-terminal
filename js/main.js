/* ============================================
   CV Retro OS — main.js
   Mejora progresiva: el CV está completo en el HTML.
   Aquí solo se añaden el cambio de tema, el cierre de
   menús, los sonidos, el efecto de tecleo y el reloj.
   ============================================ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStored(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function store(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

// ─── 1. TEMA ────────────────────────────────────────────
// Los títulos de ventana, el prompt y el reloj se adaptan solos con CSS.
const SKINS = ["win95", "ubuntu"];

function nextSkin() {
  const root = document.documentElement;
  const next = SKINS[(SKINS.indexOf(root.dataset.skin) + 1) % SKINS.length];
  root.dataset.skin = next;
  store("cv-skin", next);
  sounds.skin();
}

// ─── 2. MENÚS <details> ─────────────────────────────────
// El atributo name ya deja un solo menú abierto; falta cerrarlos
// al pulsar fuera, al elegir una opción o con Escape.
function closeMenus(target) {
  $$(".menu[open]").forEach((menu) => {
    if (!menu.contains(target) || target.closest(".menu__item")) menu.open = false;
  });
}

function closeMenuOnEscape(e) {
  if (e.key !== "Escape") return;
  const menu = $(".menu[open]");
  if (!menu) return;
  menu.open = false;
  menu.querySelector("summary").focus();
}

// ─── 3. SONIDOS (Web Audio API) ─────────────────────────
// El navegador solo deja arrancar el audio tras un gesto del usuario,
// así que el AudioContext se crea con el primer clic o tecla.
let audioCtx = null;
let muted = getStored("cv-muted", "false") === "true";
const UNLOCK_EVENTS = ["pointerdown", "pointerup", "keydown"];

function unlockAudio() {
  // Un toque en pantalla aún no cuenta como gesto en pointerdown; se espera al pointerup
  if (navigator.userActivation && !navigator.userActivation.isActive) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    return stopUnlocking(); // sin Web Audio no hay sonidos
  }
  audioCtx.resume().then(() => { if (audioCtx.state === "running") stopUnlocking(); }, () => {});
}

function stopUnlocking() {
  UNLOCK_EVENTS.forEach((type) => document.removeEventListener(type, unlockAudio));
}

function playTone(freq, duration, type = "square", vol = 0.06) {
  if (muted || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

const sounds = {
  click: () => playTone(800, 0.05),
  hover: () => playTone(600, 0.03, "sine", 0.03),
  type: () => playTone(900 + Math.random() * 200, 0.02, "square", 0.02),
  skin: () => [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.1), i * 80)),
};

// El icono cambia con CSS según aria-pressed
function setMuted(value) {
  muted = value;
  store("cv-muted", value);
  $("#mute-btn").setAttribute("aria-pressed", value);
}

// ─── 4. EFECTO DE TECLEO ────────────────────────────────
// Reescribe textos que ya están en el HTML: sin JS se ven enteros.
function typeText(el, text, speed) {
  const chars = [...text];
  el.textContent = "";
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      el.textContent += chars.shift();
      sounds.type();
      if (!chars.length) { clearInterval(timer); resolve(); }
    }, speed);
  });
}

async function runTyping() {
  const command = $("#typing");
  const tagline = $("#tagline");
  const text = tagline.textContent;
  tagline.style.minHeight = `${tagline.offsetHeight}px`; // reserva el alto para que no salte lo de debajo
  tagline.textContent = "";
  await typeText(command, command.textContent, 80);
  await wait(400);
  await typeText(tagline, text, 30);
  tagline.style.minHeight = "";
}

// ─── 5. RELOJ ───────────────────────────────────────────
// Se rellenan fecha y hora; el CSS decide qué se ve en cada tema.
function updateClock() {
  const now = new Date();
  $(".os-clock__date").textContent = `${now.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })},`;
  $(".os-clock__time").textContent = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

// Se actualiza justo al cambiar de minuto
function startClock() {
  updateClock();
  setTimeout(startClock, 60000 - (Date.now() % 60000));
}

// ─── 6. EVENTOS ─────────────────────────────────────────
function bindEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, summary")) sounds.click();
    closeMenus(e.target);
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "skin") nextSkin();
    if (action === "print") window.print();
  });

  // Hover: suena una vez al entrar en un enlace o botón (no en sus hijos)
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest("a, button, summary");
    if (el && !el.contains(e.relatedTarget)) sounds.hover();
  });

  document.addEventListener("keydown", closeMenuOnEscape);
  $("#mute-btn").addEventListener("click", () => setMuted(!muted));
  UNLOCK_EVENTS.forEach((type) => document.addEventListener(type, unlockAudio));
}

// ─── INICIO ─────────────────────────────────────────────
function init() {
  setMuted(muted);
  bindEvents();
  startClock();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) runTyping();
}

init();
