import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { handleContactRequest, validateContactPayload } from "../lib/contact.mjs";

const privateRecipientFixture = "private-recipient@example.invalid";
const validPayload = {
  name: "Contact Test",
  email: "visitor@example.com",
  enquiryType: "General enquiry",
  subject: "Production contact test",
  message: "This is a safe test message for the DECODISTA contact endpoint.",
  articleUrl: "",
  turnstileToken: "valid-turnstile-token",
};

function request(payload = validPayload, options = {}) {
  return new Request("https://decodista.com/api/contact", {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": options.contentType ?? "application/json",
      "CF-Connecting-IP": "203.0.113.10",
      ...options.headers,
    },
    body: options.method === "GET" ? undefined : options.body ?? JSON.stringify(payload),
  });
}

function services(overrides = {}) {
  const sent = [];
  return {
    sent,
    bindings: {
      DECODISTA_CONTACT_RECIPIENT: privateRecipientFixture,
      TURNSTILE_SECRET_KEY: "server-secret-fixture",
      CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
      EMAIL: { send: async (message) => { sent.push(message); } },
      ...overrides,
    },
  };
}

function turnstile(result = { success: true, hostname: "decodista.com", action: "contact" }) {
  return async () => new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

test("valid fields pass the shared validator", () => {
  assert.deepEqual(validateContactPayload(validPayload).errors, {});
});

test("invalid email is rejected", () => {
  assert.match(validateContactPayload({ ...validPayload, email: "not-an-email" }).errors.email, /valid email/i);
});

test("missing required fields are rejected", () => {
  const { errors } = validateContactPayload({});
  assert.deepEqual(Object.keys(errors).sort(), ["email", "enquiryType", "message", "name", "subject", "turnstileToken"].sort());
});

test("excessive field size is rejected", () => {
  assert.match(validateContactPayload({ ...validPayload, message: "x".repeat(5001) }).errors.message, /5000/);
});

test("unsupported enquiry type is rejected", () => {
  assert.match(validateContactPayload({ ...validPayload, enquiryType: "Sales" }).errors.enquiryType, /valid enquiry/i);
});

test("missing Turnstile token is rejected before verification", async () => {
  const { bindings } = services();
  const response = await handleContactRequest(request({ ...validPayload, turnstileToken: "" }), bindings, { fetchImpl: turnstile() });
  assert.equal(response.status, 400);
  assert.match((await response.json()).errors.turnstileToken, /security check/i);
});

test("failed Turnstile validation is rejected", async () => {
  const { bindings } = services();
  const response = await handleContactRequest(request(), bindings, { fetchImpl: turnstile({ success: false }) });
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /security check/i);
});

test("wrong Turnstile hostname is rejected", async () => {
  const { bindings } = services();
  const response = await handleContactRequest(request(), bindings, {
    fetchImpl: turnstile({ success: true, hostname: "example.com", action: "contact" }),
  });
  assert.equal(response.status, 400);
});

test("successful Turnstile validation sends plain text mail", async () => {
  const { bindings, sent } = services();
  const response = await handleContactRequest(request(), bindings, {
    fetchImpl: turnstile(),
    now: () => new Date("2026-09-30T12:00:00.000Z"),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, privateRecipientFixture);
  assert.equal(sent[0].replyTo.email, validPayload.email);
  assert.match(sent[0].text, /untrusted submission content/i);
  assert.equal("html" in sent[0], false);
});

test("rate-limit rejection returns a generic 429", async () => {
  const { bindings } = services({ CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) } });
  const response = await handleContactRequest(request(), bindings, { fetchImpl: turnstile() });
  assert.equal(response.status, 429);
  assert.match((await response.json()).message, /wait and try again/i);
});

test("oversized payload is rejected", async () => {
  const { bindings } = services();
  const response = await handleContactRequest(request({}, { body: "x".repeat(32_001) }), bindings, { fetchImpl: turnstile() });
  assert.equal(response.status, 413);
});

test("mail send failure returns a generic response", async () => {
  const { bindings } = services({ EMAIL: { send: async () => { throw new Error("provider detail"); } } });
  const response = await handleContactRequest(request(), bindings, { fetchImpl: turnstile() });
  assert.equal(response.status, 502);
  assert.match((await response.json()).message, /could not be delivered/i);
});

test("unsupported method and content type are rejected", async () => {
  const { bindings } = services();
  const getResponse = await handleContactRequest(request(undefined, { method: "GET" }), bindings);
  assert.equal(getResponse.status, 405);
  assert.equal(getResponse.headers.get("allow"), "POST");
  const typeResponse = await handleContactRequest(request(validPayload, { contentType: "text/plain" }), bindings);
  assert.equal(typeResponse.status, 415);
});

test("API responses never expose the private recipient", async () => {
  for (const fetchImpl of [turnstile(), turnstile({ success: false })]) {
    const { bindings } = services();
    const response = await handleContactRequest(request(), bindings, { fetchImpl });
    assert.equal((await response.text()).includes(privateRecipientFixture), false);
  }
});

test("Contact source does not render a recipient and Corrections preselects its enquiry type", () => {
  const contactPage = fs.readFileSync(new URL("../app/contact/page.tsx", import.meta.url), "utf8");
  const contactForm = fs.readFileSync(new URL("../components/contact-form.tsx", import.meta.url), "utf8");
  const legal = fs.readFileSync(new URL("../lib/legal.ts", import.meta.url), "utf8");
  assert.equal(contactPage.includes(privateRecipientFixture), false);
  assert.equal(contactForm.includes(privateRecipientFixture), false);
  assert.doesNotMatch(`${contactPage}\n${contactForm}`, /mailto:/i);
  assert.match(legal, /\/contact\?type=correction/);
  assert.match(contactPage, /query\.type === "correction" \? "Correction"/);
});

console.log("DECODISTA Contact validation, Turnstile, rate-limit, email and privacy tests passed.");
