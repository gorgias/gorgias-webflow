const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const CSS_PATH = path.join(__dirname, '..', 'src', 'css', 'gorgias-chat.css');
const GRADIENT = 'linear-gradient(120deg, #FFCEBC 0%, #FFD1C2 15%, #E4D9FF 100%)';

function css() {
  return fs.readFileSync(CSS_PATH, 'utf8');
}

function norm(s) {
  return s.replace(/\s+/g, ' ').trim();
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

var PILL_SELECTORS = ['#chat-button:not(iframe)', '#gorgias-chat-container > button'];

test('stylesheet only paints the launcher pill, not wrappers or containers', function () {
  rules(css()).forEach(function (rule) {
    if (!rule.body.includes('background-image')) { return; }
    rule.selector.split(',').forEach(function (sel) {
      var s = sel.trim();
      var isPill = PILL_SELECTORS.indexOf(s) !== -1;
      // the pill's own paint layers are in scope; anything above the pill is not
      var isPillLayer = PILL_SELECTORS.some(function (p) { return s === p + ' > div'; });
      assert.ok(isPill || isPillLayer, 'selector is broader than the launcher pill: ' + s);
    });
  });
});

test('stylesheet clears the widget paint layers stacked over the pill', function () {
  var layerRules = rules(css()).filter(function (rule) {
    return / > div$/.test(rule.selector.split(',').pop().trim());
  });
  assert.ok(layerRules.length > 0, 'no paint-layer rule found');
  layerRules.forEach(function (rule) {
    var body = norm(rule.body);
    assert.match(body, /background-image:\s*none\s*!important/);
    assert.match(body, /backdrop-filter:\s*none\s*!important/);
    assert.match(body, /filter:\s*none\s*!important/);
  });
});

test('stylesheet does not override launcher position or size', function () {
  var body = css().replace(/\/\*[\s\S]*?\*\//g, '');
  ['bottom:', 'right:', 'width:', 'height:'].forEach(function (prop) {
    assert.ok(!body.includes(prop), 'unexpected declaration: ' + prop);
  });
});
