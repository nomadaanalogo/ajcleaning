/** Movimiento de la home: riel horizontal, cuartos fijos y nombres de zonas a la deriva. */
const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const desktop = window.matchMedia('(min-width: 901px)');

/* ---------- Riel de servicios ---------- */
const rail = document.querySelector<HTMLElement>('[data-rail]');
const track = document.querySelector<HTMLElement>('[data-rail-track]');
let railDistance = 0;

function setupRail() {
  if (!rail || !track) return;
  const pin = motionOk && desktop.matches;
  rail.classList.toggle('rail-pinned', pin);
  if (!pin) {
    rail.style.height = '';
    track.style.transform = '';
    railDistance = 0;
    return;
  }
  railDistance = Math.max(track.scrollWidth - window.innerWidth, 0);
  rail.style.height = `${window.innerHeight + railDistance}px`;
}

/* ---------- Zonas a la deriva ---------- */
const drifts = Array.from(document.querySelectorAll<HTMLElement>('[data-drift]'));

let queued = false;
function frame() {
  queued = false;
  if (rail && track && railDistance) {
    const r = rail.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / railDistance, 0), 1);
    track.style.transform = `translate3d(${-p * railDistance}px, 0, 0)`;
  }
  for (const row of drifts) {
    const r = row.getBoundingClientRect();
    if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
    const dir = Number(row.dataset.drift);
    const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
    row.style.transform = `translate3d(${dir * p * 14}%, 0, 0)`;
  }
}
const request = () => {
  if (!queued) { queued = true; requestAnimationFrame(frame); }
};

setupRail();
frame();
if (motionOk) window.addEventListener('scroll', request, { passive: true });
window.addEventListener('resize', () => { setupRail(); request(); });
window.addEventListener('load', () => { setupRail(); request(); });

/* ---------- Cuartos: la imagen fija cambia según el cuarto visible ---------- */
const rooms = Array.from(document.querySelectorAll<HTMLElement>('[data-room]'));
const arts = Array.from(document.querySelectorAll<HTMLElement>('[data-room-art]'));
const badge = document.querySelector<HTMLElement>('[data-room-badge]');
if (rooms.length) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const i = rooms.indexOf(e.target as HTMLElement);
      rooms.forEach((r, j) => r.classList.toggle('is-on', j === i));
      arts.forEach((a, j) => a.classList.toggle('is-on', j === i));
      if (badge) badge.textContent = `0${i + 1} / 0${rooms.length}`;
    }
  }, { rootMargin: '-45% 0px -45% 0px' });
  rooms.forEach((r) => io.observe(r));
}
