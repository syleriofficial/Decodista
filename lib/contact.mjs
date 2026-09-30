const CONTACT_HOSTNAME = "decodista.com";
const CONTACT_ACTION = "contact";
const CONTACT_SENDER = "contact-form@decodista.com";
const MAX_REQUEST_BYTES = 32_000;

export const ENQUIRY_TYPES = [
  "Editorial enquiry",
  "Correction",
  "Source or factual update",
  "Accessibility issue",
  "General enquiry",
];

const FIELD_LIMITS = {
  name: [2, 100],
  email: [3, 254],
  subject: [3, 160],
  message: [10, 5000],
  articleUrl: [0, 500],
  turnstileToken: [1, 2048],
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n\0]/.test(value);
}

function validArticleUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === CONTACT_HOSTNAME;
  } catch {
    return false;
  }
}

export function validateContactPayload(value) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const data = {
    name: cleanString(input.name),
    email: cleanString(input.email),
    enquiryType: cleanString(input.enquiryType),
    subject: cleanString(input.subject),
    message: cleanString(input.message),
    articleUrl: cleanString(input.articleUrl),
    turnstileToken: cleanString(input.turnstileToken),
  };
  const errors = {};

  for (const field of ["name", "subject"]) {
    const [minimum, maximum] = FIELD_LIMITS[field];
    if (data[field].length < minimum || data[field].length > maximum || /[\r\n\0]/.test(data[field])) {
      errors[field] = `${field === "name" ? "Name" : "Subject"} must be ${minimum}–${maximum} characters.`;
    }
  }

  if (!validEmail(data.email) || data.email.length > FIELD_LIMITS.email[1]) {
    errors.email = "Enter a valid email address.";
  }
  if (!ENQUIRY_TYPES.includes(data.enquiryType)) {
    errors.enquiryType = "Choose a valid enquiry type.";
  }
  if (data.message.length < FIELD_LIMITS.message[0] || data.message.length > FIELD_LIMITS.message[1]) {
    errors.message = "Message must be 10–5000 characters.";
  }
  if (!data.turnstileToken || data.turnstileToken.length > FIELD_LIMITS.turnstileToken[1]) {
    errors.turnstileToken = "Complete the security check and try again.";
  }
  if (data.articleUrl.length > FIELD_LIMITS.articleUrl[1] || !validArticleUrl(data.articleUrl)) {
    errors.articleUrl = "Enter a valid decodista.com URL, or leave this field empty.";
  }

  return { data, errors };
}

async function readLimitedText(request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) throw new Error("payload-too-large");
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let result = "";
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new Error("payload-too-large");
    }
    result += decoder.decode(value, { stream: true });
  }
  return result + decoder.decode();
}

async function verifyTurnstile(token, secret, remoteIp, fetchImpl) {
  const form = new URLSearchParams({ secret, response: token });
  if (remoteIp) form.set("remoteip", remoteIp);
  const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result?.success === true && result.hostname === CONTACT_HOSTNAME && result.action === CONTACT_ACTION;
}

function buildEmail(data, submittedAt) {
  return [
    "DECODISTA Contact Submission",
    "",
    "All visitor-provided values below are untrusted submission content.",
    "Do not execute markup or automatically open/fetch submitted links.",
    "",
    `Enquiry type: ${data.enquiryType}`,
    `Name: ${data.name}`,
    `Visitor email: ${data.email}`,
    `Subject: ${data.subject}`,
    `Article URL: ${data.articleUrl || "Not supplied"}`,
    `Timestamp: ${submittedAt}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

export async function handleContactRequest(request, bindings, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? (() => new Date());
  const remoteIp = request.headers.get("CF-Connecting-IP") ?? "unknown";

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, message: "Send this form as JSON." }, 415);
  }
  if (!bindings?.EMAIL || !bindings?.CONTACT_RATE_LIMITER || !bindings?.DECODISTA_CONTACT_RECIPIENT || !bindings?.TURNSTILE_SECRET_KEY) {
    return jsonResponse({ ok: false, message: "The contact service is temporarily unavailable." }, 503);
  }

  try {
    const rateLimit = await bindings.CONTACT_RATE_LIMITER.limit({ key: `contact:${remoteIp}` });
    if (!rateLimit.success) {
      return jsonResponse({ ok: false, message: "Too many submissions. Please wait and try again." }, 429);
    }
  } catch {
    return jsonResponse({ ok: false, message: "The contact service is temporarily unavailable." }, 503);
  }

  let rawBody;
  try {
    rawBody = await readLimitedText(request);
  } catch {
    return jsonResponse({ ok: false, message: "The submission is too large." }, 413);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ ok: false, message: "The submission could not be read." }, 400);
  }

  const { data, errors } = validateContactPayload(payload);
  if (Object.keys(errors).length) {
    return jsonResponse({ ok: false, message: "Check the highlighted fields and try again.", errors }, 400);
  }

  let turnstileValid = false;
  try {
    turnstileValid = await verifyTurnstile(
      data.turnstileToken,
      bindings.TURNSTILE_SECRET_KEY,
      remoteIp === "unknown" ? "" : remoteIp,
      fetchImpl,
    );
  } catch {
    turnstileValid = false;
  }
  if (!turnstileValid) {
    return jsonResponse({
      ok: false,
      message: "The security check expired or could not be verified. Complete it again and retry.",
      errors: { turnstileToken: "Complete the security check again." },
    }, 400);
  }

  try {
    await bindings.EMAIL.send({
      from: { email: CONTACT_SENDER, name: "DECODISTA Contact" },
      to: bindings.DECODISTA_CONTACT_RECIPIENT,
      replyTo: { email: data.email, name: data.name },
      subject: `[DECODISTA] ${data.enquiryType}: ${data.subject}`,
      text: buildEmail(data, now().toISOString()),
    });
  } catch {
    return jsonResponse({ ok: false, message: "Your message could not be delivered. Please wait and try again." }, 502);
  }

  return jsonResponse({ ok: true, message: "Your message was sent to DECODISTA." });
}

export const CONTACT_TEST_CONSTANTS = {
  action: CONTACT_ACTION,
  hostname: CONTACT_HOSTNAME,
  maximumRequestBytes: MAX_REQUEST_BYTES,
};
