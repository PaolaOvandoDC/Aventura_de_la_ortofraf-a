/* ═══════════════════════════════════════════════════
   LA AVENTURA DE LA ORTOGRAFÍA — MAIN JS
   Cursor trail, games, lightbox, animations, likes
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initFadeInSections();
  initCountUp();
  initLightbox();
  initLikeButtons();
  initGames();
});

/* ── SIDEBAR TOGGLE (mobile) ─────────────────────── */
/* ── SIDEBAR TOGGLE (mobile) ─────────────────────── */
function initSidebar() {
  const btn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  if (!btn || !sidebar) return;

  const open = () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);

  // Close on nav item click (mobile)
  sidebar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', close);
  });
}

/* ── FADE-IN SECTIONS ─────────────────────────────── */
function initFadeInSections() {
  const elements = document.querySelectorAll('.fade-in-section');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── COUNT-UP ANIMATION ──────────────────────────── */
function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1600;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── LIGHTBOX ─────────────────────────────────────── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox) return;

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      img.src = card.dataset.lightbox;
      img.alt = card.dataset.title || '';
      if (title) title.textContent = card.dataset.title || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ── LIKE BUTTONS (localStorage) ─────────────────── */
function initLikeButtons() {
  // Restore liked state from localStorage
  document.querySelectorAll('.like-btn').forEach(btn => {
    const id = btn.id;
    if (localStorage.getItem(id) === 'liked') {
      btn.classList.add('liked');
    }
  });
}

async function toggleLike(type, id, btn) {
  const storageKey = btn.id;
  const alreadyLiked = localStorage.getItem(storageKey) === 'liked';

  if (alreadyLiked) return; // Prevent multi-like

  try {
    const endpoint = type === 'work' ? `/escritor/${id}/like` : `/aprendemos/${id}/like`;
    const res = await fetch(endpoint, { method: 'POST' });
    if (!res.ok) throw new Error('Error');
    const data = await res.json();

    btn.classList.add('liked');
    localStorage.setItem(storageKey, 'liked');

    const countEl = btn.querySelector('.like-count');
    if (countEl) countEl.textContent = data.likes;
  } catch (err) {
    console.error('Like error:', err);
  }
}

/* ══════════════════════════════════════════════════
   MINI-GAMES
══════════════════════════════════════════════════ */

/* ── Error-finding game data ─────────────────────── */
const errorGameData = [
  {
    words: ['El', 'perro', 'coría', 'por', 'el', 'parque', 'feliz'],
    errorIndex: 2,
    correct: 'corría',
    explanation: '"corría" se escribe con doble r entre vocales.'
  },
  {
    words: ['Ella', 'comió', 'una', 'mansana', 'deliciosa'],
    errorIndex: 3,
    correct: 'manzana',
    explanation: '"manzana" se escribe con z antes de n.'
  },
  {
    words: ['Los', 'niños', 'iban', 'a', 'la', 'escuala', 'contentos'],
    errorIndex: 5,
    correct: 'escuela',
    explanation: '"escuela" se escribe con ue, no ua.'
  },
  {
    words: ['Mi', 'abuela', 'prepara', 'un', 'rico', 'caldo', 'calientre'],
    errorIndex: 6,
    correct: 'caliente',
    explanation: '"caliente" termina en -nte, no -ntre.'
  },
  {
    words: ['El', 'maestro', 'explico', 'la', 'lección', 'con', 'paciencia'],
    errorIndex: 2,
    correct: 'explicó',
    explanation: '"explicó" lleva tilde en la última sílaba (pretérito).'
  },
  {
    words: ['Hay', 'que', 'aser', 'la', 'tarea', 'antes', 'de', 'jugar'],
    errorIndex: 2,
    correct: 'hacer',
    explanation: '"hacer" se escribe con h y c, no con s.'
  }
];

/* ── Complete-the-word data ──────────────────────── */
const completeGameData = [
  { display: 'bicicl_ta', answer: 'e', full: 'bicicleta', clue: 'Medio de transporte de dos ruedas' },
  { display: 'girafá', answer: 'jirafa', full: 'jirafa', clue: 'Animal de cuello largo (escribe la palabra completa con j)' },
  { display: 'camin_r', answer: 'a', full: 'caminar', clue: 'Andar a pie' },
  { display: 'escuel_', answer: 'a', full: 'escuela', clue: 'Lugar donde aprendemos' },
  { display: 'coraz_n', answer: 'ó', full: 'corazón', clue: 'Órgano que late en el pecho' },
  { display: 'mú_ica', answer: 's', full: 'música', clue: 'Arte de combinar sonidos' },
  { display: 'p_jaro', answer: 'á', full: 'pájaro', clue: 'Animal que vuela y tiene plumas' },
  { display: 'lapi_', answer: 'z', full: 'lápiz', clue: 'Utensilio para escribir y dibujar' }
];

let errorScore = 0;
let completeScore = 0;
let errorQIndex = 0;
let completeQIndex = 0;
let errorAnswered = false;
let completeAnswered = false;

function openGame(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (id === 'errorGame') {
    errorScore = 0;
    errorQIndex = 0;
    updateErrorScore();
    loadErrorQuestion();
  } else if (id === 'completeGame') {
    completeScore = 0;
    completeQIndex = 0;
    updateCompleteScore();
    loadCompleteQuestion();
  }
}

