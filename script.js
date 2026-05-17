// ====== FLORES ======
function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.innerHTML = "🌸";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = (Math.random() * 5 + 5) + "s";
  document.body.appendChild(petal);
  setTimeout(() => {
    petal.remove();
  }, 10000);
}
setInterval(createPetal, 500);

// ====== CORAZONES ======
document.addEventListener("mousemove", (e) => {
  const heart = document.createElement("div");
  heart.innerHTML = "💖";
  heart.style.position = "fixed";
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";
  heart.style.pointerEvents = "none";
  heart.style.fontSize = "20px";
  heart.style.animation = "fadeOut 1s forwards";
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 1000);
});

// ====== MENSAJE (cartas) ======
function showMessage(type) {
  const message = document.getElementById("message");
  if (!message) return;

  if (type === 1) {
    message.innerHTML = `
      Tus ojos tienen algo
      que me atrapa muchísimo 💖

      Me encanta tu sonrisa,
      tu boca,
      tu voz,
      tu forma de hablar
      y la tranquilidad
      que transmitís.

      Sos hermosa,
      dulce,
      tierna
      y con una energía
      que sinceramente
      me hace sentir feliz ✨
    `;
  } else if (type === 2) {
    message.innerHTML = `
      Desde que te conocí
      el 5 de mayo,
      mis días se sienten distintos ✨

      Me gusta hablar con vos,
      conocerte,
      compartir momentos
      y descubrir cosas tuyas 🌷
    `;
  } else if (type === 3) {
    message.innerHTML = `
      No sé cómo explicarlo exactamente,
      pero desde que apareciste
      sentí algo muy bonito 💌

      Sos muchas de las cosas
      que siempre soñé encontrar
      en una mujer 💖
    `;
  }

  message.style.display = "block";

  // Si está la galería principal (fotos), ocultarla al mostrar carta.
  const gallery = document.querySelector(".gallery");
  if (gallery) gallery.style.display = "none";
}

// ====== CONTADOR ======
const startDate = new Date("2026-05-05T00:00:00");
function updateCounter() {
  const el = document.getElementById("counter");
  if (!el) return;

  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  el.innerHTML = `${days} días juntos 💖`;
}
updateCounter();

// ====== PLAYER ======
const songs = [
  { name: "Nuestra canción 🌸", path: "assets/music.mp3" },
  { name: "Pensando en vos 💖", path: "assets/music1.mp3" },
  { name: "Momentos lindos ✨", path: "assets/music2.mp3" },
  { name: "Milagros 🍷", path: "assets/music3.mp3" },
  { name: "Forever 🌸", path: "assets/music4.mp3" },
];

let songIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("song-title");
const progress = document.getElementById("progress");

function loadSong() {
  if (!audio || !title) return;
  audio.src = songs[songIndex].path;
  title.innerHTML = songs[songIndex].name;
}

function playPause() {
  if (!audio) return;
  if (audio.paused) audio.play();
  else audio.pause();
}

function nextSong() {
  songIndex++;
  if (songIndex >= songs.length) songIndex = 0;
  loadSong();
  audio?.play();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  loadSong();
  audio?.play();
}

// ====== CONTINUIDAD ENTRE PÁGINAS (localStorage) ======
const MUSIC_KEY = "sorpresa_music_state_v1";

function saveMusicState() {
  if (!audio) return;
  try {
    const state = {
      songIndex,
      currentTime: audio.currentTime || 0,
      isPlaying: !audio.paused && !audio.ended,
    };
    localStorage.setItem(MUSIC_KEY, JSON.stringify(state));
  } catch (_) {
    // ignore
  }
}

function restoreMusicState() {
  if (!audio) return false;
  try {
    const raw = localStorage.getItem(MUSIC_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);

    if (Number.isFinite(state.songIndex)) {
      songIndex = state.songIndex;
      loadSong();
    }

    const t = Number(state.currentTime);
    if (Number.isFinite(t)) {
      // Esperar a que el audio cargue metadata para poder setear currentTime
      const setTime = () => {
        audio.currentTime = Math.max(0, t);
      };

      if (audio.readyState >= 1) setTime();
      else audio.addEventListener("loadedmetadata", setTime, { once: true });
    }

    const shouldPlay = !!state.isPlaying;
    if (shouldPlay) audio.play().catch(() => {});

    return true;
  } catch (_) {
    return false;
  }
}

const prevBtn = document.getElementById("prev-btn");
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");

prevBtn?.addEventListener("click", prevSong);
playBtn?.addEventListener("click", playPause);
nextBtn?.addEventListener("click", nextSong);

audio?.addEventListener("timeupdate", () => {
  if (!progress || !audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress?.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
  saveMusicState();
});

// Cambio automático al terminar
audio?.addEventListener("ended", () => {
  // Avanza siempre; al terminar, audio ended implica que reproduce la siguiente.
  nextSong();
  saveMusicState();
});

loadSong();
restoreMusicState();

// Guardar estado cuando salís / cambias de página
window.addEventListener("beforeunload", saveMusicState);

// También guardarlo si pausa/reproduce manualmente
audio?.addEventListener("play", saveMusicState);
audio?.addEventListener("pause", saveMusicState);

// Mantener el estado cuando se cierra la pestaña o se cambia de página
window.addEventListener("pagehide", saveMusicState);

// ====== CONFETTI ======
function burstConfetti(x, y) {
  const colors = ["#ff9ec7", "#c77dff", "#ffd6e7", "#ff6ea9", "#8cffea"];
  const count = 28;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.left = x + "px";
    piece.style.top = y + "px";
    piece.style.width = Math.random() * 10 + 6 + "px";
    piece.style.height = Math.random() * 10 + 6 + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? "2px" : "50%";
    piece.style.opacity = "0.95";
    piece.style.zIndex = 9999;
    piece.style.pointerEvents = "none";

    const dx = (Math.random() - 0.5) * 220;
    const dy = (Math.random() - 0.7) * 220;
    const rot = Math.random() * 720;

    piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", filter: "brightness(1)" },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, filter: "brightness(1.2)" },
      ],
      {
        duration: 900 + Math.random() * 400,
        easing: "cubic-bezier(.2,.9,.2,1)",
        fill: "forwards",
      }
    );

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 1400);
  }
}

// ====== BOTONES CARTAS ======
document.querySelectorAll(".card-btn[data-msg]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const msgType = Number(btn.getAttribute("data-msg"));
    if (!Number.isFinite(msgType)) return;

    // Confetti en el centro del botón
    const rect = btn.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + 10);

    showMessage(msgType);
  });
});


// ====== VER FOTOS ESPECIALES ======
const verFotosBtn = document.getElementById("ver-fotos");
verFotosBtn?.addEventListener("click", () => {
  // Guardar estado antes de cambiar de página
  saveMusicState();
  window.location.href = "sorpresa.html";
});

const volverBtn = document.getElementById("volver");
volverBtn?.addEventListener("click", () => {
  // Volver a la pantalla principal
  window.location.href = "index.html";
});


// ====== TEMA (Rosa / Violeta) ======
const themePink = document.getElementById("theme-pink");
const themePurple = document.getElementById("theme-purple");

function setTheme(theme) {
  document.body.classList.remove("theme-pink", "theme-purple");
  if (theme) document.body.classList.add(theme);
}

themePink?.addEventListener("click", () => setTheme("theme-pink"));
themePurple?.addEventListener("click", () => setTheme("theme-purple"));


