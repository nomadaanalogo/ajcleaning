/**
 * AJ Cleaning Home · Solicitudes de cotización
 *
 * Recibe el formulario de la web, guarda cada solicitud en esta hoja de cálculo
 * (queda en el Drive de quien la instala) y envía dos correos:
 *   1. Respuesta automática al cliente, en su idioma.
 *   2. Aviso a AJ Cleaning Home con los datos.
 *
 * Protección contra robots, en capas:
 *   - Campo trampa invisible (los robots lo llenan).
 *   - Reto firmado por este script: la web lo pide al empezar y lo devuelve al enviar.
 *     Lleva la hora, así sabemos cuánto tardó la persona, y solo sirve una vez.
 *   - Prueba de trabajo: el navegador tiene que resolver un cálculo (SHA-256) con el reto.
 *     A una persona le toma menos de un segundo; a un robot que envía miles, mucho.
 *   - Límites: por hora en total, por correo y por día, y una sola respuesta automática
 *     por correo cada 6 horas (así nadie usa el formulario para llenar el buzón de otro).
 *   - Filtros de contenido: enlaces en el nombre o la dirección se descartan; respuestas
 *     que no coinciden con las opciones de la web quedan en estado "Revisar", sin correo automático.
 *
 * Instalación: ver apps-script/README.md
 */

// ---------- Configuración ----------
const CONFIG = {
  BUSINESS_NAME: "AJ Cleaning Home",
  // Correo de AJ Cleaning Home que recibe los avisos y las respuestas de los clientes.
  NOTIFY_EMAIL: "ajcleaninghome@gmail.com",
  SHEET_NAME: "Solicitudes",

  // Datos que salen en el correo al cliente.
  PHONE: "+13056804609", // Para el botón de llamar.
  PHONE_DISPLAY: "(305) 680-4609",
  WHATSAPP: "13056804609", // Solo dígitos, con código de país.
  // PENDIENTE: dominio definitivo. Vacío = el pie del correo no muestra el enlace al sitio.
  SITE_URL: "",
  // PENDIENTE: URL pública del logo (por ejemplo SITE_URL + "/brand/logo-160.webp" ya publicado,
  // o mejor un PNG, que se ve en más programas de correo). Vacío = el encabezado muestra el nombre en texto.
  LOGO_URL: "",

  // Anti-robots
  MIN_FILL_MS: 4000, // Envíos más rápidos que esto (desde que se pidió el reto) se descartan.
  MAX_CHALLENGE_AGE_MS: 3 * 60 * 60 * 1000, // Un reto vence a las 3 horas.
  POW_BITS: 14, // Dificultad de la prueba de trabajo. Debe ser igual a BITS en src/scripts/wizard.ts.
  MAX_PER_HOUR: 30, // Máximo de solicitudes aceptadas por hora en total.
  MAX_CHALLENGES_PER_MINUTE: 120, // Máximo de retos entregados por minuto.
  REPEAT_WINDOW_SECONDS: 600, // Mismo correo: 1 envío cada 10 minutos.
  MAX_PER_EMAIL: 3, // Mismo correo: máximo 3 solicitudes cada 6 horas.
  MAIL_QUOTA_RESERVE: 10, // Correos diarios reservados para los avisos al negocio.
};

// Opciones válidas, tal como las envía la web (en español). Si cambias las opciones
// del formulario en src/components/QuoteWizard.astro, actualízalas aquí también.
const ALLOWED = {
  propiedad: ["Casa", "Apartamento", "Airbnb", "Oficina", "Propiedad en venta"],
  tamano: [
    "Menos de 1,000 pies²",
    "1,000 – 1,500 pies²",
    "1,500 – 2,000 pies²",
    "2,000 – 2,500 pies²",
    "2,500 – 3,500 pies²",
    "Más de 3,500 pies²",
    "No sabe",
  ],
  habitaciones: ["", "1", "2", "3", "4", "5+"],
  banos: ["1", "1.5", "2", "2.5", "3", "4+"],
  frecuencia: ["Semanal", "Cada 2 semanas", "Cada 3 semanas", "Solo una vez"],
  servicio: ["Limpieza regular", "Estándar", "Limpieza profunda", "Mudanza", "Post-construcción"],
  extras: ["Lavandería", "Ventanas", "Alfombras", "Nevera y horno por dentro"],
};

