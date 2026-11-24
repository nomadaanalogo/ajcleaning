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
    if (name === 'consent' && val(name)) section.querySelector('.consent-wrap')?.classList.remove('is-bad');
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
  const phoneDigits = () => text('phone').replace(/\D/g, '');
  // 10 dígitos (EE. UU.), 11 si empieza por 1, o un número internacional de hasta 15.
  const phoneOk = (d: string) => d.length === 10 || (d.length === 11 && d.startsWith('1')) || (d.length >= 11 && d.length <= 15 && text('phone').startsWith('+'));

  function validateContact() {
    let firstBad: HTMLElement | null = null;
    for (const el of $$<HTMLInputElement>('.field input')) {
      const value = el.value.trim();
      let msg = '';
      if (!value) msg = el.hasAttribute('data-optional') ? '' : S.required;
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = S.badEmail;
      else if (el.type === 'tel' && !phoneOk(phoneDigits())) msg = S.badPhone;
      const field = el.closest('.field')!;
      const err = field.querySelector<HTMLElement>('.err')!;
      field.classList.toggle('is-bad', !!msg);
      el.setAttribute('aria-invalid', String(!!msg));
      err.textContent = msg;
      err.hidden = !msg;
      if (msg && !firstBad) firstBad = el;
    }
    const consent = form.querySelector<HTMLInputElement>('[name="consent"]')!;
    $('[data-err="consent"]').hidden = consent.checked;
    consent.closest('.consent-wrap')!.classList.toggle('is-bad', !consent.checked);
    if (!consent.checked && !firstBad) firstBad = consent;
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  /* ---------- Verificación antirobots ----------
   * 1. Pide al script de Google un reto firmado (incluye la hora: el servidor sabe cuánto tardó la persona).
   * 2. Lo resuelve con una prueba de trabajo: buscar un número que, junto al reto, dé un SHA-256
   *    que empiece con BITS ceros. Al navegador le toma menos de un segundo; a un robot que envía
   *    miles de solicitudes le cuesta caro. El servidor lo comprueba y no acepta el mismo reto dos veces.
   * Se arranca apenas la persona toca el formulario, así ya está lista al enviar. */
  const BITS = 14;
  let proof: Promise<{ reto: string; prueba: string }> | null = null;

  function startProof() {
    if (proof || !cfg.endpoint || !window.crypto?.subtle) return;
    proof = (async () => {
      const res = await fetch(`${cfg.endpoint}?accion=reto`, { method: 'GET' });
      const { reto } = (await res.json()) as { reto?: string };
      if (!reto) throw new Error('sin reto');
      const enc = new TextEncoder();
      for (let n = 0; n < 5_000_000; n++) {
        const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(`${reto}:${n}`)));
        if (leadingZeroBits(hash) >= BITS) return { reto, prueba: String(n) };
      }
      throw new Error('sin prueba');
    })();
    // Si falla (sin conexión, script caído), se vuelve a intentar al enviar.
    proof.catch(() => { proof = null; });
  }

  function leadingZeroBits(bytes: Uint8Array) {
    let bits = 0;
    for (const b of bytes) {
      if (b === 0) { bits += 8; continue; }
      bits += Math.clz32(b) - 24;
      break;
    }
    return bits;
  }

  form.addEventListener('pointerdown', startProof, { once: true });
  form.addEventListener('focusin', startProof, { once: true });

  /* ---------- Envío ---------- */
  function whatsappFallback() {
    const l = cfg.labels;
    const lines = [
      S.waMsg,
      '',
      `${S.wName}: ${text('name')}`,
      `Email: ${text('email')}`,
      ...(text('phone') ? [`${S.wPhone}: ${text('phone')}`] : []),
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
      startProof();
      if (!proof) throw new Error('sin verificación');
      const check = await Promise.race([
        proof,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('tiempo')), 20000)),
      ]);
      // text/plain evita la consulta previa de CORS que Apps Script no responde.
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nombre: text('name'),
          correo: text('email'),
          telefono: text('phone'),
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
          autorizacion: form.querySelector<HTMLInputElement>('[name="consent"]')!.checked,
          website: text('website'),
          elapsed: Date.now() - startedAt,
          reto: check.reto,
          prueba: check.prueba,
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
