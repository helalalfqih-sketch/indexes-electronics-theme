import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync('assets/cart.js', 'utf8');
const { changeCart } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const response = (items, ok = true) => ({ ok, json: async () => ({ items }) });
test('quantity 1 → 2 sends a locale-aware POST with the line key and confirms Shopify quantity', async () => {
  const calls = [];
  await changeCart('/ar/cart/change.js', [{ key: 'variant:properties', quantity: 2 }], async (url, options) => {
    calls.push({ url, ...options }); return response([{ key: 'variant:properties', quantity: 2 }]);
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/ar/cart/change.js');
  assert.equal(calls[0].method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].body), { id: 'variant:properties', quantity: 2 });
});
test('decrease and zero removal are confirmed using server data', async () => {
  await changeCart('/cart/change.js', [{ key: 'a', quantity: 1 }], async () => response([{ key: 'a', quantity: 1 }]));
  await changeCart('/cart/change.js', [{ key: 'a', quantity: 0 }], async () => response([]));
});
test('inventory rejection and silently clamped quantities never resolve as success', async () => {
  await assert.rejects(changeCart('/cart/change.js', [{ key: 'a', quantity: 2 }], async () => response([], false)));
  await assert.rejects(changeCart('/cart/change.js', [{ key: 'a', quantity: 2 }], async () => response([{ key: 'a', quantity: 1 }])));
});
test('network and invalid JSON errors do not trigger automatic mutation retries', async () => {
  let calls = 0;
  await assert.rejects(changeCart('/cart/change.js', [{ key: 'a', quantity: 2 }], async () => { calls++; throw new Error('network'); }));
  assert.equal(calls, 1);
  await assert.rejects(changeCart('/cart/change.js', [{ key: 'a', quantity: 2 }], async () => ({ ok: true, json: async () => { throw new Error('HTML response'); } })));
});
test('invalid quantities are rejected before sending any mutation', async () => {
  for (const quantity of [-1, 1.5, NaN]) await assert.rejects(changeCart('/cart/change.js', [{ key: 'a', quantity }], async () => assert.fail('must not send')));
});
test('multiple lines remain separate and stop on the first unconfirmed change', async () => {
  const calls = [];
  await assert.rejects(changeCart('/cart/change.js', [{key:'a',quantity:2},{key:'b',quantity:0}], async (_, options) => {
    calls.push(JSON.parse(options.body)); return response([], false);
  }));
  assert.deepEqual(calls, [{ id: 'a', quantity: 2 }]);
});
