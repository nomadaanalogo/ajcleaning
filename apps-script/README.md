# Formulario → hoja en Google Drive

Cada vez que alguien pide una cotización en la web:

1. Se agrega una fila en la hoja **Solicitudes**, en el Drive de la cuenta que instala el script.
2. El cliente recibe un correo de confirmación en su idioma.
3. AJ Cleaning Home recibe un aviso con los datos y un botón para abrir la hoja.

Columnas: Fecha, Nombre, Correo, Teléfono (opcional), Dirección, Propiedad, Tamaño, Habitaciones, Baños, Frecuencia, Tipo de limpieza, Extras, Autorización de contacto, Zona, Idioma, Página, Estado y Notas de seguimiento.

La columna **Estado** arranca en "Nuevo" y tiene lista desplegable: Contactado, Cotizado, Reservado, Recurrente, Perdido. Las solicitudes sospechosas llegan como **"Revisar"** y no reciben correo automático: míralas antes de contactar. La columna **Notas de seguimiento** es libre.

La **Autorización de contacto** queda registrada en cada fila: la web no deja enviar sin marcar la casilla, y el script rechaza envíos sin ella.

## Instalación (una sola vez, unos 5 minutos)

Hazlo con la cuenta de Google **de AJ Cleaning Home**: la hoja queda en su Drive y los correos salen desde esa cuenta.

1. Crea una hoja en [sheets.new](https://sheets.new) y llámala, por ejemplo, *Solicitudes AJ Cleaning Home*.
2. En la hoja, ve a **Extensiones → Apps Script**.
3. Borra lo que aparece en `Código.gs` y pega el contenido de [`Code.gs`](./Code.gs).
4. En `CONFIG`, escribe en `NOTIFY_EMAIL` el correo que recibirá los avisos.
5. Guarda.
6. **Autoriza los permisos:** arriba, elige la función `probarFormulario` y dale **Ejecutar**. Tarda unos 5 segundos porque resuelve la verificación antirobots como lo haría la web.
   - Dale **Revisar permisos → tu cuenta → Configuración avanzada → Ir a … (no seguro) → Permitir**. Sale como "no seguro" porque el script es propio y no está verificado por Google.
   - Revisa que se creó la pestaña **Solicitudes** con una fila de prueba y que llegaron los correos. Luego borra esa fila.
7. **Publica:** **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
   - Dale **Implementar** y copia la URL que termina en `/exec`.
8. Pon esa URL en `PUBLIC_FORM_ENDPOINT`, en el `.env` y en las variables de entorno del hosting, y vuelve a compilar el sitio.

Para comprobarlo, abre la URL `/exec` en el navegador. Debe decir *"AJ Cleaning Home · formulario activo ✔"*. Después envía una solicitud real desde la web.

## Protección contra robots

Todo es propio: no usa servicios de terceros ni cookies. A los robots se les responde "ok" para no darles pistas.

| Filtro | Qué hace |
|---|---|
| Campo trampa | Un campo invisible que solo llenan los robots. Se descarta. |
| Reto firmado | La web pide al script un reto con la hora, firmado con una clave secreta. Sin reto válido, se descarta. Cada reto sirve una sola vez y vence a las 3 horas. |
| Trampa de tiempo | Si pasan menos de 4 segundos entre el reto y el envío, se descarta. La hora la pone el script, así que no se puede falsear. |
| Prueba de trabajo | El navegador resuelve un cálculo SHA-256 con el reto (menos de un segundo). A un robot que envía miles le sale caro. |
| Autorización | Sin la casilla marcada, se rechaza. |
| Enlaces | Un nombre, dirección o teléfono con enlaces se descarta. |
| Respuestas raras | Si las opciones no coinciden con las de la web, o el nombre no está en alfabeto latino, la fila queda en **"Revisar"** y no se envía correo automático. |
| Límite por hora | Máximo 30 solicitudes por hora en total (`MAX_PER_HOUR`) y 120 retos por minuto. |
| Repetidos | El mismo correo: una vez cada 10 minutos y máximo 3 cada 6 horas. |
| Correo automático | Una sola respuesta automática por correo cada 6 horas: nadie puede usar el formulario para llenarle el buzón a otra persona. |

La clave secreta se crea sola la primera vez (**Configuración del proyecto → Propiedades del script → `SECRETO_RETOS`**). No la compartas. Si la borras, se crea otra.

Si ejecutas `probarFormulario` dos veces seguidas, la segunda no guarda fila por el filtro de repetidos.

**Si cambias las opciones del formulario** (por ejemplo, agregas un tipo de propiedad), agrégalas también en `ALLOWED` dentro de `Code.gs`. Si no, esas solicitudes llegan como "Revisar" (no se pierden).

**Si algún día llega mucho spam igual**, el siguiente paso es Cloudflare Turnstile (gratis): un verificador invisible de Cloudflare.

## Si cambias el código después

**Implementar → Administrar implementaciones → Editar → Versión: Nueva versión → Implementar**. Así la URL `/exec` sigue siendo la misma.

## Límites

Una cuenta de Gmail gratuita envía unos **100 correos al día** desde Apps Script. Cada solicitud usa 2, o sea unas 50 solicitudes diarias. Si se pasa del límite, la solicitud igual queda guardada en la hoja.
