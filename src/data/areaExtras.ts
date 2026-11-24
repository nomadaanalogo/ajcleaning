/**
 * Contenido único por zona, para que cada página de ciudad no sea una copia de las demás
 * (lo que mejor rankea en Miami: barrios, códigos postales, tipo de vivienda y clima local).
 * Describe la zona y el tipo de casas; no promete nada que el negocio no haya confirmado.
 */
import type { L } from './i18n';
import type { Faq } from './faq';

export type AreaExtra = { zips: string[]; hoods: string[]; local: L; faq: Faq[] };

export const areaExtras: Record<string, AreaExtra> = {
  'fort-lauderdale': {
    zips: ['33301', '33304', '33305', '33306', '33308', '33311', '33312', '33315', '33316'],
    hoods: ['Las Olas', 'Victoria Park', 'Coral Ridge', 'Rio Vista', 'Harbor Beach', 'Galt Ocean Mile'],
    local: {
      en: 'Fort Lauderdale lives on the water. Salt air clouds glass doors and windows, and humid summers bring mildew to bathrooms. Many homes sit empty part of the year, so they need a clean before the owners come back.',
      es: 'Fort Lauderdale vive junto al agua. La brisa salada empaña puertas de vidrio y ventanas, y los veranos húmedos traen moho a los baños. Muchas casas pasan parte del año vacías y necesitan una limpieza antes de que vuelvan sus dueños.',
    },
    faq: [
      {
        q: { en: 'Do you clean beachfront condos in Fort Lauderdale?', es: '¿Limpian condos frente a la playa en Fort Lauderdale?' },
        a: {
          en: 'Yes. Tell us the building rules for service providers, like registration, hours or parking, and we follow them.',
          es: 'Sí. Dinos las reglas del edificio para proveedores, como registro, horario o parqueo, y las seguimos.',
        },
      },
      {
        q: { en: 'Can you clean while I am away for the season?', es: '¿Pueden limpiar mientras estoy fuera por temporada?' },
        a: {
          en: 'Yes. Set up safe access, like a key, lockbox or front desk, and we keep the home ready for your return.',
          es: 'Sí. Deja un acceso seguro, como llave, lockbox o recepción, y mantenemos la casa lista para tu regreso.',
        },
      },
    ],
  },
  hollywood: {
    zips: ['33019', '33020', '33021', '33023', '33024'],
    hoods: ['Hollywood Beach', 'Downtown Hollywood', 'Hollywood Lakes', 'Emerald Hills'],
    local: {
      en: 'Hollywood mixes beach condos, vacation rentals and family bungalows. Sand from the Broadwalk ends up on every floor, and rentals need a fast reset between guests.',
      es: 'Hollywood mezcla condos de playa, rentas vacacionales y bungalows familiares. La arena del Broadwalk termina en todos los pisos, y las rentas necesitan quedar listas rápido entre huéspedes.',
    },
    faq: [
      {
        q: { en: 'Do you clean vacation rentals near Hollywood Beach?', es: '¿Limpian rentas vacacionales cerca de Hollywood Beach?' },
        a: {
          en: 'Yes. We clean between guests on a set schedule. Tell us your check-out times.',
          es: 'Sí. Limpiamos entre huéspedes con un horario fijo. Dinos tus horas de check-out.',
        },
      },
    ],
  },
  aventura: {
    zips: ['33160', '33180'],
    hoods: ['Country Club Drive', 'Williams Island', 'Aventura Mall area', 'Yacht Club Drive'],
    local: {
      en: 'Aventura is high-rise living. Big windows, balconies and buildings with rules for service providers. Many owners spend part of the year away and want to come back to a clean home.',
      es: 'Aventura es vida en altura. Ventanales, balcones y edificios con reglas para proveedores. Muchos dueños pasan parte del año fuera y quieren volver a una casa limpia.',
    },
    faq: [
      {
        q: { en: 'Can you work with my building’s front desk in Aventura?', es: '¿Pueden coordinar con la recepción de mi edificio en Aventura?' },
        a: {
          en: 'Yes. Tell us how your building registers service providers and we follow it.',
          es: 'Sí. Dinos cómo registra tu edificio a los proveedores y lo seguimos.',
        },
      },
    ],
  },
  'north-miami': {
    zips: ['33161', '33168', '33181'],
    hoods: ['Sans Souci', 'Keystone Point', 'Arch Creek', 'Biscayne Boulevard corridor'],
    local: {
      en: 'North Miami has family homes, waterfront houses on Keystone Point and busy condos near Biscayne Boulevard. Families with kids and pets are where a weekly plan pays off most.',
      es: 'North Miami tiene casas familiares, casas frente al agua en Keystone Point y condos con mucho movimiento cerca de Biscayne Boulevard. En las familias con niños y mascotas es donde más rinde un plan semanal.',
    },
    faq: [
      {
        q: { en: 'Do you clean homes with pets in North Miami?', es: '¿Limpian casas con mascotas en North Miami?' },
        a: {
          en: 'Yes. Tell us about your pets in the form so we come ready.',
          es: 'Sí. Cuéntanos de tus mascotas en el formulario para ir preparados.',
        },
      },
    ],
  },
  'miami-beach': {
    zips: ['33139', '33140', '33141'],
    hoods: ['South Beach', 'Mid-Beach', 'North Beach', 'Sunset Harbour', 'Normandy Isles'],
    local: {
      en: 'Miami Beach means condos, Art Deco apartments and short stays. Sand gets everywhere, salt air marks the glass and rentals turn over fast. Most buildings ask service providers to check in at the front desk.',
      es: 'Miami Beach son condos, apartamentos Art Deco y estadías cortas. La arena llega a todas partes, la brisa salada marca los vidrios y las rentas rotan rápido. La mayoría de los edificios pide que los proveedores se registren en la recepción.',
    },
    faq: [
      {
        q: { en: 'Do you clean Airbnbs in South Beach?', es: '¿Limpian Airbnb en South Beach?' },
        a: {
          en: 'Yes. We clean between guests and work around your check-out times and building rules.',
          es: 'Sí. Limpiamos entre huéspedes y nos ajustamos a tus horas de check-out y a las reglas del edificio.',
        },
      },
    ],
  },
  brickell: {
    zips: ['33129', '33130', '33131'],
    hoods: ['Brickell Key', 'Brickell Avenue', 'Brickell City Centre area', 'The Roads'],
    local: {
      en: 'Brickell is towers and busy schedules. Floor-to-ceiling windows, small kitchens that work hard and owners who would rather not spend Saturday cleaning. We follow your building’s rules for elevators and service access.',
      es: 'Brickell son torres y agendas llenas. Ventanales de piso a techo, cocinas pequeñas que trabajan mucho y dueños que prefieren no pasar el sábado limpiando. Seguimos las reglas de tu edificio para ascensores y acceso de servicio.',
    },
    faq: [
      {
        q: { en: 'Do you clean condos in Brickell towers?', es: '¿Limpian condos en las torres de Brickell?' },
        a: {
          en: 'Yes. Tell us how to register with your building and where to park, and we handle the rest.',
          es: 'Sí. Dinos cómo registrarnos en tu edificio y dónde parquear, y nos encargamos del resto.',
        },
      },
    ],
  },
  'coconut-grove': {
    zips: ['33133'],
    hoods: ['Center Grove', 'North Grove', 'South Grove', 'CocoWalk area'],
    local: {
      en: 'Coconut Grove is shaded streets and older homes under a thick tree canopy. That means leaves, pollen and humidity inside the house, plus wood floors and details that need a careful hand.',
      es: 'Coconut Grove son calles con sombra y casas antiguas bajo muchos árboles. Eso trae hojas, polen y humedad dentro de la casa, además de pisos de madera y detalles que necesitan cuidado.',
    },
    faq: [
      {
        q: { en: 'Do you take care with wood floors and older homes?', es: '¿Tienen cuidado con pisos de madera y casas antiguas?' },
        a: {
          en: 'Yes. Tell us about delicate surfaces before the visit and we adapt our products and method.',
          es: 'Sí. Avísanos de las superficies delicadas antes de la visita y adaptamos productos y método.',
        },
      },
    ],
  },
  'miami-lakes': {
    zips: ['33014', '33016', '33018'],
    hoods: ['Main Street', 'Royal Oaks', 'lakefront neighborhoods'],
    local: {
      en: 'Miami Lakes is family homes around the lakes and Main Street. Bigger houses, kids, pets and busy weeks. A biweekly plan keeps the house ready without giving up your weekend.',
      es: 'Miami Lakes son casas familiares alrededor de los lagos y de Main Street. Casas más grandes, niños, mascotas y semanas ocupadas. Un plan cada dos semanas mantiene la casa lista sin perder tu fin de semana.',
    },
    faq: [
      {
        q: { en: 'Which plan works best for a family home in Miami Lakes?', es: '¿Qué plan conviene para una casa familiar en Miami Lakes?' },
        a: {
          en: 'Most families pick every 2 weeks. With kids or pets, weekly keeps up better.',
          es: 'La mayoría de las familias elige cada 2 semanas. Con niños o mascotas, semanal rinde mejor.',
        },
      },
    ],
  },
  'hialeah-gardens': {
    zips: ['33016', '33018'],
    hoods: ['Hialeah Gardens Boulevard', 'Okeechobee Road area', 'residential neighborhoods near the turnpike'],
    local: {
      en: 'Hialeah Gardens is family neighborhoods and busy households. Homes with kids and pets, and families who want the house ready for the weekend. We speak English and Spanish.',
      es: 'Hialeah Gardens son barrios familiares y casas con mucho movimiento. Hogares con niños y mascotas, y familias que quieren la casa lista para el fin de semana. Hablamos inglés y español.',
    },
    faq: [
      {
        q: { en: 'Do you speak Spanish?', es: '¿Hablan español?' },
        a: {
          en: 'Yes. You can request your quote and talk with us in English or Spanish.',
          es: 'Sí. Puedes pedir tu cotización y hablar con nosotros en español o en inglés.',
        },
      },
    ],
  },
  kendall: {
    zips: ['33173', '33176', '33183', '33186', '33193'],
    hoods: ['Kendall Lakes', 'The Hammocks', 'Kendale Lakes', 'Dadeland area'],
    local: {
      en: 'Kendall is suburban family life. Bigger homes, yards, pets and kids coming in from the rain. A weekly or biweekly plan keeps floors, kitchens and bathrooms under control.',
      es: 'Kendall es vida familiar de suburbio. Casas más grandes, patios, mascotas y niños que entran de la lluvia. Un plan semanal o cada dos semanas mantiene pisos, cocinas y baños bajo control.',
    },
    faq: [
      {
        q: { en: 'Do you clean large family homes in Kendall?', es: '¿Limpian casas familiares grandes en Kendall?' },
        a: {
          en: 'Yes. Tell us the size, bedrooms and bathrooms in the form and we quote it.',
          es: 'Sí. Indica el tamaño, las habitaciones y los baños en el formulario y te cotizamos.',
        },
      },
    ],
  },
  homestead: {
    zips: ['33030', '33031', '33032', '33033', '33034', '33035'],
    hoods: ['Downtown Homestead', 'Keys Gate', 'Redland area'],
    local: {
      en: 'Homestead has new communities, family homes and the farms of the Redland. Dust from fields and new construction finds its way inside, and newly built homes need a real clean before move-in.',
      es: 'Homestead tiene comunidades nuevas, casas familiares y las fincas del Redland. El polvo de los campos y de la construcción entra a las casas, y las viviendas nuevas necesitan una buena limpieza antes de mudarse.',
    },
    faq: [
      {
        q: { en: 'Do you clean new construction homes in Homestead?', es: '¿Limpian casas nuevas en Homestead?' },
        a: {
          en: 'Yes. Our post-construction cleaning removes the fine dust so you can move in.',
          es: 'Sí. Nuestra limpieza post-construcción quita el polvo fino para que puedas mudarte.',
        },
      },
    ],
  },
};