const CONSENT_TEXT = "Sí: llamada, texto, WhatsApp y correo";

// La hoja guarda todo en español. Para el correo de un cliente en inglés se traducen los valores.
const EN = {
  Casa: "House",
  Apartamento: "Apartment",
  Airbnb: "Airbnb",
  Oficina: "Office",
  "Propiedad en venta": "Listing",
  "Menos de 1,000 pies²": "Under 1,000 sq ft",
  "1,000 – 1,500 pies²": "1,000 – 1,500 sq ft",
  "1,500 – 2,000 pies²": "1,500 – 2,000 sq ft",
  "2,000 – 2,500 pies²": "2,000 – 2,500 sq ft",
  "2,500 – 3,500 pies²": "2,500 – 3,500 sq ft",
  "Más de 3,500 pies²": "Over 3,500 sq ft",
  "No sabe": "Not sure",
  Semanal: "Weekly",
  "Cada 2 semanas": "Every 2 weeks",
  "Cada 3 semanas": "Every 3 weeks",
  "Solo una vez": "Just once",
  Lavandería: "Laundry",
  Ventanas: "Windows",
  Alfombras: "Carpets",
  "Nevera y horno por dentro": "Inside fridge & oven",
};
function toEnglish(value) {
  return String(value || "")
    .split(", ")
    .map((v) => EN[v] || v)
    .join(", ");
}

const HEADERS = [
  "Fecha",
  "Nombre",
  "Correo",
  "Teléfono",
  "Dirección",
  "Propiedad",
  "Tamaño",
  "Habitaciones",
  "Baños",
  "Frecuencia",
  "Tipo de limpieza",
  "Extras",
  "Autorización de contacto",
  "Zona",
  "Idioma",
  "Página",
  "Estado",
  "Notas de seguimiento",
];
const STATUS_OPTIONS = ["Nuevo", "Contactado", "Cotizado", "Reservado", "Recurrente", "Perdido", "Revisar"];

// ---------- Endpoints ----------

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // A los robots les respondemos "ok" para no darles pistas de qué falló.
    const ignore = () => jsonResponse({ ok: true });

    // 1. Campo trampa: si viene lleno es un robot.
    if (data.website) return ignore();

    // 2. Reto firmado + prueba de trabajo + tiempo mínimo + un solo uso.
    if (!verifyChallenge(data.reto, data.prueba)) return ignore();
    if (!(Number(data.elapsed) >= CONFIG.MIN_FILL_MS)) return ignore();

    // 3. Límite global por hora, para frenar ataques masivos.
    if (!underGlobalLimit()) return jsonResponse({ ok: false, error: "rate_limited" });

    const lead = {
      nombre: cleanLine(data.nombre, 80),
      correo: cleanLine(data.correo, 160).toLowerCase(),
      telefono: cleanLine(data.telefono, 24),
      direccion: cleanLine(data.direccion, 200),
      propiedad: cleanLine(data.propiedad, 60),
      tamano: cleanLine(data.tamano, 40),
      habitaciones: cleanLine(data.habitaciones, 4),
      banos: cleanLine(data.banos, 4),
      frecuencia: cleanLine(data.frecuencia, 40),
      servicio: cleanLine(data.servicio, 80),
      extras: cleanLine(data.extras, 160),
      zona: cleanLine(data.zona, 60),
      idioma: data.idioma === "es" ? "es" : "en",
      pagina: cleanLine(data.pagina, 200),
      autorizacion: data.autorizacion === true ? CONSENT_TEXT : "",
      estado: "Nuevo",
    };

    // 4. Datos obligatorios, incluida la autorización de contacto.
    if (!lead.nombre || !lead.direccion || !lead.servicio || !lead.autorizacion) {
      return jsonResponse({ ok: false, error: "missing_fields" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.correo)) {
      return jsonResponse({ ok: false, error: "invalid_email" });
    }
    if (lead.telefono && !validPhone(lead.telefono)) {
      return jsonResponse({ ok: false, error: "invalid_phone" });
    }

    // 5. Enlaces en el nombre o la dirección = spam. Así el correo automático no sirve para mandar links.
    if ([lead.nombre, lead.direccion, lead.telefono].some(hasLink)) return ignore();

    // 6. Lo que no parece de una persona queda en "Revisar" y no recibe correo automático.
    if (!matchesOptions(lead) || !/^[\p{Script=Latin}\s.'’-]+$/u.test(lead.nombre)) {
      lead.estado = "Revisar";
    }

    // 7. Mismo correo: una vez cada 10 minutos y máximo 3 cada 6 horas.
    if (isRepeated(lead)) return ignore();

    saveLead(lead);

    // Los correos no deben impedir que la solicitud quede guardada.
    try {
      if (lead.estado === "Nuevo" && firstReplyFor(lead.correo) && MailApp.getRemainingDailyQuota() > CONFIG.MAIL_QUOTA_RESERVE) {
        sendAutoReply(lead);
      }
    } catch (err) {
      console.error("Error enviando respuesta automática", err);
    }
    try {
      notifyBusiness(lead);
    } catch (err) {
      console.error("Error enviando aviso al negocio", err);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: "server_error" });
  } finally {
    lock.releaseLock();
  }
}

