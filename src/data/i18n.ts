export type Lang = 'en' | 'es';
export type L = Record<Lang, string>;

export const routes = {
  home: { en: '/', es: '/es/' },
  services: { en: '/services/', es: '/es/servicios/' },
  areas: { en: '/areas/', es: '/es/zonas/' },
  privacy: { en: '/privacy-policy/', es: '/es/politica-de-privacidad/' },
  terms: { en: '/terms-and-conditions/', es: '/es/terminos-y-condiciones/' },
} satisfies Record<string, L>;

export const quoteHref = (lang: Lang) => `${routes.home[lang]}#quote`;

export const ui = {
  nav: {
    services: { en: 'Services', es: 'Servicios' },
    areas: { en: 'Areas', es: 'Zonas' },
    faq: { en: 'FAQ', es: 'Preguntas' },
    quote: { en: 'Free quote', es: 'Cotizar gratis' },
    menu: { en: 'Menu', es: 'Menú' },
    skip: { en: 'Skip to content', es: 'Saltar al contenido' },
    home: { en: 'Home', es: 'Inicio' },
    langName: { en: 'Español', es: 'English' },
    langShort: { en: 'ES', es: 'EN' },
    langLabel: { en: 'Ver en español', es: 'View in English' },
  },
  frequency: {
    weekly: { en: 'Weekly', es: 'Semanal' },
    biweekly: { en: 'Every 2 weeks', es: 'Cada 2 semanas' },
    triweekly: { en: 'Every 3 weeks', es: 'Cada 3 semanas' },
    once: { en: 'One time', es: 'Una sola vez' },
  },
  property: {
    house: { en: 'House', es: 'Casa' },
    apartment: { en: 'Apartment', es: 'Apartamento' },
    airbnb: { en: 'Airbnb', es: 'Airbnb' },
    office: { en: 'Office', es: 'Oficina' },
    listing: { en: 'Listing', es: 'Propiedad en venta' },
  },
  propertyHint: {
    house: { en: 'Family home', es: 'Hogar familiar' },
    apartment: { en: 'Condo or apartment', es: 'Condo o apartamento' },
    airbnb: { en: 'Vacation rental', es: 'Renta vacacional' },
    office: { en: 'Workplace', es: 'Lugar de trabajo' },
    listing: { en: 'For realtors', es: 'Para realtors' },
  },
  serviceType: {
    recurring: { en: 'Recurring cleaning', es: 'Limpieza recurrente' },
    once: { en: 'One-time cleaning', es: 'Limpieza de una vez' },
    deep: { en: 'Deep cleaning', es: 'Limpieza profunda' },
    move: { en: 'Move in / move out', es: 'Mudanza' },
    construction: { en: 'Post-construction', es: 'Post-construcción' },
    laundry: { en: 'In-home laundry', es: 'Lavandería a domicilio' },
    addons: { en: 'Windows, carpets, appliances', es: 'Ventanas, alfombras, electrodomésticos' },
  },
  serviceTypeHint: {
    recurring: { en: 'We come on a set schedule. Your home stays ready.', es: 'Vamos en un horario fijo. Tu casa se mantiene lista.' },
    once: { en: 'A single visit', es: 'Una sola visita' },
    deep: { en: 'First time or long overdue', es: 'Primera vez o hace mucho' },
    move: { en: 'Empty and ready', es: 'Vacía y lista' },
    construction: { en: 'After the dust settles', es: 'Cuando el polvo baja' },
    laundry: { en: 'Wash, dry, organize', es: 'Lavar, secar, organizar' },
    addons: { en: 'The details people skip', es: 'Los detalles que otros saltan' },
  },
  extras: {
    fridge: { en: 'Fridge, cleaned and organized', es: 'Refrigerador limpio y organizado' },
    oven: { en: 'Deep oven clean', es: 'Limpieza profunda de horno' },
    windows: { en: 'Windows', es: 'Ventanas' },
    lights: { en: 'Ceiling lights', es: 'Lámparas de techo' },
    upholstery: { en: 'Furniture, vacuumed and deep cleaned', es: 'Muebles aspirados y a fondo' },
    cabinets: { en: 'Inside kitchen cabinets', es: 'Interior de gabinetes de cocina' },
    laundry: { en: 'Laundry: wash, dry, organize', es: 'Lavandería: lavar, secar, organizar' },
  },
  common: {
    recommended: { en: 'Recommended', es: 'Recomendado' },
    visits: { en: 'visits a year', es: 'visitas al año' },
    getQuote: { en: 'Get a free quote', es: 'Pide tu cotización gratis' },
    whatsapp: { en: 'Message us on WhatsApp', es: 'Escríbenos por WhatsApp' },
    waFloat: { en: 'Chat on WhatsApp', es: 'Chatear por WhatsApp' },
    waHello: { en: 'Hi AJ Cleaning Home! I would like a cleaning quote.', es: '¡Hola AJ Cleaning Home! Quiero cotizar una limpieza.' },
    learnMore: { en: 'See service', es: 'Ver servicio' },
    allServices: { en: 'All services', es: 'Todos los servicios' },
    allAreas: { en: 'All areas', es: 'Todas las zonas' },
  },
} as const;
