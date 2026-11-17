/** Selector de plan y gráfica de la sección de recurrencia. */
import { chartX, chartY, CHART, cleanWeeks, freshness } from '../data/plans';

type Plan = { id: string; interval: number; visits: number; path: string; label: string; caption: string; rate: string };

const panel = document.querySelector<HTMLElement>('[data-rec]');
if (panel) init(panel);

function init(panel: HTMLElement) {
  const section = panel.closest('section')!;
  const plans = JSON.parse(panel.dataset.plans ?? '[]') as Plan[];
  const S = JSON.parse(panel.dataset.strings ?? '{}') as Record<string, string>;
  const q = <T extends Element = HTMLElement>(s: string) => section.querySelector<T>(s)!;
  const line = q<SVGPathElement>('[data-line]');
  const area = q<SVGPathElement>('[data-area]');
  const dots = q<SVGGElement>('[data-dots]');
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-plan]'));
  const year = Array.from(section.querySelectorAll<HTMLElement>('[data-year] i'));
  year.forEach((d, i) => d.style.setProperty('--i', String(i)));

  let current = plans[0];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawIn() {
    if (reduce) return;
    const len = line.getTotalLength();
    line.style.transition = 'none';
    line.style.strokeDasharray = String(len);
    line.style.strokeDashoffset = String(len);
    line.getBoundingClientRect();
    line.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
    line.style.strokeDashoffset = '0';
  }

  function render() {
    line.setAttribute('d', current.path);
    area.setAttribute('d', `${current.path}L${chartX(CHART.weeks)} ${chartY(0)}L${chartX(0)} ${chartY(0)}Z`);
    dots.innerHTML = cleanWeeks(current.interval)
      .map((w) => `<circle class="dot" cx="${chartX(w)}" cy="${chartY(1)}" r="4.5" style="fill:#bfe5df;stroke:#0f3a3d;stroke-width:2"></circle>`)
      .join('');

    q('[data-rec-caption]').textContent = current.caption;
    q('[data-rec-rate]').textContent = current.rate;
    q('[data-rec-visits]').textContent = String(current.visits);
    q('[data-rec-visits-label]').textContent = current.id === 'once' ? S.visit : S.visitsYear;

    const every = current.interval;
    year.forEach((d, i) => d.classList.toggle('on', every > 0 ? i % every === 0 : i === 0));
    drawIn();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      current = plans.find((p) => p.id === tab.dataset.plan) ?? plans[0];
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-checked', String(on));
      });
      render();
    });
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = tabs[(tabs.indexOf(tab) + dir + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  /* ---------- Capa de hover ---------- */
  const chart = q<HTMLElement>('[data-chart]');
  const svg = chart.querySelector('svg')!;
  const cross = q<SVGLineElement>('[data-cross]');
  const cursor = q<SVGCircleElement>('[data-cursor]');
  const tip = q<HTMLElement>('[data-tip]');

  function hover(clientX: number) {
    const r = svg.getBoundingClientRect();
    const sx = ((clientX - r.left) / r.width) * CHART.w;
    const week = Math.max(0, Math.min(CHART.weeks, ((sx - CHART.left) / (CHART.w - CHART.left - CHART.right)) * CHART.weeks));
    const snapped = Math.round(week * 7) / 7;
    const x = chartX(snapped);
    const y = chartY(freshness(snapped, current.interval));
    cross.setAttribute('x1', String(x));
    cross.setAttribute('x2', String(x));
    cross.style.opacity = '1';
    cursor.setAttribute('cx', String(x));
    cursor.setAttribute('cy', String(y));
    cursor.style.opacity = '1';
    const days = Math.round((current.interval > 0 ? snapped % current.interval : snapped) * 7);
    const wk = Math.floor(snapped) + 1;
    tip.hidden = false;
    tip.textContent = `${S.week} ${Math.min(wk, 12)} · ${days === 0 || days === current.interval * 7 ? S.justCleaned : S.daysAfter.replace('{n}', String(days))}`;
    const px = (x / CHART.w) * r.width;
    tip.style.left = `${Math.max(0, Math.min(px - tip.offsetWidth / 2, r.width - tip.offsetWidth))}px`;
  }
  svg.addEventListener('pointermove', (e) => hover(e.clientX));
  svg.addEventListener('pointerleave', () => {
    tip.hidden = true;
    cross.style.opacity = '0';
    cursor.style.opacity = '0';
  });

  // La curva se dibuja la primera vez que entra en pantalla
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { drawIn(); obs.disconnect(); }
  }, { threshold: 0.35 }).observe(chart);
}