// GET ?accion=reto entrega un reto para el formulario.
// Sin parámetros, sirve para comprobar en el navegador que la App web está publicada.
function doGet(e) {
  if (e && e.parameter && e.parameter.accion === "reto") {
    if (!underLimit("retos", CONFIG.MAX_CHALLENGES_PER_MINUTE, "yyyyMMddHHmm", 120)) {
      return jsonResponse({ ok: false, error: "rate_limited" });
    }
    return jsonResponse({ ok: true, reto: makeChallenge() });
  }
  return ContentService.createTextOutput("AJ Cleaning Home · formulario activo ✔");
}

// ---------- Hoja de cálculo ----------

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#8e4f3e")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(col("Dirección"), 300);
    sheet.setColumnWidth(col("Autorización de contacto"), 240);
    sheet.setColumnWidth(col("Notas de seguimiento"), 300);
    // Lista desplegable para el seguimiento.
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_OPTIONS, true).build();
    sheet.getRange(2, col("Estado"), sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  }
  return sheet;
}

function col(name) {
  return HEADERS.indexOf(name) + 1;
}

function saveLead(lead) {
  getSheet().appendRow([
    new Date(),
    safeCell(lead.nombre),
    safeCell(lead.correo),
    safeCell(lead.telefono),
    safeCell(lead.direccion),
    safeCell(lead.propiedad),
    safeCell(lead.tamano),
    safeCell(lead.habitaciones),
    safeCell(lead.banos),
    safeCell(lead.frecuencia),
    safeCell(lead.servicio),
    safeCell(lead.extras),
    lead.autorizacion,
    safeCell(lead.zona),
    lead.idioma,
    safeCell(lead.pagina),
    lead.estado,
    "",
  ]);
}

// ---------- Correos ----------

