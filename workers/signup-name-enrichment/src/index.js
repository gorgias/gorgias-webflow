// Cloudflare Worker: guess a signup's full name from their email.
// Called by src/js/signup-3.js once the email field is valid. The Apollo key is a
// Worker secret (APOLLO_API_KEY), never sent to the browser.
//
// POST { "email": "jane.doe@acme.com" }
//   -> 200 { "name": "Jane Doe", "source": "apollo" | "pattern" | "none" }
//
// Order: Apollo People Enrichment, then the first.last pattern, then no name.
// Apollo errors and timeouts fall through to the pattern, so a slow or broken
// Apollo never blocks signup.

const APOLLO_MATCH_URL = "https://api.apollo.io/api/v1/people/match";
const DEFAULT_APOLLO_TIMEOUT_MS = 2500;
const CACHE_TTL_SECONDS = 24 * 60 * 60;
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

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

function cleanNamePart(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
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

export async function enrichName(email, env, fetchImpl = fetch) {
  const apollo = await fetchApolloName(email, env, fetchImpl);
  if (apollo.name) { return { name: apollo.name, source: "apollo", apolloOutcome: apollo.outcome }; }
  const patternName = nameFromEmailPattern(email);
  if (patternName) { return { name: patternName, source: "pattern", apolloOutcome: apollo.outcome }; }
  return { name: "", source: "none", apolloOutcome: apollo.outcome };
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
  for (const entry of allowed) {
    // "*.example.com" allows any subdomain of example.com over https.
    if (entry.startsWith("*.")) {
      if (origin.startsWith("https://") && origin.endsWith(entry.slice(1))) { return origin; }
    } else if (origin === entry) {
      return origin;
    }
  }
  return null;
}

function json(body, status, origin) {
  const headers = { "Content-Type": "application/json", "Vary": "Origin" };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}

async function cacheKeyFor(email) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return new Request("https://signup-name-enrichment.cache/" + hex);
}

export default {
  async fetch(request, env, ctx) {
    const origin = allowedOrigin(request, env);
    if (!origin) { return json({ error: "forbidden" }, 403, null); }
    if (request.method === "OPTIONS") { return json(null, 204, origin); }
    if (request.method !== "POST") { return json({ error: "method_not_allowed" }, 405, origin); }

    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) { return json({ error: "rate_limited" }, 429, origin); }
    }

    let email = "";
    try {
      const body = await request.json();
      email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    } catch (_error) {
      return json({ error: "invalid_json" }, 400, origin);
    }
    if (!EMAIL_RE.test(email) || email.length > 254) { return json({ error: "invalid_email" }, 400, origin); }

    // The same email is often sent more than once (blur, retype). Cache so Apollo is billed once.
    const cache = caches.default;
    const cacheKey = await cacheKeyFor(email);
    const cached = await cache.match(cacheKey);
    if (cached) {
      const result = await cached.json();
      console.log(JSON.stringify({ event: "signup_name_enrichment", source: result.source, cached: true }));
      return json({ name: result.name, source: result.source }, 200, origin);
    }

    const result = await enrichName(email, env);
    // Log the outcome to measure the match rate. No email or name in the logs, only the domain.
    console.log(JSON.stringify({
      event: "signup_name_enrichment",
      source: result.source,
      apollo_outcome: result.apolloOutcome,
      email_domain: email.split("@")[1],
      cached: false,
    }));

    const payload = { name: result.name, source: result.source };
    // Don't cache Apollo failures: a later call may succeed.
    if (result.source === "apollo" || result.apolloOutcome === "apollo_miss") {
      ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(payload), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=" + CACHE_TTL_SECONDS },
      })));
    }
    return json(payload, 200, origin);
  },
};
