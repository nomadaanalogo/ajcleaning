/** Datos del negocio. Lo que está vacío no se publica en la página ni en el schema. */
export const site = {
  name: 'AJ Cleaning Home',
  // Número con código de país, solo dígitos. El cliente indicó que WhatsApp y llamadas usan el mismo número.
  whatsapp: '13056804609',
  // Formato E.164 para enlaces tel: y el schema; phoneDisplay es como se lee en la página.
  phone: '+13056804609',
  phoneDisplay: '(305) 680-4609',
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