function sendAutoReply(lead) {
  const firstName = lead.nombre.split(" ")[0];
  const es = lead.idioma === "es";
  const subject = es
    ? `Recibimos tu solicitud, ${firstName} · ${CONFIG.BUSINESS_NAME}`
    : `We got your request, ${firstName} · ${CONFIG.BUSINESS_NAME}`;
  const lines = es
    ? [`¡Hola ${firstName}!`, "Recibimos tu solicitud de limpieza.", "Te contactaremos pronto con tu cotización."]
    : [`Hi ${firstName}!`, "We got your cleaning request.", "We will contact you soon with your quote."];
  const t = es
    ? { summary: "Tu solicitud", hurry: "¿Tienes prisa? Escríbenos o llámanos.", call: "Llamar", hours: "Lun a vie, 8 am a 5 pm", replyHint: "Puedes responder este correo." }
    : { summary: "Your request", hurry: "In a hurry? Message or call us.", call: "Call", hours: "Mon to Fri, 8 am to 5 pm", replyHint: "You can reply to this email." };
  const waText = encodeURIComponent(es ? `¡Hola! Soy ${lead.nombre}, acabo de pedir una cotización.` : `Hi! I'm ${lead.nombre}, I just requested a quote.`);
  const waUrl = `https://wa.me/${CONFIG.WHATSAPP}?text=${waText}`;

  // Botones con estilos en línea (Gmail, Outlook, Apple Mail). En pantallas angostas bajan
  // a la línea siguiente completos, sin partir el texto.
  const button = (href, label, bg, color, border) =>
    `<a href="${href}" style="display:inline-block;margin:0 8px 10px 0;padding:12px 20px;border-radius:999px;background:${bg};color:${color};border:1.5px solid ${border};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;white-space:nowrap;">${escapeHtml(label)}</a>`;
  const v = (value) => (es ? value : toEnglish(value));

  const header = CONFIG.LOGO_URL
    ? `<img src="${CONFIG.LOGO_URL}" width="64" height="64" alt="${CONFIG.BUSINESS_NAME}" style="display:inline-block;width:64px;height:64px;border-radius:50%;border:0;vertical-align:middle;" />
       <span style="display:inline-block;margin-left:14px;vertical-align:middle;font-family:Georgia,serif;font-size:22px;color:#ffffff;">${CONFIG.BUSINESS_NAME}</span>`
    : `<span style="font-family:Georgia,serif;font-size:22px;color:#ffffff;">${CONFIG.BUSINESS_NAME}</span>`;

  const footerLinks = [
    CONFIG.PHONE_DISPLAY ? `<a href="tel:${CONFIG.PHONE}" style="color:#8e4f3e;text-decoration:none;">${CONFIG.PHONE_DISPLAY}</a>` : "",
    CONFIG.NOTIFY_EMAIL ? `<a href="mailto:${CONFIG.NOTIFY_EMAIL}" style="color:#8e4f3e;text-decoration:none;">${CONFIG.NOTIFY_EMAIL}</a>` : "",
    CONFIG.SITE_URL ? `<a href="${CONFIG.SITE_URL}" style="color:#8e4f3e;text-decoration:none;">${CONFIG.SITE_URL.replace(/^https?:\/\/(www\.)?/, "")}</a>` : "",
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");

  const html = `
  <div style="margin:0;padding:32px 16px;background:#fbf6ef;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:540px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background:#4a2a20;padding:20px 28px;">${header}</div>
      <div style="padding:30px 28px 26px;color:#3c2415;">
        <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:26px;font-weight:normal;">${escapeHtml(lines[0])}</h1>
        <p style="margin:0 0 8px;font-size:16px;line-height:1.5;">${escapeHtml(lines[1])}</p>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.5;">${escapeHtml(lines[2])}</p>

        <div style="padding:18px 20px 10px;background:#fdf4f1;border-radius:12px;">
          <p style="margin:0 0 10px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#8e4f3e;">${escapeHtml(t.summary)}</p>
          ${summaryRow(es ? "Propiedad" : "Property", v(lead.propiedad))}
          ${summaryRow(es ? "Tamaño" : "Size", v(lead.tamano))}
          ${summaryRow(es ? "Frecuencia" : "How often", v(lead.frecuencia))}
          ${summaryRow(es ? "Extras" : "Extras", v(lead.extras))}
          ${summaryRow(es ? "Dirección" : "Address", lead.direccion)}
        </div>

        <p style="margin:24px 0 12px;font-size:16px;line-height:1.5;">${escapeHtml(t.hurry)}</p>
        <div>
          ${CONFIG.WHATSAPP ? button(waUrl, "WhatsApp", "#8e4f3e", "#ffffff", "#8e4f3e") : ""}${CONFIG.PHONE ? button(`tel:${CONFIG.PHONE}`, `${t.call} ${CONFIG.PHONE_DISPLAY}`, "#ffffff", "#8e4f3e", "#e4b3a5") : ""}
        </div>
      </div>
      <div style="padding:18px 28px 22px;border-top:1px solid #f0e2d8;font-size:13px;line-height:1.6;color:#6b5242;">
        <strong style="color:#3c2415;">${CONFIG.BUSINESS_NAME}</strong> · ${escapeHtml(t.hours)}<br />
        ${footerLinks}<br />
        <span style="color:#8a7566;">${escapeHtml(t.replyHint)}</span>
      </div>
    </div>
  </div>`;

  const textLines = lines.concat([
    "",
    `${t.hurry}`,
    CONFIG.WHATSAPP ? `WhatsApp: https://wa.me/${CONFIG.WHATSAPP}` : "",
    CONFIG.PHONE_DISPLAY ? `${t.call}: ${CONFIG.PHONE_DISPLAY}` : "",
    "",
    `${CONFIG.BUSINESS_NAME} · ${t.hours}`,
    CONFIG.SITE_URL,
  ]).filter((l, i, a) => l !== "" || a[i - 1] !== "");

  const options = {
    to: lead.correo,
    subject: subject,
    body: textLines.join("\n"),
    htmlBody: html,
    name: CONFIG.BUSINESS_NAME,
  };
  if (CONFIG.NOTIFY_EMAIL) options.replyTo = CONFIG.NOTIFY_EMAIL;
  MailApp.sendEmail(options);
}

function notifyBusiness(lead) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const check = lead.estado === "Revisar" ? " (revisar: puede ser spam)" : "";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#3c2415;">
    <h2 style="margin:0 0 16px;">Nueva solicitud de cotización${escapeHtml(check)}</h2>
    ${summaryRow("Nombre", lead.nombre)}
    ${summaryRow("Correo", lead.correo)}
    ${summaryRow("Teléfono", lead.telefono)}
    ${summaryRow("Dirección", lead.direccion)}
    ${summaryRow("Propiedad", lead.propiedad)}
    ${summaryRow("Tamaño", lead.tamano)}
    ${summaryRow("Habitaciones", lead.habitaciones)}
    ${summaryRow("Baños", lead.banos)}
    ${summaryRow("Frecuencia", lead.frecuencia)}
    ${summaryRow("Tipo de limpieza", lead.servicio)}
    ${summaryRow("Extras", lead.extras)}
    ${summaryRow("Zona", lead.zona)}
    ${summaryRow("Autorización", lead.autorizacion)}
    <p style="margin:24px 0 0;">
      <a href="${sheetUrl}" style="display:inline-block;background:#8e4f3e;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:999px;">Abrir la hoja</a>
    </p>
  </div>`;

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: `Nueva solicitud: ${lead.nombre}${check}`,
    body:
      `Nueva solicitud de ${lead.nombre}${check}\nCorreo: ${lead.correo}\nTeléfono: ${lead.telefono || "—"}\nDirección: ${lead.direccion}\n` +
      `Propiedad: ${lead.propiedad}\nTamaño: ${lead.tamano}\nHabitaciones: ${lead.habitaciones} · Baños: ${lead.banos}\n` +
      `Frecuencia: ${lead.frecuencia}\nTipo de limpieza: ${lead.servicio}\nExtras: ${lead.extras}\n` +
      `Autorización: ${lead.autorizacion}\n\nHoja: ${sheetUrl}`,
    htmlBody: html,
    name: `${CONFIG.BUSINESS_NAME} · Web`,
    replyTo: lead.correo,
  });
}

// ---------- Anti-robots ----------

// Clave secreta para firmar los retos. Se crea sola la primera vez y queda en las
// propiedades del script (Configuración del proyecto → Propiedades del script).
function secret() {
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty("SECRETO_RETOS");
  if (!key) {
    key = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty("SECRETO_RETOS", key);
  }
  return key;
}

function sign(value) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(value, secret())).replace(/=+$/, "");
}

// Reto = hora.aleatorio.firma
function makeChallenge() {
  const body = Date.now() + "." + Utilities.getUuid().replace(/-/g, "").slice(0, 16);
  return body + "." + sign(body);
}

function verifyChallenge(reto, prueba) {
  reto = String(reto || "");
  prueba = String(prueba || "");
  const parts = reto.split(".");
  if (parts.length !== 3 || !/^\d{1,10}$/.test(prueba)) return false;

  // Firma: el reto lo creó este script y nadie lo modificó.
  const body = parts[0] + "." + parts[1];
  if (sign(body) !== parts[2]) return false;

  // Tiempo: ni demasiado rápido (robot) ni vencido.
  const age = Date.now() - Number(parts[0]);
  if (!(age >= CONFIG.MIN_FILL_MS && age <= CONFIG.MAX_CHALLENGE_AGE_MS)) return false;

  // Prueba de trabajo: SHA-256(reto:prueba) empieza con POW_BITS ceros.
  const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, reto + ":" + prueba, Utilities.Charset.UTF_8);
  if (leadingZeroBits(hash) < CONFIG.POW_BITS) return false;

  // Un solo uso.
  const cache = CacheService.getScriptCache();
  const key = "reto-" + parts[1];
  if (cache.get(key)) return false;
  cache.put(key, "1", 21600);
  return true;
}

function leadingZeroBits(bytes) {
  let bits = 0;
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i] & 0xff; // Apps Script entrega bytes con signo.
    if (b === 0) {
      bits += 8;
      continue;
    }
    let mask = 0x80;
    while (!(b & mask)) {
      bits++;
      mask >>= 1;
    }
    break;
  }
  return bits;
}

function underGlobalLimit() {
  return underLimit("solicitudes", CONFIG.MAX_PER_HOUR, "yyyyMMddHH", 3600);
}

function underLimit(name, max, period, seconds) {
  const cache = CacheService.getScriptCache();
  const key = name + "-" + Utilities.formatDate(new Date(), "UTC", period);
  const count = Number(cache.get(key) || 0);
  if (count >= max) return false;
  cache.put(key, String(count + 1), seconds);
  return true;
}

function isRepeated(lead) {
  const cache = CacheService.getScriptCache();
  const recent = "mail-" + lead.correo;
  const daily = "mail6h-" + lead.correo;
  if (cache.get(recent)) return true;
  const count = Number(cache.get(daily) || 0);
  if (count >= CONFIG.MAX_PER_EMAIL) return true;
  cache.put(recent, "1", CONFIG.REPEAT_WINDOW_SECONDS);
  cache.put(daily, String(count + 1), 21600);
  return false;
}

// Una sola respuesta automática por correo cada 6 horas.
function firstReplyFor(email) {
  const cache = CacheService.getScriptCache();
  const key = "reply-" + email;
  if (cache.get(key)) return false;
  cache.put(key, "1", 21600);
  return true;
}

function matchesOptions(lead) {
  const extras = lead.extras ? lead.extras.split(", ") : [];
  return (
    ALLOWED.propiedad.indexOf(lead.propiedad) >= 0 &&
    ALLOWED.tamano.indexOf(lead.tamano) >= 0 &&
    ALLOWED.habitaciones.indexOf(lead.habitaciones) >= 0 &&
    ALLOWED.banos.indexOf(lead.banos) >= 0 &&
    ALLOWED.frecuencia.indexOf(lead.frecuencia) >= 0 &&
    ALLOWED.servicio.indexOf(lead.servicio) >= 0 &&
    extras.every((x) => ALLOWED.extras.indexOf(x) >= 0)
  );
}

function hasLink(value) {
  return /https?:|www\.|:\/\/|\.(com|net|org|ru|xyz|top|info|biz|io|co)\b/i.test(value || "");
}

function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  return /^[\d\s()+.-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
}

// ---------- Utilidades ----------

function summaryRow(label, value) {
  if (!value) return "";
  return `<p style="margin:0 0 8px;font-size:15px;line-height:1.5;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

// Una sola línea, sin caracteres de control (evita inyección en el asunto del correo).
function cleanLine(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

// Evita que un texto que empieza por = + - @ se ejecute como fórmula en Sheets.
function safeCell(value) {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- Prueba ----------

// Ejecuta esta función una vez desde el editor para autorizar los permisos
// y comprobar que la hoja y los correos funcionan. Resuelve el reto como lo haría la web.
function probarFormulario() {
  const destino = CONFIG.NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  const reto = makeChallenge();
  Utilities.sleep(CONFIG.MIN_FILL_MS + 200);
  let prueba = 0;
  while (
    leadingZeroBits(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, reto + ":" + prueba, Utilities.Charset.UTF_8)) <
    CONFIG.POW_BITS
  ) {
    prueba++;
  }
  const fake = {
    postData: {
      contents: JSON.stringify({
        nombre: "Prueba AJ",
        correo: destino,
        telefono: "(305) 555-0123",
        direccion: "123 Test St, Miami, FL 33101",
        propiedad: "Casa",
        tamano: "1,500 – 2,000 pies²",
        habitaciones: "3",
        banos: "2",
        frecuencia: "Cada 2 semanas",
        servicio: "Limpieza regular",
        extras: "Ventanas",
        zona: "",
        idioma: "es",
        pagina: "/prueba/",
        autorizacion: true,
        elapsed: 60000,
        reto: reto,
        prueba: String(prueba),
      }),
    },
  };
  console.log(doPost(fake).getContent());
}
