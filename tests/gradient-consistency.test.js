const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const CSS_PATH = path.join(__dirname, '..', 'src', 'css', 'gorgias-chat.css');
const JS_PATH = path.join(__dirname, '..', 'src', 'js', 'gorgias-chat-launcher.js');

const GRADIENT_RE = /linear-gradient\(120deg,[^)]*\)/g;

function gradientsIn(file) {
  return fs.readFileSync(file, 'utf8').match(GRADIENT_RE) || [];
}

test('both delivery paths declare a launcher gradient', function () {
  assert.strictEqual(gradientsIn(CSS_PATH).length, 1);
  assert.strictEqual(gradientsIn(JS_PATH).length, 1);
});

test('the page stylesheet and the iframe stylesheet use the same gradient', function () {
  assert.strictEqual(
    gradientsIn(CSS_PATH)[0],
    gradientsIn(JS_PATH)[0],
    'the two delivery paths would paint different gradients depending on how the widget renders the launcher'
  );
});
