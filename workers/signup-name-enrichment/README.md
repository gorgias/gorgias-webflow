# signup-name-enrichment

Cloudflare Worker that fills the full name on gorgias.com/signup from the signup email
([GRWWEB-197](https://linear.app/gorgias/issue/GRWWEB-197)).

`src/js/signup-3.js` calls it once the email field is valid:

```
POST https://signup-name-enrichment.gorgias.workers.dev
{ "email": "jane.doe@acme.com", "turnstile_token": "..." }

200 { "name": "Jane Doe", "source": "apollo" }
```

`source` is one of:

| source    | meaning                                                                 |
|-----------|-------------------------------------------------------------------------|
| `apollo`  | Apollo People Enrichment returned a first and last name (now or from memory) |
| `pattern` | No Apollo name, and the email is `first.last@`, `first_last@` or `first-last@` |
| `none`    | No name. The user types it in the visible field                         |

Apollo is called only when all of these hold, otherwise the Worker goes straight to the pattern:

- the email is not on a personal mailbox provider (`FREE_EMAIL_DOMAINS`: Gmail, Outlook, Yahoo, iCloud...);
- the browser passed Cloudflare Turnstile (token checked server side, action `signup_name`);
- the email isn't already remembered;
- today's Apollo calls are under `APOLLO_DAILY_CAP`.

Apollo errors and timeouts (2.5 s by default) fall through to the pattern. If the Worker is down,
`signup-3.js` applies the same pattern itself, so signup never waits on enrichment for long.

## Memory

Apollo answers are stored in Workers KV (`NAMES`), shared by every Cloudflare location:
a hit for 180 days, a miss for 30 days. Errors and timeouts are not stored. Keys are an
HMAC-SHA-256 of the email with `CACHE_KEY_SECRET`, so the store holds no email, and its keys
can't be matched to a list of emails without the secret. Values hold only the name.

## Protection

- **Turnstile**: the Origin check alone is easy to fake from a script. Without a valid Turnstile
  token, the Worker never calls Apollo and never reads the memory, so it can't be used to look up
  names. It fails closed: no `TURNSTILE_SECRET_KEY` means no Apollo.
- **Daily cap** on Apollo calls (`APOLLO_DAILY_CAP`, approximate) bounds the credits a bot can burn.
- **Rate limit** per IP (`RATE_LIMITER`, 10 per minute).
- **Origin allowlist** (`ALLOWED_ORIGINS`, exact match), JSON only, 4 KB body max, `no-store` responses.
- Secrets (`APOLLO_API_KEY`, `TURNSTILE_SECRET_KEY`, `CACHE_KEY_SECRET`) live only in the Worker.

## Logs

Each lookup logs one JSON line, without the email or the name:

```
{"event":"signup_name_enrichment","source":"apollo","apollo_outcome":"apollo_hit","email_domain":"acme.com","cached":false}
```

`apollo_outcome` is `apollo_hit`, `apollo_miss`, `apollo_timeout`, `apollo_error`, `apollo_http_<status>`,
`apollo_not_configured`, `apollo_skipped_free_email`, `apollo_skipped_turnstile_failed`,
`apollo_skipped_daily_cap`, `cache_hit` or `cache_miss_remembered`. Read them in Workers Logs
(observability is on). The browser also sends a `Signup Name Enrichment` Segment event with the same `source`.

## Deploy

1. Cloudflare dashboard > Turnstile: add a widget for `www.gorgias.com`, `gorgias.com` and
   `gorgiasio.webflow.io`, mode **Invisible**. Put its site key in `TURNSTILE_SITE_KEY` in
   `src/js/signup-3.js` (or `window.SIGNUP_TURNSTILE_SITE_KEY` in the Webflow page code).
   Invisible mode needs the Turnstile Privacy Addendum referenced in the privacy policy.
2. Then:

```bash
cd workers/signup-name-enrichment
npx wrangler kv namespace create NAMES        # paste the id in wrangler.toml
npx wrangler secret put APOLLO_API_KEY        # key from GTM Ops
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put CACHE_KEY_SECRET      # openssl rand -hex 32
npx wrangler deploy
```

If the Worker ends up on another URL, set `window.SIGNUP_NAME_ENRICHMENT_URL` in the Webflow page
custom code, or change `NAME_ENRICHMENT_ENDPOINT` in `src/js/signup-3.js`.
