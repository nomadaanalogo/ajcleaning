/**
 * Contenido SEO adicional por servicio, a partir del análisis de competidores locales
 * que rankean en Miami (noviembre 2026): "para quién es", por qué importa en el clima
 * del sur de Florida y las preguntas que la gente busca. Frases cortas, sin precios.
 * Nada de esto promete algo que el negocio no haya confirmado.
 */
import type { L } from './i18n';
import type { Faq } from './faq';

export type ServiceExtra = { bestFor: L[]; local: L[]; faq: Faq[] };

/** Preguntas que casi todos los competidores responden. Se suman a cada servicio. */
export const sharedServiceFaq: Faq[] = [
  {
    q: { en: 'Do I need to be home during the cleaning?', es: '¿Tengo que estar en casa durante la limpieza?' },
    a: {
      en: 'No. Many clients leave us a key, a door code or front-desk access. Just tell us how to get in safely.',
      es: 'No. Muchos clientes nos dejan una llave, un código o acceso por la recepción. Solo dinos cómo entrar de forma segura.',
    },
  },
  {
    q: { en: 'Do you bring your own cleaning supplies?', es: '¿Llevan sus propios productos de limpieza?' },
    a: {
      en: 'Yes, we bring ours. Prefer your own products? We can use those too.',
      es: 'Sí, llevamos los nuestros. ¿Prefieres tus productos? También podemos usarlos.',
    },
  },
  {
    q: { en: 'How fast can I get my quote?', es: '¿Qué tan rápido recibo mi cotización?' },
    a: {
      en: 'The form takes about two minutes. We review your request and send your quote. Need it sooner? Call or text (305) 680-4609.',
      es: 'El formulario toma unos dos minutos. Revisamos tu solicitud y te enviamos la cotización. ¿La necesitas antes? Llama o escribe al (305) 680-4609.',
    },
  },
];

