/* ============================================================
   DermAgent — Langflow chatbot
   Requires: js/script.js loaded before this file.
   ============================================================ */

const DERMAGENT_CONFIG = {
  endpoint:
    "http://localhost:7860/api/v1/run/c6bc8a3a-c217-49fa-9f45-da4acc78383f",
  apiKey: "sk-II1TBNicIBhNZ7MI8YVnvXpti9fJ8-WCQTMy-7CYIM0",
  outputType: "chat",
  inputType: "chat",
};

const DERMAGENT_STORAGE_KEY = "dermagent_detection_context";
const DERMAGENT_SESSION_KEY = "dermagent_session_id";

function getDermAgentSessionId() {
  let id = sessionStorage.getItem(DERMAGENT_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(DERMAGENT_SESSION_KEY, id);
  }
  return id;
}

function saveDetectionContext(disease, confidence, source = "deteksi") {
  if (!disease) return;
  const context = {
    disease: String(disease),
    confidence:
      Number(confidence) <= 1
        ? Math.round(Number(confidence) * 100)
        : Math.round(Number(confidence)),
    source,
    updatedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(DERMAGENT_STORAGE_KEY, JSON.stringify(context));
  updateDermAgentContext();
}

function getDetectionContext() {
  try {
    return JSON.parse(sessionStorage.getItem(DERMAGENT_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function clearDetectionContext() {
  sessionStorage.removeItem(DERMAGENT_STORAGE_KEY);
  updateDermAgentContext();
}

function updateDermAgentContext() {
  const el = document.getElementById("da-context");
  if (!el) return;
  const ctx = getDetectionContext();
  if (!ctx) {
    el.style.display = "none";
    el.innerHTML = "";
    return;
  }
  el.style.display = "block";
  el.innerHTML = `Hasil deteksi terakhir: <strong>${escapeHTML(ctx.disease)}</strong> · Confidence <strong>${ctx.confidence}%</strong>`;
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}

function extractLangflowText(data) {
  const candidates = [
    data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text,
    data?.outputs?.[0]?.outputs?.[0]?.results?.message?.message,
    data?.outputs?.[0]?.outputs?.[0]?.results?.text,
    data?.outputs?.[0]?.outputs?.[0]?.results?.message,
    data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message,
    data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.text,
    data?.outputs?.[0]?.outputs?.[0]?.text,
    data?.message?.text,
    data?.text,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  // Last-resort recursive search for a likely text/message field.
  const seen = new Set();
  function walk(value) {
    if (!value || typeof value !== "object" || seen.has(value)) return null;
    seen.add(value);
    for (const key of ["text", "message"]) {
      if (typeof value[key] === "string" && value[key].trim())
        return value[key].trim();
    }
    for (const child of Object.values(value)) {
      const found = walk(child);
      if (found) return found;
    }
    return null;
  }
  return walk(data);
}

function buildDermAgentInput(question) {
  const ctx = getDetectionContext();
  const detectionBlock = ctx
    ? `Hasil Deteksi Website:
- Penyakit/label model: ${ctx.disease}
- Confidence: ${ctx.confidence}%
- Sumber: ${ctx.source}

`
    : `Hasil Deteksi Website:
- Belum ada hasil deteksi yang tersimpan.

`;

  return `${detectionBlock}Pertanyaan Pengguna:
${question}`;
}

function addDermAgentMessage(text, role = "bot") {
  const box = document.getElementById("da-messages");
  if (!box) return;
  const msg = document.createElement("div");
  msg.className = `da-msg ${role}`;
  msg.textContent = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
  return msg;
}

async function sendDermAgentMessage() {
  const input = document.getElementById("dermagent-input");
  const send = document.getElementById("dermagent-send");
  if (!input || !send) return;

  const question = input.value.trim();
  if (!question || send.disabled) return;

  if (
    !DERMAGENT_CONFIG.apiKey ||
    DERMAGENT_CONFIG.apiKey === "YOUR_LANGFLOW_API_KEY_HERE"
  ) {
    addDermAgentMessage(
      "API key Langflow belum diisi. Buka js/chatbot.js lalu isi DERMAGENT_CONFIG.apiKey.",
      "bot",
    );
    return;
  }

  addDermAgentMessage(question, "user");
  input.value = "";
  send.disabled = true;

  const typing = addDermAgentMessage("DermAgent sedang memproses…", "bot");
  typing.classList.add("da-typing");

  try {
    const payload = {
      output_type: DERMAGENT_CONFIG.outputType,
      input_type: DERMAGENT_CONFIG.inputType,
      input_value: buildDermAgentInput(question),
      session_id: getDermAgentSessionId(),
    };

    const response = await fetch(DERMAGENT_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": DERMAGENT_CONFIG.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data?.message || data?.detail || `HTTP ${response.status}`,
      );
    }

    const answer = extractLangflowText(data);
    typing.remove();

    addDermAgentMessage(
      answer ||
        "DermAgent menerima respons, tetapi format respons Langflow belum dapat dibaca oleh widget.",
    );
  } catch (error) {
    typing.remove();
    addDermAgentMessage(
      `Gagal terhubung ke DermAgent.\n\n${error.message}\n\nPastikan Langflow berjalan di localhost:7860, flow aktif, API key benar, dan CORS mengizinkan website ini.`,
    );
  } finally {
    send.disabled = false;
    input.focus();
  }
}

function initDermAgent() {
  if (document.getElementById("dermagent-widget")) return;

  const widget = document.createElement("div");
  widget.id = "dermagent-widget";
  widget.innerHTML = `
    <div id="dermagent-panel" aria-label="DermAgent chatbot">
      <div class="da-header">
        <div class="da-avatar">DA</div>
        <div class="da-head-text">
          <strong>DermAgent</strong>
          <span>Dermatology Agent · AI Assistant</span>
        </div>
        <button class="da-close" id="da-close" aria-label="Tutup chatbot">×</button>
      </div>

      <div id="da-context" class="da-context"></div>

      <div id="da-messages" class="da-messages">
        <div class="da-msg bot">Halo! Saya DermAgent 👋<br><br>Saya dapat membantu menjelaskan hasil deteksi kulit dan informasi umum berdasarkan knowledge base. Hasil model bukan diagnosis medis.</div>
      </div>

      <div class="da-disclaimer">
        DermAgent bersifat informatif dan tidak menggantikan pemeriksaan tenaga medis.
      </div>

      <div class="da-input-wrap">
        <input id="dermagent-input" type="text" placeholder="Tanyakan sesuatu…" autocomplete="off" />
        <button id="dermagent-send" aria-label="Kirim">➤</button>
      </div>
    </div>

    <button id="dermagent-toggle" aria-label="Buka DermAgent">
      <span class="da-icon">✦</span>
    </button>
  `;
  document.body.appendChild(widget);

  const panel = document.getElementById("dermagent-panel");
  const toggle = document.getElementById("dermagent-toggle");
  const close = document.getElementById("da-close");
  const input = document.getElementById("dermagent-input");
  const send = document.getElementById("dermagent-send");

  function openPanel() {
    panel.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    updateDermAgentContext();
    input.focus();
  }
  function closePanel() {
    panel.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    panel.classList.contains("open") ? closePanel() : openPanel();
  });
  close.addEventListener("click", closePanel);
  send.addEventListener("click", sendDermAgentMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendDermAgentMessage();
    if (e.key === "Escape") closePanel();
  });

  updateDermAgentContext();
}

window.DERMAGENT_CONFIG = DERMAGENT_CONFIG;
window.saveDetectionContext = saveDetectionContext;
window.getDetectionContext = getDetectionContext;
window.clearDetectionContext = clearDetectionContext;

document.addEventListener("DOMContentLoaded", initDermAgent);
