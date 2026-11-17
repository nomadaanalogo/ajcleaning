/**
 * AJ Cleaning Home · Solicitudes de cotización
 *
 * Recibe el formulario de la web, guarda cada solicitud en esta hoja de cálculo
 * (queda en el Drive de quien la instala) y envía dos correos:
 *   1. Respuesta automática al cliente, en su idioma.
 *   2. Aviso a AJ Cleaning Home con los datos.
 *
 * Instalación: ver apps-script/README.md
 */

// ---------- Configuración ----------
const CONFIG = {
  BUSINESS_NAME: "AJ Cleaning Home",
  // PENDIENTE: correo de AJ Cleaning Home que recibe los avisos. Vacío = no se envía aviso.
  NOTIFY_EMAIL: "",
  SHEET_NAME: "Solicitudes",
  // Anti-bots
  MIN_FILL_MS: 4000, // Envíos más rápidos que esto se descartan.
  MAX_PER_HOUR: 30, // Máximo de solicitudes aceptadas por hora en total.
  REPEAT_WINDOW_SECONDS: 600, // Mismo correo: 1 envío cada 10 minutos.
  MAIL_QUOTA_RESERVE: 10, // Correos diarios reservados para los avisos al negocio.
};

const HEADERS = [
  "Fecha",
  "Nombre",
  "Correo",
  "Dirección",
  "Propiedad",
  "Servicio",
  "Frecuencia",
  "Zona",
  "Idioma",
  "Página",
  "Estado",
  "Notas de seguimiento",
];

