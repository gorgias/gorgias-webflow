const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const WORKER = path.join(__dirname, '..', 'workers', 'signup-name-enrichment', 'src', 'index.js');
const SIGNUP = path.join(__dirname, '..', 'src', 'js', 'signup-3.js');

function loadWorker() {
  return import('file://' + WORKER);
}

// Pull the browser copy of the pattern rule out of signup-3.js so both copies are tested alike.
function loadClientPattern() {
  const src = fs.readFileSync(SIGNUP, 'utf8');
  const start = src.indexOf('    const NAME_PATTERN_ROLE_WORDS');
  const end = src.indexOf('\n    }\n', src.indexOf('function nameFromEmailPattern')) + 7;
  assert.ok(start > 0 && end > start, 'nameFromEmailPattern not found in signup-3.js');
  const ctx = {};
  vm.runInNewContext(src.slice(start, end) + '\nthis.fn = nameFromEmailPattern;', ctx);
  return ctx.fn;
}

const PATTERN_CASES = [
  ['jane.doe@acme.com', 'Jane Doe'],
  ['jane_doe@acme.com', 'Jane Doe'],
  ['jane-doe@acme.com', 'Jane Doe'],
  ['JANE.DOE@acme.com', 'Jane Doe'],
  ['jane.doe+shop@gmail.com', 'Jane Doe'],
  ['élodie.durand@acme.fr', 'Élodie Durand'],
  ['jane@acme.com', ''],
  ['jdoe@acme.com', ''],
  ['jane.m.doe@acme.com', ''],
  ['jane.doe2@acme.com', ''],
  ['j.doe@acme.com', ''],
  ['sales.team@acme.com', ''],
  ['info.shop@acme.com', ''],
  ['', ''],
];

test('worker pattern fallback', async () => {
  const { nameFromEmailPattern } = await loadWorker();
  for (const [email, expected] of PATTERN_CASES) {
    assert.strictEqual(nameFromEmailPattern(email), expected, email);
  }
});

test('signup-3.js pattern fallback matches the worker', () => {
  const clientPattern = loadClientPattern();
  for (const [email, expected] of PATTERN_CASES) {
    assert.strictEqual(clientPattern(email), expected, email);
  }
});

test('signup-3.js no longer copies the email into the full name', () => {
  const src = fs.readFileSync(SIGNUP, 'utf8');
  assert.doesNotMatch(src, /mirrorEmailToFullname/);
  assert.doesNotMatch(src, /fullnameField\.val\(\s*emailField\.val\(\)\s*\)/);
});

test('signup-3.js has no Apollo key or Apollo call', () => {
  const src = fs.readFileSync(SIGNUP, 'utf8');
  assert.doesNotMatch(src, /api\.apollo\.io|x-api-key|APOLLO_API_KEY/i);
});

function apolloResponse(body, status = 200) {
  return async () => new Response(JSON.stringify(body), { status });
}

test('enrichName uses the Apollo name first', async () => {
  const { enrichName } = await loadWorker();
  const result = await enrichName('jane.doe@acme.com', { APOLLO_API_KEY: 'k' },
    apolloResponse({ person: { first_name: 'Janet', last_name: 'Doe-Smith' } }));
  assert.deepStrictEqual(result, { name: 'Janet Doe-Smith', source: 'apollo', apolloOutcome: 'apollo_hit' });
});

test('enrichName sends the key in a header, not in the URL', async () => {
  const { enrichName } = await loadWorker();
  let seen;
  await enrichName('jane.doe@acme.com', { APOLLO_API_KEY: 'secret-key' }, async (url, init) => {
    seen = { url, init };
    return new Response('{}');
  });
  assert.ok(!seen.url.includes('secret-key'));
  assert.strictEqual(seen.init.headers['x-api-key'], 'secret-key');
});

test('enrichName falls back to the pattern on miss, error, HTTP error and no key', async () => {
  const { enrichName } = await loadWorker();
  const env = { APOLLO_API_KEY: 'k' };
  assert.deepStrictEqual(await enrichName('jane.doe@acme.com', env, apolloResponse({ person: null })),
    { name: 'Jane Doe', source: 'pattern', apolloOutcome: 'apollo_miss' });
  assert.deepStrictEqual(await enrichName('jane.doe@acme.com', env, async () => { throw new Error('boom'); }),
    { name: 'Jane Doe', source: 'pattern', apolloOutcome: 'apollo_error' });
  assert.deepStrictEqual(await enrichName('jane.doe@acme.com', env, apolloResponse({}, 429)),
    { name: 'Jane Doe', source: 'pattern', apolloOutcome: 'apollo_http_429' });
  assert.deepStrictEqual(await enrichName('jane.doe@acme.com', {}, apolloResponse({})),
    { name: 'Jane Doe', source: 'pattern', apolloOutcome: 'apollo_not_configured' });
});

test('enrichName returns no name, never the email, when nothing matches', async () => {
  const { enrichName } = await loadWorker();
  const result = await enrichName('jdoe@gmail.com', { APOLLO_API_KEY: 'k' }, apolloResponse({}));
  assert.deepStrictEqual(result, { name: '', source: 'none', apolloOutcome: 'apollo_miss' });
});

test('enrichName stops waiting for Apollo after the timeout', async () => {
  const { enrichName } = await loadWorker();
  const hang = (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => {
      const e = new Error('aborted'); e.name = 'AbortError'; reject(e);
    });
  });
  const started = Date.now();
  const result = await enrichName('jane.doe@acme.com', { APOLLO_API_KEY: 'k', APOLLO_TIMEOUT_MS: '50' }, hang);
  assert.ok(Date.now() - started < 1000);
  assert.deepStrictEqual(result, { name: 'Jane Doe', source: 'pattern', apolloOutcome: 'apollo_timeout' });
});

test('worker rejects origins that are not allowed and answers CORS preflight', async () => {
  const worker = (await loadWorker()).default;
  const env = { ALLOWED_ORIGINS: 'https://www.gorgias.com' };
  const bad = await worker.fetch(new Request('https://w.dev', {
    method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{}',
  }), env, {});
  assert.strictEqual(bad.status, 403);
  const preflight = await worker.fetch(new Request('https://w.dev', {
    method: 'OPTIONS', headers: { Origin: 'https://www.gorgias.com' },
  }), env, {});
  assert.strictEqual(preflight.status, 204);
  assert.strictEqual(preflight.headers.get('Access-Control-Allow-Origin'), 'https://www.gorgias.com');
});

test('worker rejects an invalid email', async () => {
  const worker = (await loadWorker()).default;
  const res = await worker.fetch(new Request('https://w.dev', {
    method: 'POST', headers: { Origin: 'https://www.gorgias.com' }, body: JSON.stringify({ email: 'nope' }),
  }), { ALLOWED_ORIGINS: 'https://www.gorgias.com' }, {});
  assert.strictEqual(res.status, 400);
});
