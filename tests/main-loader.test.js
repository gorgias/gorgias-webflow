const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const MAIN = path.join(__dirname, '..', 'src', 'main.js');

function lines() {
  return fs.readFileSync(MAIN, 'utf8').split('\n');
}

function indentOf(pattern) {
  var line = lines().filter(function (l) { return pattern.test(l); })[0];
  assert.ok(line, 'no line matching ' + pattern);
  return line.match(/^\s*/)[0].length;
}

const STYLE_RE = /newStyle\(scriptBase \+ '\/src\/css\/gorgias-chat'\+minBase\+'\.css'/;
const SCRIPT_RE = /newScript\(scriptBase \+ '\/src\/js\/gorgias-chat-launcher'\+minBase\+'\.js'/;

test('main.js loads the gorgias chat launcher stylesheet globally', function () {
  assert.match(fs.readFileSync(MAIN, 'utf8'), STYLE_RE);
});

test('main.js loads the gorgias chat launcher script globally', function () {
  assert.match(fs.readFileSync(MAIN, 'utf8'), SCRIPT_RE);
});

test('launcher assets are not gated behind a path check', function () {
  var baseline = indentOf(/newStyle\(scriptBase \+ '\/src\/css\/all'\+minBase\+'\.css'/);
  assert.strictEqual(indentOf(STYLE_RE), baseline);
  assert.strictEqual(indentOf(SCRIPT_RE), baseline);
});
