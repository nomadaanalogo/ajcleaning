/** Mapa del sur de Florida: se calcula al compilar y queda como SVG estático. */
import { feature } from 'topojson-client';
import topo from 'us-atlas/counties-10m.json';
import { areas } from '../data/areas';

export const MAP = { w: 560, h: 640, lonMin: -80.85, lonMax: -79.93, latMin: 25.28, latMax: 26.33 };

const k = Math.cos((25.8 * Math.PI) / 180);
const scale = Math.min(MAP.w / ((MAP.lonMax - MAP.lonMin) * k), MAP.h / (MAP.latMax - MAP.latMin));

export const project = (lon: number, lat: number): [number, number] => [
  (lon - MAP.lonMin) * k * scale,
  (MAP.latMax - lat) * scale,
];

type Geo = { id?: string | number; geometry: { type: string; coordinates: number[][][] | number[][][][] } };
const t = topo as unknown as { objects: { counties: never; states: never } };
const counties = (feature(topo as never, t.objects.counties) as unknown as { features: Geo[] }).features;

function toPath(g: Geo) {
  const polys = (g.geometry.type === 'Polygon' ? [g.geometry.coordinates] : g.geometry.coordinates) as number[][][][];
  return polys
    .map((poly) => poly.map((ring) => `M${ring.map(([lon, lat]) => project(lon, lat).map((n) => n.toFixed(1)).join(' ')).join('L')}Z`).join(''))
    .join('');
}

/** Palm Beach, Broward, Miami-Dade, Monroe, Collier y Hendry: lo que cae dentro del encuadre. */
const inFrame = new Set(['12099', '12011', '12086', '12087', '12021', '12051']);
const inView = (f: Geo) => inFrame.has(String(f.id));
/** Miami-Dade, Broward: donde están las zonas. */
const served = new Set(['12086', '12011']);

export const landPath = counties.filter(inView).map(toPath).join('');
export const servedPath = counties.filter((f) => served.has(String(f.id))).map(toPath).join('');
/** Las zonas de la costa llevan el nombre sobre el agua; las demás, sobre tierra. */
const labelRight = new Set(['fort-lauderdale', 'hollywood', 'aventura', 'north-miami', 'miami-beach']);
export const pins = areas.map((a) => {
  const [x, y] = project(a.lon, a.lat);
  return { id: a.id, name: a.name, x, y, right: labelRight.has(a.id) };
});
