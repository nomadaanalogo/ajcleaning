# AJ Cleaning Home

Sitio en [Astro](https://astro.build), en inglés con versión en español en `/es/`. Objetivo principal: conseguir limpiezas recurrentes. El sitio no publica precios a propósito: la gente pide cotización y el negocio responde.

## Comandos

| Comando           | Acción                                    |
| ----------------- | ----------------------------------------- |
| `npm install`     | Instala dependencias                      |
| `npm run dev`     | Servidor local en `http://localhost:4321` |
| `npm run build`   | Genera el sitio estático en `dist/`       |
| `npm run preview` | Previsualiza la versión de producción     |

## Dónde se edita cada cosa

- **WhatsApp, teléfono, correo, redes:** `src/data/site.ts`
- **Formulario de cotización:** `src/components/QuoteWizard.astro` y `src/scripts/wizard.ts`
- **Hoja de Drive para el seguimiento:** `apps-script/`
- **Planes (sin precios):** `src/data/plans.ts`
- **Servicios (EN y ES):** `src/data/services.ts`
- **Ciudades (EN y ES):** `src/data/areas.ts`
- **Lista de qué incluye cada cuarto:** `src/data/rooms.ts`
- **Preguntas frecuentes:** `src/data/faq.ts`
- **Textos de botones y menú:** `src/data/i18n.ts`
- **Dominio:** `astro.config.mjs` y `public/robots.txt`
- **Fotos:** `src/assets/photos/` y sus textos alternativos en `src/lib/photos.ts`
- **Logo, favicons e imagen para redes:** `node scripts/make-brand.mjs ruta/al/logo.png`

## Configuración (`.env`)

Copie `.env.example` a `.env`:

- `PUBLIC_GA_ID`: ID de Google Analytics 4. Registra `generate_lead`, `whatsapp_click` y `cta_click`.
- `PUBLIC_FORM_ENDPOINT`: URL `/exec` de Apps Script. Si está vacía, el formulario no envía y ofrece WhatsApp.

## Pendientes antes de publicar

**Sin esto no se puede publicar**

- [ ] Confirmar que el (305) 680-4609 tiene WhatsApp. Está puesto para llamadas y WhatsApp en `src/data/site.ts`.
- [ ] Dominio real en `astro.config.mjs` y `public/robots.txt`. El actual es un supuesto.
- [ ] Instalar la hoja de Drive con la cuenta de Google de AJ (`apps-script/README.md`) y poner la URL en `PUBLIC_FORM_ENDPOINT`. Sin esto, las solicitudes no se guardan.
- [ ] Correo que recibe los avisos: `NOTIFY_EMAIL` en `apps-script/Code.gs`.
- [ ] Revisión de abogado de los términos y condiciones.
- [ ] Que el negocio confirme los plazos que fijan los términos: daños avisados dentro de 48 horas, cotizaciones válidas 30 días y devolución de la visita si AJ reprograma y el cliente no acepta la nueva fecha.

**Contenido que el negocio debe enviar o aprobar**

- [ ] Qué incluye cada servicio. Solo la lista por cuarto es real; los puntos de profunda, mudanza, post-construcción, Airbnb, oficinas y realtors son un borrador.
- [ ] Si cobran recargo por distancia o a qué distancia llegan.
- [ ] Política de cancelación y reembolso del depósito. Los términos dicen que se acuerdan al confirmar cada reserva.
- [ ] Fotos reales del equipo y de antes y después. Las actuales son de archivo (origen en `src/assets/photos/CREDITS.md`): sirven de ambiente, no deben presentarse como trabajos de AJ.
- [ ] Verificar a mano la licencia de las fotos de rawpixel y StockSnap: sus páginas bloquean la verificación automática.
- [ ] Reseñas reales. No hay sección de reseñas ni estrellas en el schema hasta tenerlas.
- [ ] Revisión de la política de privacidad.

**Después de publicar**

- [ ] Alta en Google Search Console y envío de `sitemap-index.xml`.
- [ ] Perfil de Empresa en Google como negocio de área de servicio (sin dirección pública). Es lo que más pesa en búsquedas locales.
- [ ] Pedir reseñas en Google a cada cliente.
- [ ] Activar Google Analytics con `PUBLIC_GA_ID`.
