import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { JSDOM } from 'jsdom';

const source = (await readFile(new URL('../assets/cart.js', import.meta.url), 'utf8')).replace('export async function', 'async function');
function markup(quantity) {
  return `<div class="shopify-section" id="shopify-section-header"><header>Cart (${quantity})</header></div><div class="shopify-section" id="shopify-section-cart"><div data-cart-controller data-section-id="cart" data-cart-url="/ar/cart" data-change-url="/ar/cart/change.js" data-loading="Loading" data-updated="Updated" data-error="Reload to confirm"><p data-cart-status tabindex="-1"></p><a data-cart-reload hidden href="/ar/cart">Reload</a><form><input data-line-key="line:1" data-original-quantity="${quantity}" value="${quantity}"><button name="update">Update</button><button name="checkout">Checkout</button></form><output>Total ${quantity * 25}</output></div></div>`;
}
async function fixture(t) {
  let quantity = 1, mode = 'offline', posts = 0;
  const server = createServer(async (req, res) => {
    if (req.method === 'POST') {
      posts++;
      let body = ''; for await (const part of req) body += part;
      if (mode === 'offline') return req.socket.destroy();
      quantity = JSON.parse(body).quantity;
      if (mode === 'lost-response') return req.socket.destroy();
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ items: [{ key: 'line:1', quantity }] }));
    }
    if (mode === 'offline') return req.socket.destroy();
    const parsed = new JSDOM(markup(quantity));
    const sections = Object.fromEntries(['cart', 'header'].map(id => [id, parsed.window.document.getElementById(`shopify-section-${id}`).outerHTML]));
    parsed.window.close();
    if (mode === 'missing-section') sections.header = null;
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(sections));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const windows = [];
  function page() {
    const dom = new JSDOM(markup(quantity), { url: `${origin}/ar/cart`, runScripts: 'outside-only' });
    dom.window.fetch = (url, options) => fetch(new URL(url, origin), options);
    dom.window.eval(source); windows.push(dom.window); return dom.window;
  }
  t.after(async () => { windows.forEach(w => w.close()); server.closeAllConnections(); await new Promise(r => server.close(r)); });
  return { page, setMode: value => { mode = value; }, posts: () => posts };
}
async function submit(window, quantity) {
  const input = window.document.querySelector('input'); input.value = String(quantity);
  window.document.querySelector('form').dispatchEvent(new window.SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: window.document.querySelector('[name="update"]') }));
  const deadline = Date.now() + 5000;
  while (window.document.querySelector('[data-cart-status]').textContent === 'Loading') {
    if (Date.now() > deadline) throw new Error('Cart did not settle');
    await new Promise(r => setTimeout(r, 10));
  }
}
test('real socket loss locks stale checkout; reload and retry recover without duplicate mutation', async t => {
  const f = await fixture(t); const offline = f.page(); await submit(offline, 2);
  const d = offline.document;
  assert.equal(d.querySelector('[data-cart-status]').getAttribute('role'), 'alert');
  assert.equal(d.querySelector('[name="checkout"]').disabled, true);
  assert.equal(d.querySelector('[data-cart-reload]').hidden, false);
  assert.equal(d.querySelector('output').textContent, 'Total 25');
  assert.equal(f.posts(), 1);
  f.setMode('online'); const recovered = f.page(); await submit(recovered, 2);
  assert.equal(recovered.document.querySelector('output').textContent, 'Total 50');
  assert.equal(recovered.document.querySelector('header').textContent, 'Cart (2)');
  assert.equal(recovered.document.querySelector('[name="checkout"]').disabled, false);
  assert.equal(recovered.document.activeElement.textContent, 'Updated');
  assert.equal(f.posts(), 2);
});
test('lost response after accepted mutation reconciles totals with error, without retry', async t => {
  const f = await fixture(t); f.setMode('lost-response'); const w = f.page(); await submit(w, 2);
  assert.equal(w.document.querySelector('output').textContent, 'Total 50');
  assert.equal(w.document.querySelector('header').textContent, 'Cart (2)');
  assert.equal(w.document.querySelector('[data-cart-status]').getAttribute('role'), 'alert');
  assert.equal(f.posts(), 1);
});
test('missing header section prevents partial rendering and requires reload', async t => {
  const f = await fixture(t); f.setMode('missing-section'); const w = f.page(); await submit(w, 2);
  assert.equal(w.document.querySelector('output').textContent, 'Total 25');
  assert.equal(w.document.querySelector('header').textContent, 'Cart (1)');
  assert.equal(w.document.querySelector('[name="checkout"]').disabled, true);
  assert.equal(w.document.querySelector('[data-cart-reload]').hidden, false);
});
