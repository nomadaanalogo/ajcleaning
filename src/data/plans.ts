/**
 * Planes de limpieza, sin precios: el sitio no publica tarifas a propósito.
 * Curva de la gráfica "cómo se mantiene la casa": es una ilustración, no una medición.
 */
export type PlanId = 'weekly' | 'biweekly' | 'triweekly' | 'once';

export const plans: { id: PlanId; visits: number; interval: number }[] = [
  { id: 'weekly', visits: 52, interval: 1 },
  { id: 'biweekly', visits: 26, interval: 2 },
  { id: 'triweekly', visits: 17, interval: 3 },
  { id: 'once', visits: 1, interval: 0 },
];

export const CHART = { w: 640, h: 280, left: 8, right: 8, top: 20, bottom: 34, weeks: 12, threshold: 0.35, decay: 2.6 };

export function freshness(week: number, interval: number) {
  const since = interval > 0 ? week % interval : week;
  return Math.exp(-since / CHART.decay);
}

export const chartX = (week: number) => CHART.left + (week / CHART.weeks) * (CHART.w - CHART.left - CHART.right);
export const chartY = (v: number) => CHART.top + (1 - v) * (CHART.h - CHART.top - CHART.bottom);

/** Trazo de dientes de sierra: cae con los días y sube de golpe en cada limpieza. */
export function freshnessPath(interval: number) {
  let d = `M${chartX(0).toFixed(1)} ${chartY(1).toFixed(1)}`;
  const step = 0.1;
  for (let i = 1; i <= CHART.weeks * 10; i++) {
    const w = i * step;
    const isClean = interval > 0 && i % (interval * 10) === 0;
    if (isClean) {
      d += `L${chartX(w).toFixed(1)} ${chartY(Math.exp(-interval / CHART.decay)).toFixed(1)}L${chartX(w).toFixed(1)} ${chartY(1).toFixed(1)}`;
    } else {
      d += `L${chartX(w).toFixed(1)} ${chartY(freshness(w, interval)).toFixed(1)}`;
    }
  }
  return d;
}

/** Semanas en que hay limpieza, para los marcadores. */
export function cleanWeeks(interval: number) {
  if (!interval) return [0];
  const out: number[] = [];
  for (let w = 0; w <= CHART.weeks; w += interval) out.push(w);
  return out;
}
