/** Solicitud de cotización: pasos, validación y envío a la hoja de Google Drive. */
type Map = Record<string, string>;
type Lists = { property: Map; size: Map; frequency: Map; kind: Map; extras: Map };
type Config = {
  endpoint: string;
  lang: 'en' | 'es';
  zona: string;
  whatsappBase: string;
  sheet: Lists & { regular: string };
  labels: Lists;
  strings: Map;
};

const form = document.querySelector<HTMLFormElement>('[data-wizard]');
const raw = document.querySelector<HTMLScriptElement>('[data-wizard-config]');

if (form && raw) init(form, JSON.parse(raw.textContent ?? '{}') as Config);

function init(form: HTMLFormElement, cfg: Config) {
  const section = form.closest('section')!;
  const $ = <T extends Element = HTMLElement>(s: string) => section.querySelector<T>(s)!;
  const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(section.querySelectorAll<T>(s));
  const S = cfg.strings;
  const steps = $$<HTMLFieldSetElement>('.step');
  const startedAt = Date.now();
  let current = 0;

  const val = (name: string) => form.querySelector<HTMLInputElement>(`[name="${name}"]:checked`)?.value ?? '';
  const text = (name: string) => form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value.trim() ?? '';
  const checked = (name: string) => $$<HTMLInputElement>(`[name="${name}"]:checked`).map((i) => i.value);
  const isOnce = () => val('frequency') === 'once';
  const isOffice = () => val('property') === 'office';

  /* ---------- Textos de resumen (para el panel, WhatsApp y la hoja) ---------- */
  function sizeText(l: Lists) {
    const parts = [l.size[val('size')]];
    if (!isOffice() && val('bedrooms')) parts.push(`${val('bedrooms')} ${S.beds}`);
    if (val('bathrooms')) parts.push(`${val('bathrooms')} ${S.baths}`);
    return parts.filter(Boolean).join(' · ');
  }
  function planText(l: Lists) {
    const f = l.frequency[val('frequency')] ?? '';
    return isOnce() && val('kind') ? `${f} · ${l.kind[val('kind')]}` : f;
  }
  const extrasText = (l: Lists) => checked('extras').map((x) => l.extras[x]).join(', ');

  function render() {
    $('[data-s="property"]').textContent = cfg.labels.property[val('property')] ?? '—';
    $('[data-s="size"]').textContent = sizeText(cfg.labels) || '—';
    $('[data-s="plan"]').textContent = planText(cfg.labels) || '—';
    const extras = extrasText(cfg.labels);
    $('[data-s="extras"]').textContent = extras;
    $('[data-s-row="extras"]').hidden = !extras;
    // Las oficinas no tienen habitaciones; el tipo de limpieza solo se pregunta para una sola visita.
    $('[data-beds]').hidden = isOffice();
    $('[data-kind]').hidden = !isOnce();
  }

  /* ---------- Pasos ---------- */
  function show(index: number, focus = true) {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((s) => s.classList.remove('is-on'));
    const step = steps[current];
    step.classList.add('is-on');
    $('[data-progress]').style.transform = `scaleX(${(current + 1) / steps.length})`;
    $('[data-count]').textContent = S.stepOf.replace('{n}', String(current + 1)).replace('{t}', String(steps.length));
    $<HTMLButtonElement>('[data-back]').hidden = current === 0;
    if (!focus) return;
    const legend = step.querySelector('legend');
    legend?.setAttribute('tabindex', '-1');
    legend?.focus({ preventScroll: true });
    const top = form.getBoundingClientRect().top;
    if (top < 70 || top > window.innerHeight * 0.5) {
      window.scrollTo({ top: window.scrollY + top - 84, behavior: 'smooth' });
    }
  }

  /** Revisa las preguntas obligatorias visibles del paso; marca las que faltan. */
  function stepValid(step: HTMLElement) {
    let firstBad: HTMLElement | null = null;
    step.querySelectorAll<HTMLElement>('[data-req]').forEach((group) => {
      const name = group.dataset.req!;
      const missing = !group.closest('[hidden]') && !val(name);
      const err = step.querySelector<HTMLElement>(`[data-err="${name}"]`);
      if (err) err.hidden = !missing;
      if (missing && !firstBad) firstBad = group;
    });
    if (firstBad) (firstBad as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return !firstBad;
  }

  function next() {
    if (stepValid(steps[current])) show(current + 1);
  }

  form.addEventListener('change', (e) => {
    render();
    const name = (e.target as HTMLInputElement).name;
    const err = section.querySelector<HTMLElement>(`[data-err="${name}"]`);
    if (err && val(name)) err.hidden = true;
  });

  // Tocar una propiedad avanza, aunque ya estuviera marcada. Se escucha en la tarjeta y no en
  // el radio para que moverse con las flechas del teclado no cambie de paso.
  $$<HTMLElement>('.card[data-auto]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      setTimeout(() => show(steps.indexOf(card.closest('.step') as HTMLFieldSetElement) + 1), 260);
    });
  });
  $$<HTMLButtonElement>('[data-next]').forEach((b) => b.addEventListener('click', next));
  $<HTMLButtonElement>('[data-back]').addEventListener('click', () => show(current - 1));
  form.addEventListener('input', (e) => {
    const field = (e.target as HTMLElement).closest('.field');
    if (!field) return;
    field.classList.remove('is-bad');
    field.querySelector<HTMLElement>('.err')!.hidden = true;
  });

  /* ---------- Validación de los datos ---------- */
  function validateContact() {
    let firstBad: HTMLInputElement | null = null;
    for (const el of $$<HTMLInputElement>('.field input')) {
      const value = el.value.trim();
      let msg = '';
      if (!value) msg = S.required;
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = S.badEmail;
      const field = el.closest('.field')!;
      const err = field.querySelector<HTMLElement>('.err')!;
      field.classList.toggle('is-bad', !!msg);
      el.setAttribute('aria-invalid', String(!!msg));
      err.textContent = msg;
      err.hidden = !msg;
      if (msg && !firstBad) firstBad = el;
    }
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  /* ---------- Envío ---------- */
  function whatsappFallback() {
    const l = cfg.labels;
    const lines = [
      S.waMsg,
      '',
      `${S.wName}: ${text('name')}`,
      `Email: ${text('email')}`,
      `${S.wAddress}: ${text('address')}`,
      `${S.wProperty}: ${l.property[val('property')] ?? ''}`,
      `${S.wSize}: ${sizeText(l)}`,
      `${S.wFrequency}: ${planText(l)}`,
    ];
    const extras = extrasText(l);
    if (extras) lines.push(`${S.wExtras}: ${extras}`);
    return cfg.whatsappBase + encodeURIComponent(lines.join('\n'));
  }

  function showFailure() {
    $<HTMLAnchorElement>('[data-fail-wa]').href = whatsappFallback();
    $('[data-fail]').hidden = false;
  }

  const submit = $<HTMLButtonElement>('[data-submit]');
  const submitHtml = submit.innerHTML;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    $('[data-fail]').hidden = true;
    // Si falta algo de un paso anterior, se vuelve a ese paso.
    for (let i = 0; i < steps.length - 1; i++) {
      if (!stepValid(steps[i])) { show(i); stepValid(steps[i]); return; }
    }
    if (!validateContact()) return;

    if (!cfg.endpoint) { showFailure(); return; }

    const sh = cfg.sheet;
    submit.disabled = true;
    submit.textContent = S.sending;
    try {
      // text/plain evita la consulta previa de CORS que Apps Script no responde.
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nombre: text('name'),
          correo: text('email'),
          direccion: text('address'),
          propiedad: sh.property[val('property')] ?? '',
          tamano: sh.size[val('size')] ?? '',
          habitaciones: isOffice() ? '' : val('bedrooms'),
          banos: val('bathrooms'),
          frecuencia: sh.frequency[val('frequency')] ?? '',
          servicio: isOnce() ? sh.kind[val('kind')] ?? '' : sh.regular,
          extras: extrasText(sh),
          zona: cfg.zona,
          idioma: cfg.lang,
          pagina: location.pathname,
          website: text('website'),
          elapsed: Date.now() - startedAt,
        }),
      });
      const result = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!result?.ok) throw new Error('rejected');

      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      gtag?.('event', 'generate_lead', { frequency: val('frequency'), kind: isOnce() ? val('kind') : 'regular' });

      $('[data-done-name]').textContent = text('name').split(' ')[0];
      $('[data-flow]').hidden = true;
      const done = $('[data-done]');
      done.hidden = false;
      done.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top;
      if (top < 70) window.scrollTo({ top: window.scrollY + top - 84, behavior: 'smooth' });
    } catch {
      showFailure();
    } finally {
      submit.disabled = false;
      submit.innerHTML = submitHtml;
    }
  });

  /* ---------- Arranque ---------- */
  render();
  show(0, false);
}
