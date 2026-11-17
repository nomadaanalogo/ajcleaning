import type { L } from './i18n';

export type Faq = { q: L; a: L };

export const faqs: Faq[] = [
  {
    q: { en: 'How much does house cleaning cost?', es: '¿Cuánto cuesta limpiar una casa?' },
    a: {
      en: 'It depends on the property, the service and how often we come. Request your free quote and we send you the price.',
      es: 'Depende de la propiedad, el servicio y la frecuencia. Pide tu cotización gratis y te enviamos el precio.',
    },
  },
  {
    q: { en: 'Is weekly cleaning cheaper?', es: '¿La limpieza semanal sale más barata?' },
    a: {
      en: 'Yes. The more often we come, the less each visit costs. Weekly is our lowest price per visit.',
      es: 'Sí. Mientras más seguido vamos, menos cuesta cada visita. La semanal es nuestro precio más bajo por visita.',
    },
  },
  {
    q: { en: 'How do I book?', es: '¿Cómo reservo?' },
    a: {
      en: 'Request your quote. We send you the price. Pay a 25% deposit before the service day. That holds your spot.',
      es: 'Pide tu cotización. Te enviamos el precio. Paga el 25% antes del día del servicio. Con eso apartas tu cupo.',
    },
  },
  {
    q: { en: 'How can I pay?', es: '¿Cómo puedo pagar?' },
    a: { en: 'Zelle or direct bank transfer.', es: 'Zelle o transferencia directa.' },
  },
  {
    q: { en: 'Do you bring your own supplies?', es: '¿Llevan sus propios productos?' },
    a: {
      en: 'Yes. Prefer your own products? We can use those too.',
      es: 'Sí. ¿Prefieres tus productos? También podemos usarlos.',
    },
  },
  {
    q: { en: 'Can you adapt to kids, pets or allergies?', es: '¿Se adaptan a niños, mascotas o alergias?' },
    a: {
      en: 'Yes. We use standard products and adapt to each client. Tell us what you need.',
      es: 'Sí. Usamos productos normales y nos adaptamos a cada cliente. Cuéntanos qué necesitas.',
    },
  },
  {
    q: { en: 'Do you wash dishes?', es: '¿Lavan los platos?' },
    a: {
      en: 'Not dirty dishes. It protects your belongings and avoids any issue.',
      es: 'Platos sucios, no. Así cuidamos tus pertenencias y evitamos inconvenientes.',
    },
  },
  {
    q: { en: 'What are your hours?', es: '¿Cuál es el horario?' },
    a: {
      en: 'Monday to Friday, 8 am to 5 pm. We can adapt to your schedule. Please book ahead.',
      es: 'Lunes a viernes, de 8 am a 5 pm. Podemos adaptarnos a tu horario. Reserva con anticipación.',
    },
  },
  {
    q: { en: 'Where do you clean?', es: '¿Dónde limpian?' },
    a: {
      en: 'Across Florida, including Fort Lauderdale, Hollywood, Aventura, North Miami, Miami Beach, Brickell, Coconut Grove, Miami Lakes, Hialeah Gardens, Kendall and Homestead.',
      es: 'En toda Florida, incluyendo Fort Lauderdale, Hollywood, Aventura, North Miami, Miami Beach, Brickell, Coconut Grove, Miami Lakes, Hialeah Gardens, Kendall y Homestead.',
    },
  },
  {
    q: { en: 'How does the laundry service work?', es: '¿Cómo funciona la lavandería?' },
    a: {
      en: 'We do it at your home: wash, dry and organize.',
      es: 'La hacemos en tu casa: lavar, secar y organizar.',
    },
  },
];

export const faqSchema = (list: Faq[], lang: 'en' | 'es') => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: list.map((f) => ({
    '@type': 'Question',
    name: f.q[lang],
    acceptedAnswer: { '@type': 'Answer', text: f.a[lang] },
  })),
});
