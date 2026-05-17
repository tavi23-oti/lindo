// timeline_particles.js
// Partículas simples para que el timeline se vea más “vivo”

(function () {
  function ensureStyle() {
    if (document.getElementById('tp-style')) return;
    const s = document.createElement('style');
    s.id = 'tp-style';
    s.textContent = `
      .tp-burst {
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        animation: tpFly 900ms ease-out forwards;
      }
      @keyframes tpFly {
        0% { transform: translate(0,0) scale(1); opacity: 0.95; }
        100% { transform: translate(var(--dx), var(--dy)) scale(0.7); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }

  function burst(x, y, kind) {
    ensureStyle();
    const colors = kind === 'pink'
      ? ['#ff9ec7', '#ffd6e7', '#ff6ea9', '#ffb3d9']
      : ['#c77dff', '#ffd6e7', '#8cffea', '#b69cff'];

    const count = 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'tp-burst';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];

      const dx = (Math.random() - 0.5) * 260;
      const dy = (Math.random() - 0.5) * -220;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');

      const size = 7 + Math.random() * 6;
      p.style.width = size + 'px';
      p.style.height = size + 'px';

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 950);
    }
  }

  function init() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    // Bursts cuando el usuario pasa por encima items
    const items = timeline.querySelectorAll('.timeline-item');
    items.forEach((it) => {
      it.addEventListener('mouseenter', (e) => {
        const r = it.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + 20;
        burst(x, y, (Math.random() > 0.5) ? 'pink' : 'purple');
      });
    });

    // Bursts cuando se hace scroll cerca del timeline
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const r = timeline.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + 25, 'pink');
      });
    }, { threshold: 0.25 });

    obs.observe(timeline);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

