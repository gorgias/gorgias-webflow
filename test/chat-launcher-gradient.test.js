const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const norm = (s) => s.replace(/\s+/g, ' ');

test('global-styles.css sets the chat launcher gradient with !important', () => {
  const css = norm(read('src/css/global-styles.css'));
  assert.match(css, /#gorgias-chat-messenger-button\s*\{[^}]*\}/);
  assert.match(
    css,
    /#gorgias-chat-messenger-button\s*\{[^}]*background:\s*linear-gradient\(120deg,\s*#FFD1C4\s*0%,\s*#E4D9FF\s*100%\)\s*!important[^}]*\}/i
  );
});
