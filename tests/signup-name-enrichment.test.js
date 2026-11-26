const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SIGNUP = path.join(__dirname, '..', 'src', 'js', 'signup-3.js');

// Pull the email pattern fallback out of signup-3.js to test it on its own.
function loadClientPattern() {
  const src = fs.readFileSync(SIGNUP, 'utf8');
  const start = src.indexOf('    const NAME_PATTERN_ROLE_WORDS');
  const end = src.indexOf('\n    }\n', src.indexOf('function nameFromEmailPattern')) + 7;
  assert.ok(start > 0 && end > start, 'nameFromEmailPattern not found in signup-3.js');
  const ctx = {};
  vm.runInNewContext(src.slice(start, end) + '\nthis.fn = nameFromEmailPattern;', ctx);
  return ctx.fn;
}

test('email pattern fallback', () => {
  const nameFromEmailPattern = loadClientPattern();
  const cases = [
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
  for (const [email, expected] of cases) {
    assert.strictEqual(nameFromEmailPattern(email), expected, email);
  }
});

test('signup-3.js no longer copies the email into the full name', () => {
  const src = fs.readFileSync(SIGNUP, 'utf8');
  assert.doesNotMatch(src, /mirrorEmailToFullname/);
  assert.doesNotMatch(src, /fullnameField\.val\(\s*emailField\.val\(\)\s*\)/);
});

test('signup-3.js holds no enrichment vendor key or vendor call', () => {
  const src = fs.readFileSync(SIGNUP, 'utf8');
  assert.doesNotMatch(src, /apollo|x-api-key/i);
});
