import type { L } from './i18n';

/** Lista real entregada por el negocio: qué incluye la limpieza. */
export const rooms: { id: string; name: L; items: L[] }[] = [
  {
    id: 'kitchen',
    name: { en: 'Kitchen', es: 'Cocina' },
    items: [
      { en: 'Cabinet exteriors', es: 'Exterior de gabinetes' },
      { en: 'Sink', es: 'Fregadero' },
      { en: 'Appliances, inside and out', es: 'Electrodomésticos, por dentro y por fuera' },
      { en: 'Trash emptied', es: 'Papeleras vacías' },
      { en: 'Floors', es: 'Pisos' },
      { en: 'Baseboards', es: 'Rodapiés' },
    ],
  },
  {
    id: 'bath',
    name: { en: 'Bathrooms', es: 'Baños' },
    items: [
      { en: 'Toilet', es: 'Inodoro' },
      { en: 'Sink', es: 'Lavamanos' },
      { en: 'Mirrors', es: 'Espejos' },
      { en: 'Shower and tub', es: 'Ducha y bañera' },
      { en: 'Trash emptied', es: 'Papeleras vacías' },
      { en: 'Floors and baseboards', es: 'Pisos y rodapiés' },
    ],
  },
  {
    id: 'bedroom',
    name: { en: 'Bedrooms', es: 'Habitaciones' },
    items: [
      { en: 'Beds made', es: 'Camas hechas' },
      { en: 'Surfaces dusted and wiped', es: 'Superficies sacudidas y limpias' },
      { en: 'Mirrors', es: 'Espejos' },
      { en: 'Trash emptied', es: 'Papeleras vacías' },
      { en: 'Floors', es: 'Pisos' },
      { en: 'Baseboards', es: 'Rodapiés' },
    ],
  },
  {
    id: 'living',
    name: { en: 'Living room', es: 'Sala' },
    items: [
      { en: 'Furniture dusted', es: 'Muebles sacudidos' },
      { en: 'Tables wiped', es: 'Mesas limpias' },
      { en: 'Reachable decor', es: 'Decoración accesible' },
      { en: 'Mirrors', es: 'Espejos' },
      { en: 'Trash emptied', es: 'Papeleras vacías' },
      { en: 'Floors and baseboards', es: 'Pisos y rodapiés' },
    ],
  },
];
