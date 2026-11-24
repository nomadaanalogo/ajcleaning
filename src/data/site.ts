/** Datos del negocio. Lo que está vacío no se publica en la página ni en el schema. */
/** URL /exec del Apps Script instalado en la cuenta de AJ. PUBLIC_FORM_ENDPOINT la reemplaza si está definida. */
export const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx_Y2RBnWmf1KJgIuNn08P-zUaQn91v0q319a55bRi1rKWU5X01YUGXC1Z5AiC7vWmB/exec';

export const site = {
  name: 'AJ Cleaning Home',
  // Número con código de país, solo dígitos. El cliente indicó que WhatsApp y llamadas usan el mismo número.
  whatsapp: '13056804609',
  // Formato E.164 para enlaces tel: y el schema; phoneDisplay es como se lee en la página.
  phone: '+13056804609',
  phoneDisplay: '(305) 680-4609',
  email: 'ajcleaninghome@gmail.com',
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
