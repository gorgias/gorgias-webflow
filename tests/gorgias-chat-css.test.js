const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const CSS_PATH = path.join(__dirname, '..', 'src', 'css', 'gorgias-chat.css');
const GRADIENT = 'linear-gradient(120deg, #FFD1C4 0%, #E4D9FF 100%)';

function css() {
  return fs.readFileSync(CSS_PATH, 'utf8');
}

function rules(text) {
  var stripped = text.replace(/\/\*[\s\S]*?\*\//g, '');
  var out = [];
  var re = /([^{}]+)\{([^}]*)\}/g;
  var m;
  while ((m = re.exec(stripped)) !== null) {
    out.push({ selector: m[1].trim(), body: m[2] });
  }
  return out;
}

test('stylesheet applies the exact brand gradient', function () {
  assert.ok(css().includes(GRADIENT));
});

test('gradient declarations are !important', function () {
  var lines = css().split('\n').filter(function (l) { return l.includes('background-image:'); });
  assert.ok(lines.length > 0);
  lines.forEach(function (l) { assert.ok(l.includes('!important'), l); });
});

test('stylesheet does not paint a background on the launcher iframe itself', function () {
  rules(css()).forEach(function (rule) {
    if (!rule.body.includes('background-image')) {
      return;
    }
    rule.selector.split(',').forEach(function (sel) {
      var s = sel.trim();
      if (s.includes('#chat-button')) {
        assert.ok(
          s.includes('#chat-button:not(iframe)'),
          'selector may match the launcher iframe: ' + s
        );
      }
    });
  });
});

test('stylesheet leaves the chat bubble icon untouched', function () {
  var body = css().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/\bsvg\b/.test(body));
  assert.ok(!body.includes('fill:'));
  assert.ok(!body.includes('color:') || !/[^-]color:/.test(body.replace(/background-color:/g, '')));
});

test('stylesheet only paints the launcher pill, not wrappers or containers', function () {
  rules(css()).forEach(function (rule) {
    if (!rule.body.includes('background-image')) { return; }
    rule.selector.split(',').forEach(function (sel) {
      var s = sel.trim();
      assert.ok(
        s === '#chat-button:not(iframe)' || s === '#gorgias-chat-container > button',
        'selector is broader than the launcher pill: ' + s
      );
    });
  });
});

test('stylesheet does not override launcher position or size', function () {
  var body = css().replace(/\/\*[\s\S]*?\*\//g, '');
  ['bottom:', 'right:', 'width:', 'height:'].forEach(function (prop) {
    assert.ok(!body.includes(prop), 'unexpected declaration: ' + prop);
  });
});
