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

  // gated to gorgias.com, so no other host running this file is restyled
  assert.match(js, /window\.location\.hostname/);
  assert.match(js, /gorgias\\\.com\$?\/\.test/);

  // targets the widget iframe and styles its own document, not the parent page
  assert.match(js, /div\[data-gorgias-widget="true"\] iframe#chat-button/);
  assert.match(js, /contentDocument/);
  assert.match(js, /createElement\('style'\)/);
  assert.match(js, /doc\.head\.appendChild/);
  assert.match(js, /#gorgias-chat-messenger-button/);
  assert.match(js, /linear-gradient\(120deg,\s*#FFD1C4\s*0%,\s*#E4D9FF\s*100%\)\s*!important/i);

  // waits for the iframe document: load event plus a bounded retry
  assert.match(js, /addEventListener\('load'/);
  assert.match(js, /setInterval/);
  assert.match(js, /clearInterval/);

  // re-applies when the widget re-renders
  assert.match(js, /MutationObserver/);

  // wired into the post-init chain
  assert.match(js, /initGorgiasChatPromise\.then\([\s\S]*applyChatLauncherGradient/);
});

test('launcher gradient injection is idempotent and binds its load listener once', () => {
  const js = norm(read('src/js/gorgiaschat.js'));

  // an existing style element short-circuits as success, so no duplicate <style> is appended
  assert.match(js, /if \(doc\.getElementById\(CHAT_LAUNCHER_STYLE_ID\)\) return true;/);

  // the load listener is guarded by a per-iframe flag, so repeated observer callbacks
  // cannot pile listeners onto the same iframe
  assert.match(js, /if \(!iframe\.dataset\[CHAT_LAUNCHER_BOUND_FLAG\]\)/);
  assert.match(js, /iframe\.dataset\[CHAT_LAUNCHER_BOUND_FLAG\] = 'true';/);
});
