// Cloudflare Worker: guess a signup's full name from their email.
// Called by src/js/signup-3.js once the email field is valid. Secrets (never sent to the browser):
//   APOLLO_API_KEY        Apollo People Enrichment key
//   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret; Apollo is only called for a verified browser
//   CACHE_KEY_SECRET      HMAC key for the KV cache keys, so stored keys can't be matched to emails
//
// POST { "email": "jane.doe@acme.com", "turnstile_token": "..." }
//   -> 200 { "name": "Jane Doe", "source": "apollo" | "pattern" | "none" }
//
// Order: Apollo People Enrichment (work emails only, verified browsers only, under the daily cap),
// then the first.last pattern, then no name. Apollo errors and timeouts fall through to the
// pattern, so a slow or broken Apollo never blocks signup.

const APOLLO_MATCH_URL = "https://api.apollo.io/api/v1/people/match";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_APOLLO_TIMEOUT_MS = 2500;
const DEFAULT_APOLLO_DAILY_CAP = 1000;
const TURNSTILE_TIMEOUT_MS = 1500;
const MAX_BODY_BYTES = 4096;
// How long an Apollo answer is remembered. Names rarely change; a miss may match later.
const HIT_TTL_SECONDS = 180 * 24 * 60 * 60;
const MISS_TTL_SECONDS = 30 * 24 * 60 * 60;
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Personal mailbox providers. Apollo rarely matches them and each call costs a credit,
// so they go straight to the pattern.
export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "hotmail.fr", "hotmail.co.uk",
  "live.com", "live.fr", "msn.com", "yahoo.com", "yahoo.fr", "yahoo.co.uk", "ymail.com",
  "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com", "gmx.com",
  "gmx.de", "gmx.fr", "web.de", "orange.fr", "free.fr", "laposte.net", "sfr.fr", "wanadoo.fr",
  "mail.com", "zoho.com", "yandex.com", "yandex.ru", "qq.com", "163.com",
]);

// Local parts that look like first.last but are a team or a role, not a person.
const ROLE_WORDS = new Set([
  "admin", "accounts", "billing", "care", "contact", "customer", "customers", "dev", "help",
  "hello", "hi", "info", "mail", "marketing", "no", "noreply", "office", "ops", "orders",
  "reply", "sales", "service", "shop", "store", "support", "team", "test", "web", "webmaster",
]);

function capitalize(token) {
  return token.charAt(0).toLocaleUpperCase() + token.slice(1).toLocaleLowerCase();
}

// "jane.doe@", "jane_doe@", "jane-doe@" -> "Jane Doe". Anything else -> "".
export function nameFromEmailPattern(email) {
  if (typeof email !== "string") { return ""; }
  const localPart = email.trim().split("@")[0].split("+")[0];
  const tokens = localPart.split(/[._-]/);
  if (tokens.length !== 2) { return ""; }
  for (const token of tokens) {
    if (!/^\p{L}{2,}$/u.test(token)) { return ""; }
    if (ROLE_WORDS.has(token.toLowerCase())) { return ""; }
  }
  return tokens.map(capitalize).join(" ");
}

export function isFreeEmail(email) {
  return FREE_EMAIL_DOMAINS.has(String(email).split("@")[1] || "");
}

function cleanNamePart(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 100) : "";
}

export function nameFromApolloResponse(body) {
  const person = body && body.person;
  if (!person) { return ""; }
  const first = cleanNamePart(person.first_name);
  const last = cleanNamePart(person.last_name);
  if (first && last) { return first + " " + last; }
  return cleanNamePart(person.name);
}

async function fetchApolloName(email, env, fetchImpl) {
  if (!env.APOLLO_API_KEY) { return { name: "", outcome: "apollo_not_configured" }; }
  const timeoutMs = Number(env.APOLLO_TIMEOUT_MS) || DEFAULT_APOLLO_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = APOLLO_MATCH_URL + "?" + new URLSearchParams({
      email,
      reveal_personal_emails: "false",
      reveal_phone_number: "false",
    });
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": env.APOLLO_API_KEY,
      },
      signal: controller.signal,
    });
    if (!response.ok) { return { name: "", outcome: "apollo_http_" + response.status }; }
    const name = nameFromApolloResponse(await response.json());
    return { name, outcome: name ? "apollo_hit" : "apollo_miss" };
  } catch (error) {
    return { name: "", outcome: error && error.name === "AbortError" ? "apollo_timeout" : "apollo_error" };
  } finally {
    clearTimeout(timer);
  }
}

// skipApollo: a reason string ("free_email", "turnstile_failed", "daily_cap") or "" to call Apollo.
export async function enrichName(email, env, fetchImpl = fetch, skipApollo = "") {
  const apollo = skipApollo
    ? { name: "", outcome: "apollo_skipped_" + skipApollo }
    : await fetchApolloName(email, env, fetchImpl);
  if (apollo.name) { return { name: apollo.name, source: "apollo", apolloOutcome: apollo.outcome }; }
  const patternName = nameFromEmailPattern(email);
  if (patternName) { return { name: patternName, source: "pattern", apolloOutcome: apollo.outcome }; }
  return { name: "", source: "none", apolloOutcome: apollo.outcome };
}