export const serviceExtras: Record<string, ServiceExtra> = {
  recurring: {
    bestFor: [
      { en: 'Busy families and working parents', es: 'Familias ocupadas y padres que trabajan' },
      { en: 'Homes with kids or pets', es: 'Casas con niños o mascotas' },
      { en: 'Anyone who wants weekends back', es: 'Quien quiere recuperar sus fines de semana' },
      { en: 'Seasonal residents who want to come back to a ready home', es: 'Residentes de temporada que quieren volver a una casa lista' },
    ],
    local: [
      { en: 'Humidity brings mildew to bathrooms fast. Regular visits stop it early.', es: 'La humedad trae moho a los baños muy rápido. Las visitas regulares lo frenan a tiempo.' },
      { en: 'Sand, pollen and summer Saharan dust come in every day.', es: 'Arena, polen y el polvo del Sahara en verano entran todos los días.' },
      { en: 'Rainy season means more mud by the door. A set schedule keeps floors in check.', es: 'En temporada de lluvias entra más barro. Un horario fijo mantiene los pisos al día.' },
    ],
    faq: [
      {
        q: { en: 'Do I need a deep clean before starting a recurring plan?', es: '¿Necesito una limpieza profunda antes de empezar un plan recurrente?' },
        a: {
          en: 'Only if the home has not been cleaned in a while. If it needs it, we tell you in your quote. Then regular visits keep it there.',
          es: 'Solo si la casa lleva tiempo sin limpiarse. Si lo necesita, te lo decimos en la cotización. Después, las visitas regulares la mantienen.',
        },
      },
      {
        q: { en: 'Am I locked into a contract?', es: '¿Tengo que firmar un contrato?' },
        a: {
          en: 'No. You can pause or end your plan by telling us before the next visit.',
          es: 'No. Puedes pausar o terminar tu plan avisándonos antes de la siguiente visita.',
        },
      },
      {
        q: { en: 'Will the same people clean my home?', es: '¿Me limpian siempre las mismas personas?' },
        a: {
          en: 'Yes. We are a small team, so you see the same faces. They learn how you like your home.',
          es: 'Sí. Somos un equipo pequeño, así que ves las mismas caras. Aprenden cómo te gusta tu casa.',
        },
      },
      {
        q: { en: 'How is recurring cleaning different from a one-time clean?', es: '¿En qué se diferencia de una limpieza de una vez?' },
        a: {
          en: 'A one-time clean resets the home once. A recurring plan keeps it clean all the time, at a lower price per visit.',
          es: 'Una limpieza de una vez deja la casa bien una vez. Un plan recurrente la mantiene limpia siempre, con menor precio por visita.',
        },
      },
    ],
  },
  deep: {
    bestFor: [
      { en: 'Homes that have not been cleaned in a while', es: 'Casas que llevan tiempo sin limpiarse' },
      { en: 'The first visit before a recurring plan', es: 'La primera visita antes de un plan recurrente' },
      { en: 'Before the holidays or family visits', es: 'Antes de las fiestas o de visitas familiares' },
      { en: 'After a long season away', es: 'Después de una temporada fuera' },
    ],
    local: [
      { en: 'Humidity leaves buildup on grout, showers and AC vents.', es: 'La humedad deja suciedad en las juntas, las duchas y las rejillas del aire.' },
      { en: 'Salt air clouds windows and fixtures near the coast.', es: 'La brisa salada empaña ventanas y grifería cerca de la costa.' },
      { en: 'Ceiling fans and blinds collect dust all year.', es: 'Los ventiladores de techo y las persianas juntan polvo todo el año.' },
    ],
    faq: [
      {
        q: { en: 'What is the difference between deep and regular cleaning?', es: '¿Qué diferencia hay entre limpieza profunda y regular?' },
        a: {
          en: 'Regular cleaning keeps a home clean. Deep cleaning goes further: baseboards, buildup, corners and the details that pile up over time.',
          es: 'La limpieza regular mantiene la casa limpia. La profunda va más allá: rodapiés, suciedad acumulada, esquinas y los detalles que se juntan con el tiempo.',
        },
      },
      {
        q: { en: 'How long does a deep clean take?', es: '¿Cuánto dura una limpieza profunda?' },
        a: {
          en: 'It depends on the size and condition of the home. We tell you what to expect in your quote.',
          es: 'Depende del tamaño y el estado de la casa. Te decimos qué esperar en tu cotización.',
        },
      },
      {
        q: { en: 'How often should I get a deep clean?', es: '¿Cada cuánto conviene una limpieza profunda?' },
        a: {
          en: 'Once to reset the home, then a recurring plan keeps it there. Some clients add a deep clean once or twice a year.',
          es: 'Una vez para dejar la casa al día y luego un plan recurrente la mantiene. Algunos clientes suman una profunda una o dos veces al año.',
        },
      },
    ],
  },
  move: {
    bestFor: [
      { en: 'Renters who want their deposit back', es: 'Inquilinos que quieren recuperar su depósito' },
      { en: 'Owners getting a home ready for new tenants', es: 'Dueños que preparan la casa para nuevos inquilinos' },
      { en: 'Families moving into a new home', es: 'Familias que se mudan a una casa nueva' },
      { en: 'Realtors before closing day', es: 'Realtors antes del día de cierre' },
    ],
    local: [
      { en: 'Moves pick up in summer, when humidity hits empty homes hard.', es: 'Las mudanzas suben en verano, cuando la humedad golpea más a las casas vacías.' },
      { en: 'Closed-up homes get musty fast. We air out and clean every room.', es: 'Las casas cerradas huelen a humedad rápido. Limpiamos cada cuarto a fondo.' },
      { en: 'Condo buildings have move rules. We work around them.', es: 'Los edificios tienen reglas de mudanza. Nos ajustamos a ellas.' },
    ],
    faq: [
      {
        q: { en: 'Do you clean inside cabinets and appliances?', es: '¿Limpian dentro de gabinetes y electrodomésticos?' },
        a: {
          en: 'Inside cabinets, yes, when the home is empty. Inside the fridge and oven can be added. Tell us in the form.',
          es: 'Dentro de los gabinetes sí, con la casa vacía. Dentro de la nevera y el horno se puede agregar. Indícalo en el formulario.',
        },
      },
      {
        q: { en: 'Can you clean the same day the movers leave?', es: '¿Pueden limpiar el mismo día que salen los de la mudanza?' },
        a: {
          en: 'Often, yes. Book ahead and tell us your move date.',
          es: 'Muchas veces sí. Reserva con anticipación y dinos la fecha de tu mudanza.',
        },
      },
    ],
  },
  airbnb: {
    bestFor: [
      { en: 'Airbnb and Vrbo hosts', es: 'Anfitriones de Airbnb y Vrbo' },
      { en: 'Property managers with several units', es: 'Administradores con varias unidades' },
      { en: 'Owners who rent part of the year', es: 'Dueños que rentan parte del año' },
      { en: 'Short stays with tight check-outs', es: 'Estadías cortas con check-outs ajustados' },
    ],
    local: [
      { en: 'Beach sand comes in with every guest.', es: 'La arena de playa entra con cada huésped.' },
      { en: 'High season brings back-to-back stays. A set schedule keeps up.', es: 'La temporada alta trae estadías seguidas. Un horario fijo mantiene el ritmo.' },
      { en: 'Guests notice humidity and smells first. We keep the unit fresh.', es: 'Los huéspedes notan primero la humedad y los olores. Mantenemos la unidad fresca.' },
    ],
    faq: [
      {
        q: { en: 'Do you restock supplies for guests?', es: '¿Reponen los artículos para huéspedes?' },
        a: {
          en: 'We can set out the supplies you leave for us. Tell us your checklist and we follow it.',
          es: 'Podemos poner los artículos que nos dejes. Dinos tu lista y la seguimos.',
        },
      },
      {
        q: { en: 'Can you clean several units?', es: '¿Pueden limpiar varias unidades?' },
        a: {
          en: 'Yes. Tell us how many units and how often, and we plan a schedule.',
          es: 'Sí. Dinos cuántas unidades y con qué frecuencia, y armamos el horario.',
        },
      },
    ],
  },
  office: {
    bestFor: [
      { en: 'Small offices and studios', es: 'Oficinas pequeñas y estudios' },
      { en: 'Clinics and professional practices', es: 'Consultorios y oficinas profesionales' },
      { en: 'Shared workspaces', es: 'Espacios de trabajo compartidos' },
      { en: 'Businesses that want a weekly routine', es: 'Negocios que quieren una rutina semanal' },
    ],
    local: [
      { en: 'AC runs all year and spreads dust. Regular visits keep desks clean.', es: 'El aire acondicionado funciona todo el año y riega polvo. Las visitas regulares mantienen los escritorios limpios.' },
      { en: 'Rainy days mean wet floors at the entrance.', es: 'Los días de lluvia dejan pisos mojados en la entrada.' },
      { en: 'Kitchens and bathrooms need extra care in the heat.', es: 'Cocinas y baños necesitan más cuidado con el calor.' },
    ],
    faq: [
      {
        q: { en: 'Do you clean on a fixed day each week?', es: '¿Limpian un día fijo cada semana?' },
        a: {
          en: 'Yes. Pick the day and frequency that work for your business.',
          es: 'Sí. Elige el día y la frecuencia que le sirvan a tu negocio.',
        },
      },
    ],
  },
  realtor: {
    bestFor: [
      { en: 'Listings before photos and showings', es: 'Propiedades antes de fotos y visitas' },
      { en: 'Closing day', es: 'El día del cierre' },
      { en: 'Rentals between tenants', es: 'Rentas entre inquilinos' },
      { en: 'Property managers with several homes', es: 'Administradores con varias propiedades' },
    ],
    local: [
      { en: 'Bright Florida light shows every streak in photos.', es: 'La luz de Florida muestra cada mancha en las fotos.' },
      { en: 'Empty homes collect dust and humidity smells fast.', es: 'Las casas vacías juntan polvo y olor a humedad rápido.' },
      { en: 'We work with lockboxes and building rules.', es: 'Trabajamos con lockbox y reglas de edificio.' },
    ],
    faq: [
      {
        q: { en: 'Can you work with a lockbox?', es: '¿Pueden trabajar con lockbox?' },
        a: {
          en: 'Yes. Send us the access details and we take it from there.',
          es: 'Sí. Envíanos los datos de acceso y nos encargamos.',
        },
      },
    ],
  },
  construction: {
    bestFor: [
      { en: 'Homes after a remodel', es: 'Casas después de una remodelación' },
      { en: 'New construction before move-in', es: 'Construcción nueva antes de mudarse' },
      { en: 'Kitchen and bathroom renovations', es: 'Remodelaciones de cocina y baño' },
      { en: 'Contractors who need a clean handover', es: 'Contratistas que entregan la obra limpia' },
    ],
    local: [
      { en: 'Fine dust spreads through the AC. We clean vents and surfaces.', es: 'El polvo fino se riega por el aire acondicionado. Limpiamos rejillas y superficies.' },
      { en: 'Hurricane window and door upgrades leave dust in every room.', es: 'El cambio de ventanas y puertas para huracanes deja polvo en cada cuarto.' },
      { en: 'Humidity makes dust stick. It takes more than one pass.', es: 'La humedad hace que el polvo se pegue. Hace falta más de una pasada.' },
    ],
    faq: [
      {
        q: { en: 'Do you remove construction debris?', es: '¿Retiran los escombros de la obra?' },
        a: {
          en: 'No. We clean after the debris is gone: dust, surfaces, floors, cabinets and bathrooms.',
          es: 'No. Limpiamos después de que se retiran los escombros: polvo, superficies, pisos, gabinetes y baños.',
        },
      },
    ],
  },
  laundry: {
    bestFor: [
      { en: 'Busy families with lots of laundry', es: 'Familias ocupadas con mucha ropa' },
      { en: 'Airbnb hosts who need sheets and towels done', es: 'Anfitriones que necesitan sábanas y toallas listas' },
      { en: 'Seniors who want a hand at home', es: 'Personas mayores que quieren ayuda en casa' },
      { en: 'Anyone adding it to a weekly plan', es: 'Quien la suma a su plan semanal' },
    ],
    local: [
      { en: 'Humidity makes damp laundry smell. We wash and dry it the same day.', es: 'La humedad hace que la ropa húmeda huela mal. La lavamos y secamos el mismo día.' },
      { en: 'Beach towels and sandy clothes, handled.', es: 'Toallas de playa y ropa con arena, resuelto.' },
      { en: 'Everything stays in your home.', es: 'Todo se queda en tu casa.' },
    ],
    faq: [],
  },
  addons: {
    bestFor: [
      { en: 'Adding detail to any cleaning', es: 'Sumar detalle a cualquier limpieza' },
      { en: 'Before guests or the holidays', es: 'Antes de visitas o de las fiestas' },
      { en: 'Move-ins and move-outs', es: 'Mudanzas de entrada y salida' },
      { en: 'Spring cleaning, any time of year', es: 'Una limpieza a fondo, en cualquier época' },
    ],
    local: [
      { en: 'Salt air and rain leave spots on windows near the coast.', es: 'La brisa salada y la lluvia dejan manchas en las ventanas cerca de la costa.' },
      { en: 'Carpets hold humidity and sand.', es: 'Las alfombras guardan humedad y arena.' },
      { en: 'Fridges and ovens work harder in the heat.', es: 'Neveras y hornos trabajan más con el calor.' },
    ],
    faq: [],
  },
};
