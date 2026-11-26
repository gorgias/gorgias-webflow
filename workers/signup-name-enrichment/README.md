# signup-name-enrichment

Cloudflare Worker that fills the full name on gorgias.com/signup from the signup email
([GRWWEB-197](https://linear.app/gorgias/issue/GRWWEB-197)).

`src/js/signup-3.js` calls it once the email field is valid:

```
POST https://signup-name-enrichment.gorgias.workers.dev
{ "email": "jane.doe@acme.com" }

200 { "name": "Jane Doe", "source": "apollo" }
```

`source` is one of:

| source    | meaning                                                                 |
|-----------|-------------------------------------------------------------------------|
| `apollo`  | Apollo People Enrichment returned a first and last name                 |
| `pattern` | Apollo found nothing (or failed or timed out), and the email is `first.last@`, `first_last@` or `first-last@` |
| `none`    | No name. The user types it in the visible field                         |

Apollo errors and timeouts (2.5 s by default) fall through to the pattern. If the Worker is
down, `signup-3.js` applies the same pattern itself, so signup never waits on enrichment.

## Protection

- Only answers browser requests from the origins in `ALLOWED_ORIGINS`.
- Rate limited per IP (`RATE_LIMITER` binding, 20 per minute).
- Results are cached for 24 h per email (SHA-256 key), so a retyped email is billed once.
- The Apollo key lives only in the Worker secret `APOLLO_API_KEY`.

## Logs

Each lookup logs one JSON line, without the email or the name:

```
{"event":"signup_name_enrichment","source":"apollo","apollo_outcome":"apollo_hit","email_domain":"acme.com","cached":false}
```

`apollo_outcome` is `apollo_hit`, `apollo_miss`, `apollo_timeout`, `apollo_error`, `apollo_http_<status>` or
`apollo_not_configured`. Read them in Workers Logs (observability is on). The browser also sends a
`Signup Name Enrichment` Segment event with the same `source`.

## Deploy

```bash
cd workers/signup-name-enrichment
npx wrangler secret put APOLLO_API_KEY   # key from GTM Ops
npx wrangler deploy
```

If the Worker ends up on another URL, set `window.SIGNUP_NAME_ENRICHMENT_URL` in the Webflow page
custom code, or change `NAME_ENRICHMENT_ENDPOINT` in `src/js/signup-3.js`.