// Turnstile proves the request comes from a real browser on our page, not a script replaying
// the Origin header. Fails closed: no secret, no token or a bad token means no Apollo call.
export async function verifyTurnstile(token, ip, env, fetchImpl = fetch) {
  if (!env.TURNSTILE_SECRET_KEY || typeof token !== "string" || !token || token.length > 2048) { return false; }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);
  try {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", token);
    if (ip) { form.append("remoteip", ip); }
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, { method: "POST", body: form, signal: controller.signal });
    const outcome = await response.json();
    if (!outcome.success) { return false; }
    // Tokens are bound to the action set on the page; reject tokens made for another form.
    return !outcome.action || outcome.action === "signup_name";
  } catch (_error) {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

function json(body, status, origin) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}

// HMAC, not a plain hash: a plain SHA-256 of an email can be reversed by hashing a list of emails.
export async function cacheKeyFor(email, env) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(env.CACHE_KEY_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(email));
  return "name:" + [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function apolloCountKey(now = new Date()) {
  return "apollo-count:" + now.toISOString().slice(0, 10);
}

// Approximate (KV is not atomic) but enough to stop a bot from burning the Apollo credits.
async function underDailyCap(env) {
  if (!env.NAMES) { return true; }
  const cap = Number(env.APOLLO_DAILY_CAP) || DEFAULT_APOLLO_DAILY_CAP;
  const count = Number(await env.NAMES.get(apolloCountKey())) || 0;
  return count < cap;
}

async function countApolloCall(env) {
  if (!env.NAMES) { return; }
  const key = apolloCountKey();
  const count = Number(await env.NAMES.get(key)) || 0;
  await env.NAMES.put(key, String(count + 1), { expirationTtl: 2 * 24 * 60 * 60 });
}

async function readBody(request) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_BODY_BYTES) { return null; }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) { return null; }
  try { return JSON.parse(text); } catch (_error) { return null; }
}

function log(fields) {
  console.log(JSON.stringify({ event: "signup_name_enrichment", ...fields }));
}

export default {
  async fetch(request, env, ctx, fetchImpl = fetch) {
    const origin = allowedOrigin(request, env);
    if (!origin) { return json({ error: "forbidden" }, 403, null); }
    if (request.method === "OPTIONS") { return json(null, 204, origin); }
    if (request.method !== "POST") { return json({ error: "method_not_allowed" }, 405, origin); }
    if (!(request.headers.get("Content-Type") || "").startsWith("application/json")) {
      return json({ error: "unsupported_media_type" }, 415, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "";
    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip || "unknown" });
      if (!success) { return json({ error: "rate_limited" }, 429, origin); }
    }

    const body = await readBody(request);
    if (!body) { return json({ error: "invalid_body" }, 400, origin); }
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !EMAIL_RE.test(email)) { return json({ error: "invalid_email" }, 400, origin); }
    const emailDomain = email.split("@")[1];

    // Personal mailboxes: pattern only, no Apollo, no Turnstile round trip, nothing stored.
    if (isFreeEmail(email)) {
      const result = await enrichName(email, env, fetchImpl, "free_email");
      log({ source: result.source, apollo_outcome: result.apolloOutcome, email_domain: emailDomain, cached: false });
      return json({ name: result.name, source: result.source }, 200, origin);
    }

    // Names come out of the cache only for a verified browser too, or the cache would be a free lookup service.
    const verified = await verifyTurnstile(body.turnstile_token, ip, env, fetchImpl);
    if (!verified) {
      const result = await enrichName(email, env, fetchImpl, "turnstile_failed");
      log({ source: result.source, apollo_outcome: result.apolloOutcome, email_domain: emailDomain, cached: false });
      return json({ name: result.name, source: result.source }, 200, origin);
    }

    const cacheKey = env.NAMES && env.CACHE_KEY_SECRET ? await cacheKeyFor(email, env) : null;
    if (cacheKey) {
      const cached = await env.NAMES.get(cacheKey, { type: "json" });
      if (cached) {
        // A remembered Apollo miss still gets the pattern.
        const name = cached.name || nameFromEmailPattern(email);
        const source = cached.name ? "apollo" : (name ? "pattern" : "none");
        log({ source, apollo_outcome: cached.name ? "cache_hit" : "cache_miss_remembered", email_domain: emailDomain, cached: true });
        return json({ name, source }, 200, origin);
      }
    }

    const skip = (await underDailyCap(env)) ? "" : "daily_cap";
    const result = await enrichName(email, env, fetchImpl, skip);
    log({ source: result.source, apollo_outcome: result.apolloOutcome, email_domain: emailDomain, cached: false });

    if (!skip && env.APOLLO_API_KEY) { ctx.waitUntil(countApolloCall(env)); }
    // Remember Apollo answers only; errors and timeouts are retried next time.
    if (cacheKey && (result.apolloOutcome === "apollo_hit" || result.apolloOutcome === "apollo_miss")) {
      const hit = result.apolloOutcome === "apollo_hit";
      ctx.waitUntil(env.NAMES.put(cacheKey, JSON.stringify({ name: hit ? result.name : "" }), {
        expirationTtl: hit ? HIT_TTL_SECONDS : MISS_TTL_SECONDS,
      }));
    }
    return json({ name: result.name, source: result.source }, 200, origin);
  },
};
