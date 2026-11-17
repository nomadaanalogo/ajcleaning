# Formulario → hoja en Google Drive

Cada vez que alguien pide una cotización en la web:

1. Se agrega una fila en la hoja **Solicitudes**, en el Drive de la cuenta que instala el script.
2. El cliente recibe un correo de confirmación en su idioma.
3. AJ Cleaning Home recibe un aviso con los datos y un botón para abrir la hoja.

La columna **Estado** arranca en "Nuevo" y tiene lista desplegable: Contactado, Cotizado, Reservado, Recurrente, Perdido. La columna **Notas de seguimiento** es libre.

## Instalación (una sola vez, unos 5 minutos)

Hazlo con la cuenta de Google **de AJ Cleaning Home**: la hoja queda en su Drive y los correos salen desde esa cuenta.

1. Crea una hoja en [sheets.new](https://sheets.new) y llámala, por ejemplo, *Solicitudes AJ Cleaning Home*.
2. En la hoja, ve a **Extensiones → Apps Script**.
3. Borra lo que aparece en `Código.gs` y pega el contenido de [`Code.gs`](./Code.gs).
4. En `CONFIG`, escribe en `NOTIFY_EMAIL` el correo que recibirá los avisos.
5. Guarda.
6. **Autoriza los permisos:** arriba, elige la función `probarFormulario` y dale **Ejecutar**.
   - Dale **Revisar permisos → tu cuenta → Configuración avanzada → Ir a … (no seguro) → Permitir**. Sale como "no seguro" porque el script es propio y no está verificado por Google.
   - Revisa que se creó la pestaña **Solicitudes** con una fila de prueba y que llegaron los correos. Luego borra esa fila.
7. **Publica:** **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
   - Dale **Implementar** y copia la URL que termina en `/exec`.
8. Pon esa URL en `PUBLIC_FORM_ENDPOINT`, en el `.env` y en las variables de entorno del hosting, y vuelve a compilar el sitio.

Para comprobarlo, abre la URL `/exec` en el navegador. Debe decir *"AJ Cleaning Home · formulario activo ✔"*. Después envía una solicitud real desde la web.

## Protección contra bots

| Filtro | Qué hace |
|---|---|
| Campo trampa | Un campo invisible que solo llenan los bots. Se descarta en silencio. |
| Trampa de tiempo | Si alguien completa todo en menos de 4 segundos, se descarta en silencio. |
| Límite por hora | Máximo 30 solicitudes por hora en total (`MAX_PER_HOUR`). |
| Repetidos | El mismo correo solo se acepta una vez cada 10 minutos. |

Si ejecutas `probarFormulario` dos veces seguidas, la segunda no guarda fila por el filtro de repetidos.

## Si cambias el código después

**Implementar → Administrar implementaciones → Editar → Versión: Nueva versión → Implementar**. Así la URL `/exec` sigue siendo la misma.

## Límites

Una cuenta de Gmail gratuita envía unos **100 correos al día** desde Apps Script. Cada solicitud usa 2, o sea unas 50 solicitudes diarias. Si se pasa del límite, la solicitud igual queda guardada en la hoja.
