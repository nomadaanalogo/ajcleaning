/**
 * Fotos del sitio. room-kitchen y service-addons son del cliente (AJ Cleaning Home);
 * las demás son de archivo, no trabajos del negocio. Origen en src/assets/photos/CREDITS.md.
 */
import type { L } from '../data/i18n';
import heroApartment from '../assets/photos/hero-home.jpg';
import roomKitchen from '../assets/photos/room-kitchen.jpg';
import roomBathroom from '../assets/photos/room-bathroom.jpg';
import roomBedroom from '../assets/photos/room-bedroom.jpg';
import roomLiving from '../assets/photos/room-living.jpg';
import recurring from '../assets/photos/service-recurring.jpg';
import deep from '../assets/photos/service-deep.jpg';
import move from '../assets/photos/service-move.jpg';
import airbnb from '../assets/photos/service-airbnb.jpg';
import office from '../assets/photos/service-office.jpg';
import realtor from '../assets/photos/service-realtor.jpg';
import construction from '../assets/photos/service-construction.jpg';
import laundry from '../assets/photos/service-laundry.jpg';
import addons from '../assets/photos/service-addons.jpg';

type Photo = { src: ImageMetadata; alt: L };

export const heroPhoto: Photo = {
  src: heroApartment,
  alt: {
    en: 'Bright, clean living room with a cream sofa, a wood floor and a large window to the garden',
    es: 'Sala luminosa y limpia, con sofá crema, piso de madera y un ventanal hacia el jardín',
  },
};

export const roomPhotos: Record<string, Photo> = {
  kitchen: { src: roomKitchen, alt: { en: 'Clean kitchen with oak cabinets, a white gas stove and a wood floor', es: 'Cocina limpia con gabinetes de roble, estufa de gas blanca y piso de madera' } },
  bath: { src: roomBathroom, alt: { en: 'Clean bathroom with vanity, toilet and tiled shower', es: 'Baño limpio con lavamanos, inodoro y ducha de baldosa' } },
  bedroom: { src: roomBedroom, alt: { en: 'Bedroom with a made bed and clean carpet', es: 'Habitación con la cama hecha y la alfombra limpia' } },
  living: { src: roomLiving, alt: { en: 'Living room with sofa, coffee table and wood floor', es: 'Sala con sofá, mesa de centro y piso de madera' } },
};

export const servicePhotos: Record<string, Photo> = {
  recurring: { src: recurring, alt: { en: 'Hand wiping a bathroom sink with a sponge', es: 'Mano limpiando un lavamanos con una esponja' } },
  deep: { src: deep, alt: { en: 'Dust mop on a shiny wood floor', es: 'Mopa sobre un piso de madera brillante' } },
  move: { src: move, alt: { en: 'Empty room with a moving box by the window', es: 'Cuarto vacío con una caja de mudanza junto a la ventana' } },
  airbnb: { src: airbnb, alt: { en: 'Guest bedroom with a neatly made bed', es: 'Habitación de huéspedes con la cama bien hecha' } },
  office: { src: office, alt: { en: 'Small office with a meeting table and brick wall', es: 'Oficina pequeña con mesa de reuniones y pared de ladrillo' } },
  realtor: { src: realtor, alt: { en: 'Empty apartment with a fitted kitchen, ready to show', es: 'Apartamento vacío con cocina integral, listo para mostrar' } },
  construction: { src: construction, alt: { en: 'Apartment with a ladder still inside after a remodel', es: 'Apartamento con una escalera adentro después de una remodelación' } },
  laundry: { src: laundry, alt: { en: 'Hand loading clothes into a washing machine', es: 'Mano metiendo ropa en una lavadora' } },
  addons: { src: addons, alt: { en: 'Kitchen with gray cabinets, a stainless steel stove and microwave', es: 'Cocina con gabinetes grises, estufa y microondas de acero inoxidable' } },
};
