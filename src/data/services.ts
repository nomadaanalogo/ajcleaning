import type { L, Lang } from './i18n';
import { routes } from './i18n';
import type { Faq } from './faq';
import type { IconName } from './icons';

export type Service = {
  id: string;
  slug: L;
  icon: IconName;
  tint: 'blush' | 'cream' | 'sand' | 'mist';
  name: L;
  tagline: L;
  title: L;
  description: L;
  h1: L;
  intro: L;
  points: L[];
  showRooms?: boolean;
  preset?: { property?: string; service?: string };
  faq: Faq[];
};

/**
 * PENDIENTE: el negocio iba a enviar qué incluye cada servicio. Los puntos de
 * limpieza profunda, mudanza, post-construcción, Airbnb, oficinas y realtors son
 * un borrador. La lista por habitación (rooms.ts) sí es la real.
 */
export const services: Service[] = [
  {
    id: 'recurring',
    slug: { en: 'recurring-house-cleaning', es: 'limpieza-recurrente' },
    icon: 'calendar',
    tint: 'blush',
    name: { en: 'Recurring cleaning', es: 'Limpieza recurrente' },
    tagline: { en: 'Your home. Always ready.', es: 'Tu casa. Siempre lista.' },
    title: { en: 'Weekly & Biweekly House Cleaning in Miami | AJ Cleaning Home', es: 'Limpieza de casas semanal y quincenal en Miami | AJ Cleaning Home' },
    description: {
      en: 'Weekly, biweekly or every 3 weeks. The same team, the same care, a lower price per visit. Get your free quote.',
      es: 'Semanal, cada 2 o cada 3 semanas. El mismo equipo, el mismo cuidado y menos costo por visita. Pide tu cotización gratis.',
    },
    h1: { en: 'Weekly and biweekly house cleaning', es: 'Limpieza de casas semanal y quincenal' },
    intro: {
      en: 'Stop catching up. We come on a set schedule. Your home stays clean between visits.',
      es: 'Deja de ponerte al día. Vamos en un horario fijo. Tu casa se mantiene limpia entre visitas.',
    },
    points: [
      { en: 'Lower price on every visit', es: 'Menos costo en cada visita' },
      { en: 'The same small team', es: 'El mismo equipo pequeño' },
      { en: 'Nothing to remember', es: 'Nada que recordar' },
      { en: 'Add extras when you need them', es: 'Suma extras cuando los necesites' },
    ],
    showRooms: true,
    preset: { service: 'recurring' },
    faq: [
      {
        q: { en: 'Which plan should I pick?', es: '¿Qué plan me conviene?' },
        a: {
          en: 'Weekly for busy homes, kids or pets. Every 2 weeks for most families. Every 3 weeks for smaller, quieter homes.',
          es: 'Semanal para casas con mucho movimiento, niños o mascotas. Cada 2 semanas para la mayoría de las familias. Cada 3 semanas para casas pequeñas y tranquilas.',
        },
      },
      {
        q: { en: 'Can the schedule fit my week?', es: '¿El horario se adapta a mi semana?' },
        a: {
          en: 'Yes. We work Monday to Friday, 8 am to 5 pm, and can adapt to you.',
          es: 'Sí. Trabajamos de lunes a viernes, de 8 am a 5 pm, y podemos adaptarnos a ti.',
        },
      },
    ],
  },
  {
    id: 'deep',
    slug: { en: 'deep-cleaning', es: 'limpieza-profunda' },
    icon: 'sparkle',
    tint: 'cream',
    name: { en: 'Deep cleaning', es: 'Limpieza profunda' },
    tagline: { en: 'The full reset.', es: 'Empezar de cero.' },
    title: { en: 'Deep House Cleaning in Miami & Fort Lauderdale | AJ Cleaning Home', es: 'Limpieza profunda en Miami y Fort Lauderdale | AJ Cleaning Home' },
    description: {
      en: 'A full reset for homes that need more than a regular clean. Kitchen, bathrooms, baseboards and add-ons. Get your free quote.',
      es: 'Un reinicio total para casas que necesitan más que una limpieza regular. Cocina, baños, rodapiés y extras. Pide tu cotización gratis.',
    },
    h1: { en: 'Deep house cleaning', es: 'Limpieza profunda de casas' },
    intro: {
      en: 'First clean or long overdue? We take our time on the build-up. Then a weekly plan keeps it that way.',
      es: '¿Primera limpieza o hace mucho que no se hace? Le dedicamos tiempo a lo acumulado. Luego, un plan semanal lo mantiene así.',
    },
    points: [
      { en: 'Everything in a regular clean', es: 'Todo lo de una limpieza regular' },
      { en: 'Extra time on build-up', es: 'Más tiempo en lo acumulado' },
      { en: 'Oven, fridge and cabinets available', es: 'Horno, refrigerador y gabinetes disponibles' },
      { en: 'A good start for a recurring plan', es: 'Un buen comienzo para un plan recurrente' },
    ],
    showRooms: true,
    preset: { service: 'deep' },
    faq: [
      {
        q: { en: 'When do I need a deep clean?', es: '¿Cuándo necesito una limpieza profunda?' },
        a: {
          en: 'Before starting a plan, after a long gap, or before guests or a holiday.',
          es: 'Antes de empezar un plan, después de mucho tiempo sin limpiar, o antes de visitas o fiestas.',
        },
      },
      {
        q: { en: 'How is the price set?', es: '¿Cómo se define el precio?' },
        a: {
          en: 'It starts from your home size. We confirm the final price once we see photos or talk with you.',
          es: 'Parte del tamaño de tu casa. Confirmamos el precio final al ver fotos o hablar contigo.',
        },
      },
    ],
  },
  {
    id: 'move',
    slug: { en: 'move-in-move-out-cleaning', es: 'limpieza-de-mudanza' },
    icon: 'box',
    tint: 'sand',
    name: { en: 'Move in / move out', es: 'Limpieza de mudanza' },
    tagline: { en: 'Empty rooms. Fresh start.', es: 'Cuartos vacíos. Nuevo comienzo.' },
    title: { en: 'Move In & Move Out Cleaning in South Florida | AJ Cleaning Home', es: 'Limpieza de mudanza en el sur de Florida | AJ Cleaning Home' },
    description: {
      en: 'Move in or move out with the place spotless. For renters, owners and realtors in South Florida. Get your free quote.',
      es: 'Entra o sal con el lugar impecable. Para inquilinos, dueños y realtors en el sur de Florida. Pide tu cotización gratis.',
    },
    h1: { en: 'Move in and move out cleaning', es: 'Limpieza de mudanza: entrada y salida' },
    intro: {
      en: 'Leave it clean. Or walk into clean. We handle what the boxes were hiding.',
      es: 'Entrégala limpia. O entra a un lugar limpio. Nos encargamos de lo que las cajas escondían.',
    },
    points: [
      { en: 'Cabinets and appliances', es: 'Gabinetes y electrodomésticos' },
      { en: 'Bathrooms top to bottom', es: 'Baños de arriba abajo' },
      { en: 'Floors and baseboards', es: 'Pisos y rodapiés' },
      { en: 'Ready for keys or photos', es: 'Lista para entregar llaves o tomar fotos' },
    ],
    preset: { service: 'move' },
    faq: [
      {
        q: { en: 'Should the home be empty?', es: '¿La casa debe estar vacía?' },
        a: {
          en: 'It is best when it is. Empty rooms let us reach every corner.',
          es: 'Es lo ideal. Con los cuartos vacíos llegamos a cada rincón.',
        },
      },
      {
        q: { en: 'Can a realtor or landlord book it?', es: '¿Puede reservar un realtor o dueño?' },
        a: {
          en: 'Yes. Tell us how we get access and when you need it ready.',
          es: 'Sí. Cuéntanos cómo entramos y para cuándo la necesitas lista.',
        },
      },
    ],
  },
  {
    id: 'airbnb',
    slug: { en: 'airbnb-cleaning', es: 'limpieza-airbnb' },
    icon: 'key',
    tint: 'mist',
    name: { en: 'Airbnb cleaning', es: 'Limpieza de Airbnb' },
    tagline: { en: 'Five-star first impression.', es: 'Primera impresión de cinco estrellas.' },
    title: { en: 'Airbnb & Vacation Rental Cleaning in Miami | AJ Cleaning Home', es: 'Limpieza de Airbnb y rentas en Miami | AJ Cleaning Home' },
    description: {
      en: 'Vacation rental cleaning for hosts in Miami Beach, Fort Lauderdale and Hollywood. Set a schedule. Keep guests happy. Get your free quote.',
      es: 'Limpieza de rentas vacacionales para anfitriones en Miami Beach, Fort Lauderdale y Hollywood. Agenda fija, huéspedes felices. Pide tu cotización gratis.',
    },
    h1: { en: 'Airbnb and vacation rental cleaning', es: 'Limpieza de Airbnb y rentas vacacionales' },
    intro: {
      en: 'Guests notice everything. We leave your rental ready for the next check-in.',
      es: 'Los huéspedes lo notan todo. Dejamos tu renta lista para el próximo check-in.',
    },
    points: [
      { en: 'Beds made, bathrooms shining', es: 'Camas hechas, baños brillantes' },
      { en: 'In-home laundry available', es: 'Lavandería en el lugar disponible' },
      { en: 'Book ahead around your calendar', es: 'Reserva con tiempo según tu calendario' },
      { en: 'Recurring rates for regular hosts', es: 'Tarifa recurrente para anfitriones frecuentes' },
    ],
    preset: { property: 'airbnb', service: 'recurring' },
    faq: [
      {
        q: { en: 'Do you work around check-outs?', es: '¿Se ajustan a los check-outs?' },
        a: {
          en: 'Yes, when you book ahead. Send us your calendar and we plan around it.',
          es: 'Sí, si reservas con anticipación. Envíanos tu calendario y nos organizamos.',
        },
      },
      {
        q: { en: 'Can you do the laundry too?', es: '¿También lavan la ropa?' },
        a: {
          en: 'Yes. Wash, dry and organize at the property.',
          es: 'Sí. Lavar, secar y organizar en la propiedad.',
        },
      },
    ],
  },
  {
    id: 'office',
    slug: { en: 'office-cleaning', es: 'limpieza-de-oficinas' },
    icon: 'office',
    tint: 'blush',
    name: { en: 'Office cleaning', es: 'Limpieza de oficinas' },
    tagline: { en: 'Monday-morning ready.', es: 'Lista para el lunes.' },
    title: { en: 'Office Cleaning in Miami & Fort Lauderdale | AJ Cleaning Home', es: 'Limpieza de oficinas en Miami y Fort Lauderdale | AJ Cleaning Home' },
    description: {
      en: 'Office cleaning on a weekly or biweekly schedule. Desks, bathrooms, kitchens and floors for small businesses in South Florida.',
      es: 'Limpieza de oficinas semanal o quincenal. Escritorios, baños, cocinas y pisos para pequeños negocios en el sur de Florida.',
    },
    h1: { en: 'Office cleaning for small businesses', es: 'Limpieza de oficinas para pequeños negocios' },
    intro: {
      en: 'Clean space. Better first impression. Set it once and forget it.',
      es: 'Espacio limpio. Mejor primera impresión. Lo programas una vez y te olvidas.',
    },
    points: [
      { en: 'Desks and shared surfaces', es: 'Escritorios y superficies comunes' },
      { en: 'Bathrooms and break rooms', es: 'Baños y cocinetas' },
      { en: 'Trash, floors and baseboards', es: 'Papeleras, pisos y rodapiés' },
      { en: 'A schedule that fits your hours', es: 'Un horario que se ajusta al tuyo' },
    ],
    preset: { property: 'office', service: 'recurring' },
    faq: [
      {
        q: { en: 'Can you clean outside business hours?', es: '¿Pueden limpiar fuera del horario laboral?' },
        a: {
          en: 'Our schedule is Monday to Friday, 8 am to 5 pm, and it can adapt. Tell us what works.',
          es: 'Nuestro horario es de lunes a viernes, de 8 am a 5 pm, y puede adaptarse. Dinos qué te sirve.',
        },
      },
      {
        q: { en: 'Who brings the supplies?', es: '¿Quién lleva los productos?' },
        a: {
          en: 'We can bring them, or use the ones in your office.',
          es: 'Podemos llevarlos o usar los de tu oficina.',
        },
      },
    ],
  },
  {
    id: 'realtor',
    slug: { en: 'realtor-listing-cleaning', es: 'limpieza-para-realtors' },
    icon: 'sign',
    tint: 'cream',
    name: { en: 'Realtors & listings', es: 'Realtors y propiedades' },
    tagline: { en: 'Show-ready. Photo-ready.', es: 'Lista para mostrar y fotografiar.' },
    title: { en: 'Listing & Realtor Cleaning in South Florida | AJ Cleaning Home', es: 'Limpieza para realtors y propiedades en venta | AJ Cleaning Home' },
    description: {
      en: 'Cleaning for realtors and property managers. Listings ready for photos, showings and closing day across South Florida.',
      es: 'Limpieza para realtors y administradores. Propiedades listas para fotos, visitas y cierre en todo el sur de Florida.',
    },
    h1: { en: 'Cleaning for realtors and property managers', es: 'Limpieza para realtors y administradores de propiedades' },
    intro: {
      en: 'Clean sells. Have the listing ready before the photographer and the first showing.',
      es: 'Lo limpio vende. Ten la propiedad lista antes del fotógrafo y de la primera visita.',
    },
    points: [
      { en: 'Before photos and showings', es: 'Antes de fotos y visitas' },
      { en: 'Before closing or new tenants', es: 'Antes del cierre o de nuevos inquilinos' },
      { en: 'One contact for every property', es: 'Un solo contacto para todas tus propiedades' },
      { en: 'Recurring upkeep for vacant listings', es: 'Mantenimiento recurrente para propiedades vacías' },
    ],
    preset: { property: 'listing', service: 'recurring' },
    faq: [
      {
        q: { en: 'Do I need to be there?', es: '¿Tengo que estar presente?' },
        a: {
          en: 'Tell us how access works and we coordinate with you ahead of time.',
          es: 'Dinos cómo es el acceso y lo coordinamos contigo con anticipación.',
        },
      },
      {
        q: { en: 'Can you handle several properties?', es: '¿Pueden atender varias propiedades?' },
        a: {
          en: 'Yes. Send us your list and we plan the visits. We are a small team, so book ahead.',
          es: 'Sí. Envíanos tu lista y organizamos las visitas. Somos un equipo pequeño: reserva con tiempo.',
        },
      },
    ],
  },
  {
    id: 'construction',
    slug: { en: 'post-construction-cleaning', es: 'limpieza-post-construccion' },
    icon: 'helmet',
    tint: 'sand',
    name: { en: 'Post-construction', es: 'Post-construcción' },
    tagline: { en: 'Goodbye, fine dust.', es: 'Adiós, polvo fino.' },
    title: { en: 'Post-Construction Cleaning in South Florida | AJ Cleaning Home', es: 'Limpieza post-construcción en el sur de Florida | AJ Cleaning Home' },
    description: {
      en: 'Remodel finished? We clear the fine dust from surfaces, floors, cabinets and bathrooms so you can finally move back in.',
      es: '¿Terminó la remodelación? Quitamos el polvo fino de superficies, pisos, gabinetes y baños para que por fin puedas volver.',
    },
    h1: { en: 'Post-construction cleaning', es: 'Limpieza post-construcción' },
    intro: {
      en: 'The crew left. The dust stayed. We finish the job.',
      es: 'Los obreros se fueron. El polvo se quedó. Nosotros terminamos el trabajo.',
    },
    points: [
      { en: 'Fine dust on every surface', es: 'Polvo fino en cada superficie' },
      { en: 'Cabinets and fixtures', es: 'Gabinetes y accesorios' },
      { en: 'Bathrooms and kitchens', es: 'Baños y cocinas' },
      { en: 'Floors and baseboards', es: 'Pisos y rodapiés' },
    ],
    preset: { service: 'construction' },
    faq: [
      {
        q: { en: 'When should you come?', es: '¿Cuándo deben ir?' },
        a: {
          en: 'When the work is done and the debris is gone. Send photos and we confirm the price.',
          es: 'Cuando la obra termine y hayan retirado los escombros. Envía fotos y confirmamos el precio.',
        },
      },
      {
        q: { en: 'Does the price change?', es: '¿Cambia el precio?' },
        a: {
          en: 'It depends on the job. Send photos and we quote it before booking.',
          es: 'Depende del trabajo. Envía fotos y lo cotizamos antes de reservar.',
        },
      },
    ],
  },
  {
    id: 'laundry',
    slug: { en: 'in-home-laundry-service', es: 'lavanderia-a-domicilio' },
    icon: 'laundry',
    tint: 'mist',
    name: { en: 'In-home laundry', es: 'Lavandería a domicilio' },
    tagline: { en: 'One less chore.', es: 'Una tarea menos.' },
    title: { en: 'In-Home Laundry Service in Miami | AJ Cleaning Home', es: 'Lavandería a domicilio en Miami | AJ Cleaning Home' },
    description: {
      en: 'Wash, dry and organize, right at your home. Add laundry to any cleaning in South Florida.',
      es: 'Lavar, secar y organizar, en tu propia casa. Suma lavandería a cualquier limpieza en el sur de Florida.',
    },
    h1: { en: 'In-home laundry service', es: 'Lavandería a domicilio' },
    intro: {
      en: 'No pickup. No drop-off. Your laundry stays home and comes out folded.',
      es: 'Sin recoger ni llevar. Tu ropa no sale de casa y queda organizada.',
    },
    points: [
      { en: 'Wash', es: 'Lavar' },
      { en: 'Dry', es: 'Secar' },
      { en: 'Organize', es: 'Organizar' },
      { en: 'Done at your home', es: 'Se hace en tu casa' },
    ],
    preset: { service: 'laundry' },
    faq: [
      {
        q: { en: 'Do you take my clothes away?', es: '¿Se llevan mi ropa?' },
        a: { en: 'No. Everything happens at your home.', es: 'No. Todo se hace en tu casa.' },
      },
      {
        q: { en: 'Can I add it to my weekly plan?', es: '¿Puedo sumarla a mi plan semanal?' },
        a: { en: 'Yes. Tell us when we send your quote.', es: 'Sí. Dínoslo cuando te enviemos la cotización.' },
      },
    ],
  },
  {
    id: 'addons',
    slug: { en: 'windows-carpet-appliance-cleaning', es: 'ventanas-alfombras-electrodomesticos' },
    icon: 'window',
    tint: 'blush',
    name: { en: 'Windows, carpets & appliances', es: 'Ventanas, alfombras y electrodomésticos' },
    tagline: { en: 'The details people skip.', es: 'Los detalles que otros saltan.' },
    title: { en: 'Window, Carpet & Appliance Cleaning in Miami | AJ Cleaning Home', es: 'Ventanas, alfombras y electrodomésticos | AJ Cleaning Home' },
    description: {
      en: 'Oven, windows, cabinets, ceiling lights, fridge and carpets. Add any detail to your cleaning in South Florida. Get your free quote.',
      es: 'Horno, ventanas, gabinetes, lámparas, refrigerador y alfombras. Suma cualquier detalle a tu limpieza. Pide tu cotización gratis.',
    },
    h1: { en: 'Windows, carpets, appliances and more', es: 'Ventanas, alfombras, electrodomésticos y más' },
    intro: {
      en: 'Add just what you need. No surprises.',
      es: 'Suma solo lo que necesitas. Sin sorpresas.',
    },
    points: [
      { en: 'Deep oven clean', es: 'Limpieza profunda de horno' },
      { en: 'Windows', es: 'Ventanas' },
      { en: 'Inside kitchen cabinets', es: 'Interior de gabinetes de cocina' },
      { en: 'Ceiling lights', es: 'Lámparas de techo' },
      { en: 'Fridge, cleaned and organized', es: 'Refrigerador limpio y organizado' },
      { en: 'Furniture, vacuumed and deep cleaned', es: 'Muebles aspirados y a fondo' },
      { en: 'Carpets', es: 'Alfombras' },
    ],
    preset: { service: 'addons' },
    faq: [
      {
        q: { en: 'Can I book only an add-on?', es: '¿Puedo reservar solo un extra?' },
        a: {
          en: 'Message us on WhatsApp. Add-ons usually go with a cleaning visit.',
          es: 'Escríbenos por WhatsApp. Los extras normalmente van con una limpieza.',
        },
      },
      {
        q: { en: 'How much is carpet cleaning?', es: '¿Cuánto cuesta limpiar alfombras?' },
        a: {
          en: 'It depends on size and condition. Send us photos for a quote.',
          es: 'Depende del tamaño y el estado. Envíanos fotos para cotizar.',
        },
      },
    ],
  },
];

export const serviceUrl = (s: Service, lang: Lang) => `${routes.services[lang]}${s.slug[lang]}/`;