// ---------- Endpoints ----------

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // 1. Campo trampa: si viene lleno es un bot. Respondemos ok para no darle pistas.
    if (data.website) return jsonResponse({ ok: true });

    // 2. Trampa de tiempo: una persona tarda varios segundos en responder 3 pasos.
    if (!(Number(data.elapsed) >= CONFIG.MIN_FILL_MS)) return jsonResponse({ ok: true });

    // 3. Límite global por hora, para frenar ataques masivos.
    if (!underGlobalLimit()) return jsonResponse({ ok: false, error: "rate_limited" });

    const lead = {
      nombre: cleanLine(data.nombre, 80),
      correo: cleanLine(data.correo, 160).toLowerCase(),
      direccion: cleanLine(data.direccion, 200),
      propiedad: cleanLine(data.propiedad, 60),
      servicio: cleanLine(data.servicio, 80),
      frecuencia: cleanLine(data.frecuencia, 40),
      zona: cleanLine(data.zona, 60),
      idioma: data.idioma === "es" ? "es" : "en",
      pagina: cleanLine(data.pagina, 200),
    };

    if (!lead.nombre || !lead.direccion || !lead.servicio) {
      return jsonResponse({ ok: false, error: "missing_fields" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.correo)) {
      return jsonResponse({ ok: false, error: "invalid_email" });
    }

    // Un nombre con enlaces es spam: así el correo automático no sirve para mandar links.
    if (/https?:|www\.|:\/\/|\.(com|net|org|ru|xyz|top)\b/i.test(lead.nombre)) {
      return jsonResponse({ ok: true });
    }

    // 4. Un mismo correo solo una vez cada 10 minutos (evita duplicados y spam repetido).
    if (isRepeated(lead)) return jsonResponse({ ok: true });

    saveLead(lead);

    // Los correos no deben impedir que la solicitud quede guardada.
    try {
      if (MailApp.getRemainingDailyQuota() > CONFIG.MAIL_QUOTA_RESERVE) sendAutoReply(lead);
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

// Abre la URL /exec en el navegador para comprobar que la App web está publicada.
function doGet() {
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
      .setBackground("#17595c")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(4, 300);
    sheet.setColumnWidth(12, 300);
    // Lista desplegable para el seguimiento.
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Nuevo", "Contactado", "Cotizado", "Reservado", "Recurrente", "Perdido"], true)
      .build();
    sheet.getRange(2, 11, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  }
  return sheet;
}

function saveLead(lead) {
  getSheet().appendRow([
    new Date(),
    safeCell(lead.nombre),
    safeCell(lead.correo),
    safeCell(lead.direccion),
    safeCell(lead.propiedad),
    safeCell(lead.servicio),
    safeCell(lead.frecuencia),
    safeCell(lead.zona),
    lead.idioma,
    safeCell(lead.pagina),
    "Nuevo",
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

  const html = `
  <div style="margin:0;padding:32px 16px;background:#fbf6ef;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:540px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background:#0f3a3d;padding:22px 28px;font-family:Georgia,serif;font-size:22px;color:#ffffff;">${CONFIG.BUSINESS_NAME}</div>
      <div style="padding:30px 28px;color:#3c2415;">
        <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:26px;font-weight:normal;">${escapeHtml(lines[0])}</h1>
        <p style="margin:0 0 8px;font-size:16px;line-height:1.5;">${escapeHtml(lines[1])}</p>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.5;">${escapeHtml(lines[2])}</p>
        ${summaryRow(es ? "Propiedad" : "Property", lead.propiedad)}
        ${summaryRow(es ? "Servicio" : "Service", lead.servicio)}
        ${summaryRow(es ? "Frecuencia" : "Frequency", lead.frecuencia)}
        ${summaryRow(es ? "Dirección" : "Address", lead.direccion)}
      </div>
    </div>
  </div>`;

  const options = {
    to: lead.correo,
    subject: subject,
    body: lines.join("\n") + `\n\n${CONFIG.BUSINESS_NAME}`,
    htmlBody: html,
    name: CONFIG.BUSINESS_NAME,
  };
  if (CONFIG.NOTIFY_EMAIL) options.replyTo = CONFIG.NOTIFY_EMAIL;
  MailApp.sendEmail(options);
}

function notifyBusiness(lead) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#3c2415;">
    <h2 style="margin:0 0 16px;">Nueva solicitud de cotización</h2>
    ${summaryRow("Nombre", lead.nombre)}
    ${summaryRow("Correo", lead.correo)}
    ${summaryRow("Dirección", lead.direccion)}
    ${summaryRow("Propiedad", lead.propiedad)}
    ${summaryRow("Servicio", lead.servicio)}
    ${summaryRow("Frecuencia", lead.frecuencia)}
    ${summaryRow("Zona", lead.zona)}
    <p style="margin:24px 0 0;">
      <a href="${sheetUrl}" style="display:inline-block;background:#17595c;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:999px;">Abrir la hoja</a>
    </p>
  </div>`;

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: `Nueva solicitud: ${lead.nombre}`,
    body:
      `Nueva solicitud de ${lead.nombre}\nCorreo: ${lead.correo}\nDirección: ${lead.direccion}\n` +
      `Propiedad: ${lead.propiedad}\nServicio: ${lead.servicio}\nFrecuencia: ${lead.frecuencia}\n\nHoja: ${sheetUrl}`,
    htmlBody: html,
    name: `${CONFIG.BUSINESS_NAME} · Web`,
    replyTo: lead.correo,
  });
}

// ---------- Anti-bots ----------

function underGlobalLimit() {
  const cache = CacheService.getScriptCache();
  const key = "count-" + Utilities.formatDate(new Date(), "UTC", "yyyyMMddHH");
  const count = Number(cache.get(key) || 0);
  if (count >= CONFIG.MAX_PER_HOUR) return false;
  cache.put(key, String(count + 1), 3600);
  return true;
}

function isRepeated(lead) {
  const cache = CacheService.getScriptCache();
  const key = "mail-" + lead.correo;
  if (cache.get(key)) return true;
  cache.put(key, "1", CONFIG.REPEAT_WINDOW_SECONDS);
  return false;
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

// Ejecuta esta función una vez desde el editor para autorizar los permisos
// y comprobar que la hoja y los correos funcionan.
function probarFormulario() {
  const destino = CONFIG.NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  const fake = {
    postData: {
      contents: JSON.stringify({
        nombre: "Prueba AJ",
        correo: destino,
        direccion: "123 Test St, Miami, FL 33101",
        propiedad: "Casa",
        servicio: "Limpieza recurrente",
        frecuencia: "Semanal",
        zona: "",
        idioma: "es",
        pagina: "/prueba/",
        elapsed: 60000,
      }),
    },
  };
  console.log(doPost(fake).getContent());
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
