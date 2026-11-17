/** Datos del negocio. Lo que está vacío no se publica en la página ni en el schema. */
export const site = {
  name: 'AJ Cleaning Home',
  // PENDIENTE: número con código de país, solo dígitos. Ej: 13055550123
  whatsapp: '',
  // PENDIENTE: el formulario dice que es el mismo número para llamadas.
  phone: '',
  email: '',
  social: { instagram: '', facebook: '' },
  yearsInBusiness: 2,
  teamSize: 2,
  hoursSchema: 'Mo-Fr 08:00-17:00',
};

/**
 * Sin número configurado, wa.me abre WhatsApp y el usuario elige el contacto.
 * Sirve para probar, pero hay que poner el número antes de publicar.
 */
export function whatsappUrl(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
