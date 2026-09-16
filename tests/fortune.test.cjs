const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { fortunes, pickFortune } = require('../dist/fortunes.js');

test('all 20 fortunes are reachable and no previous fortune repeats', () => {
  assert.equal(fortunes.length, 20);
  assert.equal(new Set(fortunes).size, 20);
  for (let previous = -1; previous < fortunes.length; previous++) {
    const count = previous === -1 ? 20 : 19;
    const seen = new Set();
    for (let slot = 0; slot < count; slot++) {
      const result = pickFortune(previous, () => (slot + 0.5) / count);
      assert.notEqual(result.index, previous);
      assert.equal(result.text, fortunes[result.index]);
      seen.add(result.index);
    }
    assert.equal(seen.size, count);
  }
});

function setup(reduced = false) {
  const elements = {};
  for (const id of ['stage', 'cookie', 'open', 'reset', 'slip', 'fortune', 'hint', 'announcement']) {
    const classes = new Set();
    elements[id] = { textContent: '', disabled: false, hidden: id === 'reset', attributes: {},
      classList: { add: (...names) => names.forEach(n => classes.add(n)), remove: (...names) => names.forEach(n => classes.delete(n)), contains: n => classes.has(n) },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) { this[name] = callback; }, focus() {} };
  }
  const timers = [];
  let picks = 0;
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/script.js'), 'utf8'), {
    document: { getElementById: id => elements[id] },
    window: { matchMedia: () => ({ matches: reduced }) },
    setTimeout: (callback, ms) => timers.push({ callback, ms }),
    FortuneCookies: { pickFortune(previous) { picks++; return pickFortune(previous, () => 0); } }
  });
  return { elements, timers, get picks() { return picks; }, async tick() { timers.shift().callback(); await Promise.resolve(); } };
}

for (const reduced of [false, true]) {
  test(`reveal locks input, waits for crack, and resets cleanly (reduced motion: ${reduced})`, async () => {
    const app = setup(reduced);
    const e = app.elements;
    const opening = e.open.click();
    await e.cookie.click();
    assert.equal(app.timers.length, 1);
    assert.equal(e.open.disabled, true);
    assert.equal(e.fortune.textContent, '');
    assert.equal(app.timers[0].ms, reduced ? 0 : 500);
    await app.tick();
    assert.equal(e.stage.classList.contains('cracked'), true);
    assert.equal(e.fortune.textContent, '');
    await app.tick();
    await opening;
    assert.equal(app.picks, 1);
    assert.equal(e.slip.attributes['aria-hidden'], 'false');
    assert.equal(e.reset.hidden, false);
    const first = e.fortune.textContent;
    e.reset.click();
    assert.equal(e.open.disabled, false);
    assert.equal(e.open.hidden, false);
    assert.equal(e.reset.hidden, true);
    assert.equal(e.fortune.textContent, '');
    assert.equal(e.stage.classList.contains('revealed'), false);
    assert.equal(e.slip.attributes['aria-hidden'], 'true');
    const second = e.cookie.click();
    await app.tick(); await app.tick(); await second;
    assert.notEqual(e.fortune.textContent, first);
    assert.equal(app.picks, 2);
  });
}
