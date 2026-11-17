/** Solicitud de cotización: pasos, validación y envío a la hoja de Google Drive. */
type Map = Record<string, string>;
type Config = {
  endpoint: string;
  lang: 'en' | 'es';
  zona: string;
  whatsappBase: string;
  sheet: { property: Map; service: Map; frequency: Map };
  labels: { property: Map; service: Map; frequency: Map };
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
  const isRecurring = () => val('service') === 'recurring';

  /* ---------- Resumen ---------- */
  function render() {
    $('[data-s-property]').textContent = cfg.labels.property[val('property')] ?? '—';
    $('[data-s-service]').textContent = cfg.labels.service[val('service')] ?? '—';
    $('[data-s-frequency]').textContent = cfg.labels.frequency[val('frequency')] ?? '';
    $('[data-s-frequency-row]').hidden = !isRecurring();
    $('[data-freq]').hidden = !isRecurring();
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

  function next() {
    if (current === 0 && !val('property')) {
      $('[data-err-group="property"]').hidden = false;
      return;
    }
    show(current + 1);
  }

  form.addEventListener('change', () => {
    render();
    if (val('property')) $('[data-err-group="property"]').hidden = true;
  });

  // Tocar una tarjeta avanza, aunque ya estuviera marcada. Se escucha en la tarjeta y no en
  // el radio para que moverse con las flechas del teclado no cambie de paso.
  // "Recurrente" no avanza sola porque primero se elige la frecuencia.
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

  /* ---------- Validación ---------- */
  function validate() {
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
    const lines = [
      S.waMsg,
      '',
      `${S.wName}: ${text('name')}`,
      `Email: ${text('email')}`,
      `${S.wAddress}: ${text('address')}`,
      `${S.wProperty}: ${cfg.labels.property[val('property')] ?? ''}`,
      `${S.wService}: ${cfg.labels.service[val('service')] ?? ''}`,
    ];
    if (isRecurring()) lines.push(`${S.wFrequency}: ${cfg.labels.frequency[val('frequency')] ?? ''}`);
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
    if (!val('property')) { show(0); next(); return; }
    if (!validate()) return;

    if (!cfg.endpoint) { showFailure(); return; }

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
          propiedad: cfg.sheet.property[val('property')] ?? '',
          servicio: cfg.sheet.service[val('service')] ?? '',
          frecuencia: isRecurring() ? cfg.sheet.frequency[val('frequency')] ?? '' : '',
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
      gtag?.('event', 'generate_lead', { service: val('service'), frequency: isRecurring() ? val('frequency') : 'none' });

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