function closeGame(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['errorGame', 'completeGame'].forEach(id => closeGame(id));
  }
});

/* ── ERROR GAME ──────────────────────────────────── */
function loadErrorQuestion() {
  errorAnswered = false;
  const data = errorGameData[errorQIndex % errorGameData.length];
  const sentence = document.getElementById('errorSentence');
  const feedback = document.getElementById('errorFeedback');
  const nextBtn = document.getElementById('nextErrorBtn');
  if (!sentence) return;

  feedback.textContent = '';
  feedback.className = 'game-feedback';
  nextBtn.style.display = 'none';
  sentence.innerHTML = '';

  data.words.forEach((word, i) => {
    const btn = document.createElement('button');
    btn.textContent = word;
    btn.className = 'word-btn';
    btn.addEventListener('click', () => checkErrorAnswer(i, data, btn));
    sentence.appendChild(btn);
  });
}

function checkErrorAnswer(index, data, btn) {
  if (errorAnswered) return;
  errorAnswered = true;

  const feedback = document.getElementById('errorFeedback');
  const nextBtn = document.getElementById('nextErrorBtn');
  const allBtns = document.querySelectorAll('#errorSentence .word-btn');

  allBtns.forEach(b => b.disabled = true);
  allBtns[data.errorIndex].classList.add('correct');

  if (index === data.errorIndex) {
    errorScore += 10;
    updateErrorScore();
    feedback.textContent = `✅ ¡Correcto! La palabra correcta es "${data.correct}". ${data.explanation}`;
    feedback.className = 'game-feedback feedback-correct';
    launchConfetti();
  } else {
    btn.classList.add('wrong');
    feedback.textContent = `❌ Incorrecto. La palabra con error era "${data.words[data.errorIndex]}" → "${data.correct}". ${data.explanation}`;
    feedback.className = 'game-feedback feedback-wrong';
  }

  errorQIndex++;
  nextBtn.style.display = 'inline-flex';
}

function nextErrorQuestion() {
  document.getElementById('nextErrorBtn').style.display = 'none';
  loadErrorQuestion();
}

function updateErrorScore() {
  const el = document.getElementById('errorScore');
  if (el) el.textContent = errorScore;
}

/* ── COMPLETE WORD GAME ──────────────────────────── */
function loadCompleteQuestion() {
  completeAnswered = false;
  const data = completeGameData[completeQIndex % completeGameData.length];
  const display = document.getElementById('completeWordDisplay');
  const input = document.getElementById('completeInput');
  const feedback = document.getElementById('completeFeedback');
  const nextBtn = document.getElementById('nextCompleteBtn');
  if (!display) return;

  display.textContent = data.display;
  display.title = data.clue;
  input.value = '';
  input.disabled = false;
  input.focus();
  feedback.textContent = `💡 Pista: ${data.clue}`;
  feedback.className = 'game-feedback';
  nextBtn.style.display = 'none';
}

function checkComplete() {
  if (completeAnswered) return;
  const data = completeGameData[completeQIndex % completeGameData.length];
  const input = document.getElementById('completeInput');
  const feedback = document.getElementById('completeFeedback');
  const nextBtn = document.getElementById('nextCompleteBtn');

  const userAnswer = input.value.trim().toLowerCase();
  const expected = data.answer.toLowerCase();

  completeAnswered = true;
  input.disabled = true;

  if (userAnswer === expected) {
    completeScore += 10;
    updateCompleteScore();
    feedback.textContent = `✅ ¡Correcto! La palabra completa es "${data.full}". ¡Excelente!`;
    feedback.className = 'game-feedback feedback-correct';
    launchConfetti('completeGame');
  } else {
    feedback.textContent = `❌ Casi. La respuesta era "${data.answer}". La palabra correcta: "${data.full}"`;
    feedback.className = 'game-feedback feedback-wrong';
  }

  completeQIndex++;
  nextBtn.style.display = 'inline-flex';
}

function nextCompleteQuestion() {
  document.getElementById('nextCompleteBtn').style.display = 'none';
  loadCompleteQuestion();
}

function updateCompleteScore() {
  const el = document.getElementById('completeScore');
  if (el) el.textContent = completeScore;
}

// Allow Enter key to submit complete game
document.addEventListener('keydown', e => {
  const modal = document.getElementById('completeGame');
  if (modal && modal.classList.contains('open') && e.key === 'Enter') {
    checkComplete();
  }
});

/* ── CONFETTI ─────────────────────────────────────── */
function launchConfetti(modalId) {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;

  const pieces = [];
  const colors = ['#8b6ed4','#7ed8b4','#ff7f7f','#ffd166','#74c0fc','#69db7c'];

  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      w: Math.random() * 10 + 4,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      alpha: 1
    });
  }

  let frame = 0;
  function drawConfetti() {
    if (frame > 90) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      if (frame > 60) p.alpha = Math.max(0, p.alpha - 0.04);
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    requestAnimationFrame(drawConfetti);
  }
  drawConfetti();
}

/* ── GAMES INITIALIZATION ────────────────────────── */
function initGames() {
  // Close modal on backdrop click
  document.querySelectorAll('.game-modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeGame(modal.id);
    });
  });
}
