import type { L, Lang } from './i18n';
import { routes } from './i18n';

export type Area = {
  id: string;
  name: string;
  county: string;
  lat: number;
  lon: number;
  intro: L;
  notes: L[];
  nearby: string[];
};

/** Zonas que indicó el negocio. El texto describe el tipo de vivienda, no promete nada que no hayan confirmado. */
export const areas: Area[] = [
  {
    id: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    county: 'Broward',
    lat: 26.1224,
    lon: -80.1373,
    intro: {
      en: 'Canal homes. Beach condos. Las Olas offices. Salt air finds every window, and we keep up with it.',
      es: 'Casas en los canales. Condos frente al mar. Oficinas en Las Olas. La brisa salada llega a cada ventana, y nosotros la mantenemos a raya.',
    },
    notes: [
      { en: 'Waterfront homes with lots of glass', es: 'Casas frente al agua con mucho vidrio' },
      { en: 'Vacation rentals between guests', es: 'Rentas vacacionales entre huéspedes' },
      { en: 'Small offices near downtown', es: 'Oficinas pequeñas cerca del centro' },
    ],
    nearby: ['hollywood', 'aventura', 'north-miami'],
  },
  {
    id: 'hollywood',
    name: 'Hollywood',
    county: 'Broward',
    lat: 26.0112,
    lon: -80.1495,
    intro: {
      en: 'From the Broadwalk to the bungalows. Sand comes in with every visit, so a set schedule pays off.',
      es: 'Del Broadwalk a los bungalows. La arena entra en cada visita, por eso un horario fijo vale la pena.',
    },
    notes: [
      { en: 'Beach condos and rentals', es: 'Condos y rentas de playa' },
      { en: 'Family bungalows', es: 'Bungalows familiares' },
      { en: 'Airbnb turnovers', es: 'Cambios de huésped en Airbnb' },
    ],
    nearby: ['fort-lauderdale', 'aventura', 'north-miami'],
  },
  {
    id: 'aventura',
    name: 'Aventura',
    county: 'Miami-Dade',
    lat: 25.9565,
    lon: -80.1393,
    intro: {
      en: 'High-rise living with a view. Away for the season? Come back to a clean home.',
      es: 'Vida en altura con vista. ¿Te vas por temporada? Vuelve a una casa limpia.',
    },
    notes: [
      { en: 'High-rise condos', es: 'Condos en torres' },
      { en: 'Seasonal residents', es: 'Residentes de temporada' },
      { en: 'Building access planned ahead', es: 'Acceso al edificio coordinado con tiempo' },
    ],
    nearby: ['north-miami', 'hollywood', 'miami-beach'],
  },
  {
    id: 'north-miami',
    name: 'North Miami',
    county: 'Miami-Dade',
    lat: 25.8901,
    lon: -80.1867,
    intro: {
      en: 'Family homes, condos and small businesses along Biscayne. One team for all of it.',
      es: 'Casas familiares, condos y pequeños negocios a lo largo de Biscayne. Un solo equipo para todo.',
    },
    notes: [
      { en: 'Single-family homes', es: 'Casas unifamiliares' },
      { en: 'Condos near Biscayne Blvd', es: 'Condos cerca de Biscayne Blvd' },
      { en: 'Small offices and shops', es: 'Oficinas y locales pequeños' },
    ],
    nearby: ['aventura', 'miami-beach', 'miami-lakes'],
  },
  {
    id: 'miami-beach',
    name: 'Miami Beach',
    county: 'Miami-Dade',
    lat: 25.7907,
    lon: -80.13,
    intro: {
      en: 'Art Deco apartments. Oceanfront towers. Short stays. Sand always gets in. We get it out.',
      es: 'Apartamentos Art Deco. Torres frente al mar. Estadías cortas. La arena siempre entra. Nosotros la sacamos.',
    },
    notes: [
      { en: 'Vacation rental cleanings', es: 'Limpieza de rentas vacacionales' },
      { en: 'Compact apartments, done right', es: 'Apartamentos pequeños, bien hechos' },
      { en: 'Oceanfront condos', es: 'Condos frente al mar' },
    ],
    nearby: ['brickell', 'north-miami', 'coconut-grove'],
  },
  {
    id: 'brickell',
    name: 'Brickell',
    county: 'Miami-Dade',
    lat: 25.76,
    lon: -80.1937,
    intro: {
      en: 'Busy week. Tall building. You should not spend Saturday cleaning. Set a schedule and get it back.',
      es: 'Semana ocupada. Edificio alto. Tu sábado no es para limpiar. Programa una agenda y recupéralo.',
    },
    notes: [
      { en: 'Condos and apartments', es: 'Condos y apartamentos' },
      { en: 'Front desk and elevator access planned', es: 'Recepción y ascensor coordinados' },
      { en: 'Offices in the financial district', es: 'Oficinas en el distrito financiero' },
    ],
    nearby: ['coconut-grove', 'miami-beach', 'kendall'],
  },
  {
    id: 'coconut-grove',
    name: 'Coconut Grove',
    county: 'Miami-Dade',
    lat: 25.7126,
    lon: -80.257,
    intro: {
      en: 'Shady streets. Open windows. Homes full of character that deserve careful hands.',
      es: 'Calles con sombra. Ventanas abiertas. Casas con carácter que merecen manos cuidadosas.',
    },
    notes: [
      { en: 'Older homes, handled with care', es: 'Casas antiguas, tratadas con cuidado' },
      { en: 'Bayfront condos', es: 'Condos frente a la bahía' },
      { en: 'Decor dusted item by item', es: 'Decoración sacudida pieza por pieza' },
    ],
    nearby: ['brickell', 'kendall', 'miami-beach'],
  },
  {
    id: 'miami-lakes',
    name: 'Miami Lakes',
    county: 'Miami-Dade',
    lat: 25.9087,
    lon: -80.3087,
    intro: {
      en: 'Quiet lakes, busy families and local offices. A routine keeps every one of them running.',
      es: 'Lagos tranquilos, familias ocupadas y oficinas locales. Una rutina lo mantiene todo en orden.',
    },
    notes: [
      { en: 'Townhomes and family homes', es: 'Townhomes y casas familiares' },
      { en: 'Offices near Main Street', es: 'Oficinas cerca de Main Street' },
      { en: 'Recurring plans for busy weeks', es: 'Planes recurrentes para semanas ocupadas' },
    ],
    nearby: ['hialeah-gardens', 'north-miami', 'kendall'],
  },
  {
    id: 'hialeah-gardens',
    name: 'Hialeah Gardens',
    county: 'Miami-Dade',
    lat: 25.8651,
    lon: -80.3465,
    intro: {
      en: 'Family homes that see real life every day. Se habla español. We keep it simple.',
      es: 'Casas familiares con vida de verdad todos los días. Hablamos español. Lo hacemos simple.',
    },
    notes: [
      { en: 'Family homes and townhomes', es: 'Casas familiares y townhomes' },
      { en: 'Quote and book in Spanish', es: 'Cotiza y reserva en español' },
      { en: 'Small local businesses', es: 'Pequeños negocios locales' },
    ],
    nearby: ['miami-lakes', 'kendall', 'north-miami'],
  },
  {
    id: 'kendall',
    name: 'Kendall',
    county: 'Miami-Dade',
    lat: 25.6793,
    lon: -80.3173,
    intro: {
      en: 'Kids. Pets. School runs. Your weekends should not go to the bathroom floor.',
      es: 'Niños. Mascotas. El colegio. Tus fines de semana no son para el piso del baño.',
    },
    notes: [
      { en: 'Busy family homes', es: 'Casas familiares con mucho movimiento' },
      { en: 'Homes with pets', es: 'Casas con mascotas' },
      { en: 'Weekly and biweekly routines', es: 'Rutinas semanales y quincenales' },
    ],
    nearby: ['coconut-grove', 'homestead', 'brickell'],
  },
  {
    id: 'homestead',
    name: 'Homestead',
    county: 'Miami-Dade',
    lat: 25.4687,
    lon: -80.4776,
    intro: {
      en: 'Bigger homes and growing neighborhoods in south Miami-Dade. More rooms. Same care.',
      es: 'Casas más grandes y barrios en crecimiento en el sur de Miami-Dade. Más cuartos. El mismo cuidado.',
    },
    notes: [
      { en: 'Newer family homes', es: 'Casas familiares nuevas' },
      { en: 'Move-in cleanings', es: 'Limpieza antes de mudarte' },
      { en: 'Post-construction cleanups', es: 'Limpieza post-construcción' },
    ],
    nearby: ['kendall', 'coconut-grove', 'hialeah-gardens'],
  },
];

export const areaUrl = (a: Area, lang: Lang) => `${routes.areas[lang]}${a.id}/`;
export const areaById = (id: string) => areas.find((a) => a.id === id)!;
