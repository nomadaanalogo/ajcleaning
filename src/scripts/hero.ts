/**
 * El gancho del hero: la pantalla llega con polvo y el usuario la limpia.
 * - Cursor o dedo: borra el polvo y suelta destellos.
 * - Scroll: pasa solo, para que nadie se quede sin ver la sala limpia.
 * - Al seguir bajando: la cámara entra por la ventana hacia la siguiente sección.
 * El texto y la sala ya vienen en el HTML; esto solo agrega la capa interactiva.
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const track = document.querySelector<HTMLElement>('[data-hero-track]');
const hero = document.querySelector<HTMLElement>('[data-hero]');

if (track && hero && !reduce) init(track, hero);

function init(track: HTMLElement, hero: HTMLElement) {
  const q = <T extends Element>(s: string) => hero.querySelector<T>(s)!;
  const canvas = q<HTMLCanvasElement>('[data-grime]');
  const sparkCanvas = q<HTMLCanvasElement>('[data-sparks]');
  const stage = q<HTMLElement>('[data-stage]');
  const copy = q<HTMLElement>('[data-copy]');
  const dissolve = q<HTMLElement>('[data-dissolve]');
  const sub = q<HTMLElement>('[data-sub]');
  const meter = q<HTMLElement>('[data-meter]');
  const pct = q<HTMLElement>('[data-pct]');
  const cloth = q<HTMLElement>('[data-cloth]');
  const ctx = canvas.getContext('2d')!;
  const sctx = sparkCanvas.getContext('2d')!;

  const CLEAN_AT = 0.45; // parte de la pantalla frotada para terminar
  const SWIPES = 1.9; // o recorrido equivalente a este número de pantallas de ancho: 2 o 3 deslizadas
  const COLS = 26;
  const ROWS = 15;
  const WIPE_END = 0.55; // parte del tramo de scroll que limpia sola

  let w = 0;
  let h = 0;
  let dpr = 1;
  let brush = 70;
  let grid = new Uint8Array(COLS * ROWS);
  let rubbed = 0;
  let traveled = 0;
  let done = false;
  let painted = false;
  let last: { x: number; y: number } | null = null;
  let demoRunning = false;
  let userTouched = false;

  /* ---------- Polvo ---------- */
  function seeded(seed: number) {
    return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function paintGrime() {
    const rnd = seeded(20261105);

    // Manchas y marcas de trapo: son borrosas, así que se pintan a un cuarto
    // de resolución y se escalan. Es mucho más rápido que pintarlas a tamaño real.
    const low = document.createElement('canvas');
    low.width = Math.ceil(w / 4);
    low.height = Math.ceil(h / 4);
    const l = low.getContext('2d')!;
    l.scale(0.25, 0.25);
    l.fillStyle = '#c6b9a8';
    l.fillRect(0, 0, w, h);

    // Tonos claros y oscuros, sin bajar del contraste del texto
    for (let i = 0; i < 40; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const r = (0.08 + rnd() * 0.24) * Math.max(w, h);
      const c = rnd() > 0.5 ? '163,146,126' : '222,211,196';
      const g = l.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${c},${0.1 + rnd() * 0.22})`);
      g.addColorStop(1, `rgba(${c},0)`);
      l.fillStyle = g;
      l.fillRect(x - r, y - r, r * 2, r * 2);
    }
    l.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const len = 90 + rnd() * 240;
      l.strokeStyle = `rgba(${rnd() > 0.5 ? '232,224,212' : '150,134,116'},${0.06 + rnd() * 0.1})`;
      l.lineWidth = 8 + rnd() * 26;
      l.beginPath();
      l.moveTo(x, y);
      l.quadraticCurveTo(x + len * 0.5, y + (rnd() - 0.5) * 120, x + len, y + (rnd() - 0.5) * 70);
      l.stroke();
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(low, 0, 0, w, h);

    // Motas de polvo: por lotes de color, con un solo trazo por lote
    const batches = ['rgba(244,238,228,0.18)', 'rgba(244,238,228,0.36)', 'rgba(122,104,86,0.14)', 'rgba(122,104,86,0.28)'];
    const motes = Math.round((w * h) / 620 / batches.length);
    for (const color of batches) {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < motes; i++) {
        const x = rnd() * w;
        const y = rnd() * h;
        const s = rnd() < 0.92 ? 0.6 + rnd() * 1.1 : 1.8 + rnd() * 1.8;
        ctx.moveTo(x + s, y);
        ctx.arc(x, y, s, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    painted = true;
    canvas.classList.add('is-ready');
  }

  function resize(force = false) {
    const rect = hero.getBoundingClientRect();
    const widthChanged = Math.round(rect.width) !== w;
    // En móvil la barra del navegador cambia la altura: no repintar por eso.
    if (!force && !widthChanged) return;
    w = Math.round(rect.width);
    h = Math.round(rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    brush = Math.max(64, Math.min(Math.min(w, h) * 0.17, 150));
    for (const c of [canvas, sparkCanvas]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!done) {
      grid = new Uint8Array(COLS * ROWS);
      rubbed = 0;
      traveled = 0;
      painted = false;
      canvas.classList.remove('is-ready');
      updateMeter();
      // Después del primer cuadro: el fondo CSS ya tiene el mismo tono y el título no espera.
      requestAnimationFrame(() => setTimeout(() => { if (!done) paintGrime(); }, 0));
    }
  }

  /* ---------- Limpiar ---------- */
  function mark(x: number, y: number) {
    const cw = w / COLS;
    const ch = h / ROWS;
    const rx = Math.ceil(brush / cw);
    const ry = Math.ceil(brush / ch);
    const cx = Math.floor(x / cw);
    const cy = Math.floor(y / ch);
    for (let j = cy - ry; j <= cy + ry; j++) {
      for (let i = cx - rx; i <= cx + rx; i++) {
        if (i < 0 || j < 0 || i >= COLS || j >= ROWS) continue;
        if (Math.hypot((i + 0.5) * cw - x, (j + 0.5) * ch - y) > brush) continue;
        const k = j * COLS + i;
        if (!grid[k]) { grid[k] = 1; rubbed++; }
      }
    }
  }

  function wipe(x: number, y: number) {
    if (done || !painted) return;
    const from = last ?? { x: x + 0.1, y };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 22 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brush * 2 - 22;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const dist = Math.hypot(x - from.x, y - from.y);
    // La demostración inicial enseña el efecto, pero no cuenta: el 100% lo hace el usuario.
    if (!demoRunning) {
      if (dist >= 2) traveled += dist;
      for (let t = 0; t <= 1; t += Math.min(1, (brush * 0.5) / Math.max(dist, 1))) {
        mark(from.x + (x - from.x) * t, from.y + (y - from.y) * t);
      }
    }
    if (dist > 6) emit(x, y, Math.min(3, 1 + Math.floor(dist / 40)));
    last = { x, y };
    updateMeter();
    if (progress() >= 1) finish();
  }

  function progress() {
    return Math.min(Math.max(rubbed / grid.length / CLEAN_AT, traveled / (SWIPES * w)), 1);
  }

  function updateMeter() {
    const p = done ? 1 : progress();
    meter.style.transform = `scaleX(${p})`;
    pct.textContent = String(Math.round(p * 100));
  }

  function finish() {
    if (done) return;
    done = true;
    updateMeter();
    hero.classList.add('is-clean');
    cloth.classList.remove('is-on');
    swapSub();
    burst();
  }

  function swapSub() {
    const text = sub.dataset.done;
    if (!text) return;
    sub.style.opacity = '0';
    setTimeout(() => { sub.textContent = text; sub.style.opacity = '1'; }, 350);
  }

  /* ---------- Destellos: la estrella del logo ---------- */
  type Spark = { x: number; y: number; vx: number; vy: number; life: number; ttl: number; size: number; color: string; spin: number };
  const sparks: Spark[] = [];
  const COLORS = ['#ffffff', '#ffffff', '#c8964f', '#98d4cc'];
  let sparkRaf = 0;

  function emit(x: number, y: number, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.3 + Math.random() * 1.3;
      sparks.push({
        x: x + (Math.random() - 0.5) * brush,
        y: y + (Math.random() - 0.5) * brush,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 0.5,
        life: 0,
        ttl: 34 + Math.random() * 34,
        size: 4 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        spin: Math.random() * Math.PI,
      });
    }
    if (sparks.length > 240) sparks.splice(0, sparks.length - 240);
    if (!sparkRaf) sparkRaf = requestAnimationFrame(drawSparks);
  }

  function burst() {
    for (let i = 0; i < 70; i++) emit(Math.random() * w, Math.random() * h, 1);
  }

  function star(x: number, y: number, r: number, rot: number) {
    sctx.save();
    sctx.translate(x, y);
    sctx.rotate(rot);
    sctx.beginPath();
    for (let i = 0; i < 4; i++) {
      sctx.rotate(Math.PI / 2);
      sctx.moveTo(0, -r);
      sctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0);
      sctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
      sctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0);
      sctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r);
    }
    sctx.fill();
    sctx.restore();
  }

  function drawSparks() {
    sctx.clearRect(0, 0, w, h);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life++;
      if (s.life >= s.ttl) { sparks.splice(i, 1); continue; }
      s.x += s.vx;
      s.y += s.vy;
      const k = s.life / s.ttl;
      const pop = Math.sin(k * Math.PI);
      sctx.globalAlpha = pop;
      sctx.fillStyle = s.color;
      star(s.x, s.y, s.size * pop, s.spin + k);
    }
    sctx.globalAlpha = 1;
    sparkRaf = sparks.length ? requestAnimationFrame(drawSparks) : 0;
    if (!sparkRaf) sctx.clearRect(0, 0, w, h);
  }

  /* ---------- Cursor y dedo ---------- */
  function point(clientX: number, clientY: number) {
    const r = hero.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function moveCloth(x: number, y: number) {
    cloth.style.transform = `translate(${x}px, ${y}px) rotate(${(x + y) * 0.1}deg)`;
  }

  function interact(clientX: number, clientY: number) {
    if (!userTouched) {
      userTouched = true;
      demoRunning = false;
      last = null;
    }
    const { x, y } = point(clientX, clientY);
    moveCloth(x, y);
    if (!done) cloth.classList.add('is-on');
    wipe(x, y);
    // Parallax leve: la sala tiene profundidad
    stagePx = (x / w - 0.5) * -14;
    stagePy = (y / h - 0.5) * -8;
    applyStage();
  }

  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') interact(e.clientX, e.clientY);
  });
  hero.addEventListener('pointerleave', () => { last = null; cloth.classList.remove('is-on'); });
  hero.addEventListener('touchstart', (e) => { last = null; interact(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  hero.addEventListener('touchmove', (e) => interact(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  hero.addEventListener('touchend', () => { last = null; cloth.classList.remove('is-on'); }, { passive: true });

  /* ---------- Demostración al cargar: enseña qué hay debajo ---------- */
  function demo() {
    if (userTouched || done) return;
    demoRunning = true;
    cloth.classList.add('is-on');
    const start = performance.now();
    const DUR = 1700;
    last = null;
    const frame = (now: number) => {
      if (!demoRunning || done) { cloth.classList.remove('is-on'); return; }
      const t = Math.min((now - start) / DUR, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const narrow = w < 761;
      const x = (narrow ? 0.95 - 0.8 * e : 0.97 - 0.42 * e) * w;
      const y = (narrow ? 0.72 : 0.42) * h + Math.sin(e * Math.PI * 2.5) * h * (narrow ? 0.08 : 0.17);
      moveCloth(x, y);
      wipe(x, y);
      if (t < 1) requestAnimationFrame(frame);
      else { demoRunning = false; last = null; cloth.classList.remove('is-on'); }
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Scroll ---------- */
  let stagePx = 0;
  let stagePy = 0;
  let cam = 0;
  let autoLast = 0;

  function applyStage() {
    stage.style.transform = `translate(${stagePx}px, ${stagePy}px) scale(${1.012 + cam * 0.62})`;
  }

  function autoWipe(p: number) {
    // Pasadas en zigzag: el trapo recorre la pantalla según se baja
    const PASSES = 5;
    const at = (s: number) => {
      const seg = Math.min(s * PASSES, PASSES - 0.0001);
      const row = Math.floor(seg);
      const f = seg - row;
      return { x: (row % 2 ? 1 - f : f) * w, y: ((row + 0.5) / PASSES) * h };
    };
    for (let s = autoLast; s < p; s += 0.02) {
      const pos = at(s);
      wipe(pos.x, pos.y);
    }
    autoLast = p;
  }

  let ticking = false;
  function onScroll() {
    ticking = false;
    const r = track.getBoundingClientRect();
    const total = r.height - hero.offsetHeight;
    const p = Math.min(Math.max(-r.top / Math.max(total, 1), 0), 1);

    const wiped = Math.min(p / WIPE_END, 1);
    if (!done && p > 0.02 && wiped > autoLast) {
      if (demoRunning) demoRunning = false;
      if (autoLast === 0) last = null;
      autoWipe(wiped);
    }
    if (!done && p >= WIPE_END) finish();

    cam = Math.max((p - WIPE_END) / (1 - WIPE_END), 0);
    const eased = cam * cam * (3 - 2 * cam);
    cam = eased;
    applyStage();
    copy.style.opacity = String(Math.max(1 - eased * 1.9, 0));
    copy.style.transform = `translateY(${eased * -60}px)`;
    dissolve.style.opacity = String(Math.max((eased - 0.45) / 0.55, 0));
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- Arranque ---------- */
  resize(true);
  window.addEventListener('resize', () => resize());
  onScroll();

  // Si la página recarga a mitad de camino, no mostrar polvo.
  if (window.scrollY > hero.offsetHeight * 0.4) finish();
  else setTimeout(demo, 800);
}
