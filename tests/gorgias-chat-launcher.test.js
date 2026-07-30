const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = path.join(__dirname, '..', 'src', 'js', 'gorgias-chat-launcher.js');
const GRADIENT = 'linear-gradient(120deg, #FFCEBC 0%, #FFD1C2 15%, #E4D9FF 100%)';

function fakeDoc() {
  var doc = {
    head: {
      children: [],
      appendChild: function (el) { this.children.push(el); return el; },
      querySelector: function (sel) {
        var id = sel.replace('#', '');
        return this.children.filter(function (c) { return c.id === id; })[0] || null;
      }
    },
    createElement: function (tag) { return { tag: tag, id: '', textContent: '' }; }
  };
  doc.querySelector = function (sel) { return doc.head.querySelector(sel); };
  return doc;
}

function loadModule(overrides) {
  var counts = { setInterval: 0, observer: 0 };
  var doc = {
    querySelector: function () { return null; },
    body: { nodeType: 1 },
    head: fakeDoc().head,
    createElement: function (tag) { return { tag: tag, id: '', textContent: '' }; },
    addEventListener: function () {}
  };
  Object.assign(doc, overrides || {});
  var context = {
    window: { addEventListener: function () {} },
    document: doc,
    setTimeout: function () { return 0; },
    clearTimeout: function () {},
    setInterval: function () { counts.setInterval++; return counts.setInterval; },
    clearInterval: function () {},
    MutationObserver: function () {
      counts.observer++;
      this.observe = function () {};
      this.disconnect = function () {};
    },
    console: console
  };
  context.window.document = doc;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(SRC, 'utf8'), context, { filename: SRC });
  return { api: context.window.GorgiasLauncherBrand, win: context.window, doc: doc, counts: counts };
}

test('launcherCss contains the exact brand gradient', function () {
  var css = loadModule().api.launcherCss();
  assert.ok(css.includes(GRADIENT));
});

test('launcherCss marks the background declarations !important', function () {
  var css = loadModule().api.launcherCss();
  var lines = css.split('\n').filter(function (l) { return l.includes('background-image:'); });
  assert.ok(lines.length > 0);
  lines.forEach(function (l) { assert.ok(l.includes('!important'), l); });
});

test('launcherCss leaves the chat bubble icon untouched', function () {
  var css = loadModule().api.launcherCss();
  assert.ok(!/\bsvg\b/.test(css));
  assert.ok(!css.includes('fill:'));
  assert.ok(!/[^-]color:/.test(css.replace(/background-color:/g, '')));
});

test('launcherCss only paints the launcher button, not its containers', function () {
  var css = loadModule().api.launcherCss();
  assert.ok(!/^\s*(html|body)\s*[,{]/m.test(css));
  css.split('\n').filter(function (l) { return l.includes('{'); }).forEach(function (l) {
    l.split('{')[0].split(',').forEach(function (sel) {
      var s = sel.trim();
      if (!s) { return; }
      // the pill itself, or one of the pill's own paint layers
      assert.ok(
        s === '#gorgias-chat-messenger-button' ||
          s === '#gorgias-chat-messenger-button > div',
        'selector is not scoped to the button: ' + s
      );
    });
  });
});

test('launcherCss clears the widget paint layers stacked over the pill', function () {
  var css = loadModule().api.launcherCss();
  var start = css.indexOf('#gorgias-chat-messenger-button > div {');
  assert.ok(start !== -1, 'no paint-layer rule found');
  var body = css.slice(start, css.indexOf('}', start));
  assert.match(body, /background-image:\s*none\s*!important/);
  assert.match(body, /background-color:\s*transparent\s*!important/);
  assert.match(body, /backdrop-filter:\s*none\s*!important/);
  assert.match(body, /filter:\s*none\s*!important/);
});

test('applyLauncherStyle injects a keyed style element into the iframe document', function () {
  var api = loadModule().api;
  var doc = fakeDoc();
  assert.strictEqual(api.applyLauncherStyle(doc), true);
  assert.strictEqual(doc.head.children.length, 1);
  assert.strictEqual(doc.head.children[0].id, api.STYLE_ID);
  assert.strictEqual(api.STYLE_ID, 'gorgias-launcher-brand');
  assert.ok(doc.head.children[0].textContent.includes(GRADIENT));
});

test('applyLauncherStyle is idempotent', function () {
  var api = loadModule().api;
  var doc = fakeDoc();
  assert.strictEqual(api.applyLauncherStyle(doc), true);
  assert.strictEqual(api.applyLauncherStyle(doc), false);
  assert.strictEqual(doc.head.children.length, 1);
});

test('applyLauncherStyle tolerates a missing document', function () {
  var api = loadModule().api;
  assert.strictEqual(api.applyLauncherStyle(null), false);
  assert.strictEqual(api.applyLauncherStyle({}), false);
});

test('styleLauncher returns false when the launcher is not in the DOM yet', function () {
  var mod = loadModule({ body: null, querySelector: function () { return null; } });
  assert.strictEqual(mod.api.styleLauncher(), false);
});

test('styleLauncher does not throw when the iframe document is unreachable', function () {
  var el = {};
  Object.defineProperty(el, 'contentDocument', {
    get: function () { throw new Error('cross-origin'); }
  });
  var mod = loadModule({ body: null, querySelector: function () { return el; } });
  assert.strictEqual(mod.api.styleLauncher(), false);
});

test('styleLauncher injects into the #chat-button iframe document', function () {
  var inner = fakeDoc();
  var queried = [];
  var mod = loadModule({
    body: null,
    querySelector: function (sel) { queried.push(sel); return { contentDocument: inner }; }
  });
  assert.strictEqual(mod.api.styleLauncher(), true);
  assert.strictEqual(inner.head.children.length, 1);
  assert.ok(queried.includes('#chat-button'));
});

test('styleLauncher re-applies the style when the iframe swaps document', function () {
  var el = { contentDocument: fakeDoc(), listeners: [] };
  el.addEventListener = function (type, fn) { el.listeners.push({ type: type, fn: fn }); };
  var mod = loadModule({ body: null, querySelector: function () { return el; } });

  assert.strictEqual(mod.api.styleLauncher(), true);
  var loadListeners = el.listeners.filter(function (l) { return l.type === 'load'; });
  assert.strictEqual(loadListeners.length, 1, 'exactly one load listener is bound');

  // the widget replaces about:blank with its real document, losing the style
  var replaced = fakeDoc();
  el.contentDocument = replaced;
  loadListeners[0].fn();
  assert.strictEqual(replaced.head.children.length, 1);
  assert.ok(replaced.head.children[0].textContent.includes(GRADIENT));

  // repeated passes over the same element do not stack listeners
  mod.api.styleLauncher();
  assert.strictEqual(el.listeners.filter(function (l) { return l.type === 'load'; }).length, 1);
});

test('start is idempotent', function () {
  var mod = loadModule();
  mod.api.start();
  mod.api.start();
  assert.strictEqual(mod.win.__gorgiasLauncherBrandInit, true);
  assert.strictEqual(mod.counts.setInterval, 1);
  assert.strictEqual(mod.counts.observer, 1);
});
