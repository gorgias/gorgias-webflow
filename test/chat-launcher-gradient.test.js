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

test('gorgiaschat.js injects the launcher gradient into the #chat-button iframe', () => {
  const js = norm(read('src/js/gorgiaschat.js'));

  assert.match(js, /gorgias\\?\.com[^;]*hostname/i);
  assert.match(js, /data-gorgias-widget="true"/);
  assert.match(js, /#chat-button/);
  assert.match(js, /contentDocument/);
  assert.match(js, /createElement\('style'\)/);
  assert.match(js, /#gorgias-chat-messenger-button/);
  assert.match(js, /linear-gradient\(120deg,\s*#FFD1C4\s*0%,\s*#E4D9FF\s*100%\)\s*!important/i);
  assert.match(js, /MutationObserver/);
  assert.match(js, /initGorgiasChatPromise\.then\([\s\S]*applyChatLauncherGradient/);
});
