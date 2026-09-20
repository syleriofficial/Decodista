import { SITE_URL } from "@/lib/site";

const GITHUB_REPOSITORY = "syleriofficial/Decodista";
const CALLBACK_PATH = "/api/decap/callback";
const STATE_COOKIE = "__Host-decap_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;
const textEncoder = new TextEncoder();

interface OAuthEnvironment {
  clientId: string;
  clientSecret: string;
  stateSecret: string;
}

interface StatePayload {
  nonce: string;
  expiresAt: number;
  origin: string;
}

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

function getEnvironment(): OAuthEnvironment {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const stateSecret = process.env.DECAP_OAUTH_STATE_SECRET;
  if (!clientId || !clientSecret || !stateSecret) {
    throw new Error("DECODISTA CMS OAuth is not configured.");
  }
  return { clientId, clientSecret, stateSecret };
}

function encodeBase64Url(value: Uint8Array | string) {
  const bytes = typeof value === "string" ? textEncoder.encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importStateKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function createState(secret: string) {
  const nonce = crypto.getRandomValues(new Uint8Array(24));
  const payload: StatePayload = {
    nonce: encodeBase64Url(nonce),
    expiresAt: Math.floor(Date.now() / 1000) + STATE_TTL_SECONDS,
    origin: SITE_URL,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign("HMAC", await importStateKey(secret), textEncoder.encode(encodedPayload));
  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

async function verifyState(state: string, secret: string) {
  const [encodedPayload, encodedSignature, ...rest] = state.split(".");
  if (!encodedPayload || !encodedSignature || rest.length) return false;
  let signature: Uint8Array;
  let payload: StatePayload;
  try {
    signature = decodeBase64Url(encodedSignature);
    payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload))) as StatePayload;
  } catch {
    return false;
  }
  const valid = await crypto.subtle.verify(
    "HMAC",
    await importStateKey(secret),
    Uint8Array.from(signature).buffer,
    textEncoder.encode(encodedPayload),
  );
  return valid && payload.origin === SITE_URL && payload.expiresAt >= Math.floor(Date.now() / 1000);
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  for (const pair of cookie.split(";")) {
    const [key, ...value] = pair.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return undefined;
}

function stateCookie(value: string, maxAge = STATE_TTL_SECONDS) {
  return `${STATE_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function plainResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { ...noStoreHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

function callbackPage(status: "success" | "error", payload: Record<string, string>, statusCode = 200) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>DECODISTA publishing authorization</title>
</head>
<body>
  <p>${status === "success" ? "Authorization complete. This window will close automatically." : "Authorization failed. Close this window and try again."}</p>
  <script>
    (() => {
      const targetOrigin = ${JSON.stringify(SITE_URL)};
      const result = ${JSON.stringify(message)};
      const sendResult = (event) => {
        if (event.origin !== targetOrigin || event.source !== window.opener) return;
        window.opener.postMessage(result, targetOrigin);
        window.removeEventListener("message", sendResult);
        window.close();
      };
      window.addEventListener("message", sendResult);
      if (window.opener) window.opener.postMessage("authorizing:github", targetOrigin);
    })();
  </script>
</body>
</html>`;
  return new Response(html, {
    status: statusCode,
    headers: {
      ...noStoreHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'none'; img-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "Set-Cookie": stateCookie("", 0),
    },
  });
}

async function exchangeCode(code: string, environment: OAuthEnvironment) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "DECODISTA-CMS-OAuth",
    },
    body: JSON.stringify({
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      code,
      redirect_uri: `${SITE_URL}${CALLBACK_PATH}`,
    }),
  });
  if (!response.ok) throw new Error(`GitHub token exchange failed with ${response.status}.`);
  const result = await response.json() as { access_token?: unknown; error?: unknown };
  if (typeof result.access_token !== "string" || !result.access_token) {
    throw new Error(typeof result.error === "string" ? `GitHub OAuth error: ${result.error}.` : "GitHub did not return an access token.");
  }
  return result.access_token;
}

async function canPushToRepository(token: string) {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "DECODISTA-CMS-OAuth",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) return false;
  const repository = await response.json() as { permissions?: { push?: unknown } };
  return repository.permissions?.push === true;
}

export async function startDecapAuthorization(request: Request) {
  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("provider") !== "github") return plainResponse("Invalid OAuth provider.", 400);
  let environment: OAuthEnvironment;
  try {
    environment = getEnvironment();
  } catch {
    return plainResponse("DECODISTA publishing authentication is not configured yet.", 503);
  }

  const state = await createState(environment.stateSecret);
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", environment.clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${SITE_URL}${CALLBACK_PATH}`);
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      ...noStoreHeaders,
      Location: authorizeUrl.toString(),
      "Set-Cookie": stateCookie(state),
    },
  });
}

export async function completeDecapAuthorization(request: Request) {
  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("error")) return callbackPage("error", { error: "GitHub authorization was declined." }, 401);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const cookieState = readCookie(request, STATE_COOKIE);
  if (!code || !state || !cookieState || state !== cookieState) {
    return callbackPage("error", { error: "The authorization session is invalid or expired." }, 400);
  }

  let environment: OAuthEnvironment;
  try {
    environment = getEnvironment();
  } catch {
    return callbackPage("error", { error: "Publishing authentication is not configured." }, 503);
  }
  if (!(await verifyState(state, environment.stateSecret))) {
    return callbackPage("error", { error: "The authorization session is invalid or expired." }, 400);
  }

  try {
    const token = await exchangeCode(code, environment);
    if (!(await canPushToRepository(token))) {
      return callbackPage("error", { error: "This GitHub account does not have permission to publish DECODISTA." }, 403);
    }
    return callbackPage("success", { token });
  } catch (error) {
    console.error("DECODISTA CMS OAuth callback failed", error instanceof Error ? error.message : "unknown error");
    return callbackPage("error", { error: "GitHub authorization could not be completed." }, 502);
  }
}
