// Shopify owns cart quantities and money. Never compute optimistic totals here.
export async function changeCart(url, changes, request = fetch) {
  for (const { key, quantity } of changes) {
    if (!key || !Number.isSafeInteger(quantity) || quantity < 0) throw new Error('Invalid quantity');
  }
  for (const { key, quantity } of changes) {
    const response = await request(url, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    const cart = await response.json();
    if (!response.ok || !Array.isArray(cart.items)) throw new Error('Cart change rejected');
    const item = cart.items.find(item => item.key === key);
    if ((quantity === 0 && item) || (quantity > 0 && item?.quantity !== quantity)) {
      throw new Error('Quantity not confirmed');
    }
  }
}

async function refreshCart(controller) {
  const header = document.querySelector('header')?.closest('.shopify-section');
  const ids = [controller.dataset.sectionId, header?.id.replace('shopify-section-', '')].filter(Boolean);
  const url = new URL(controller.dataset.cartUrl, window.location.origin);
  url.searchParams.set('sections', ids.join(','));
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('Cart refresh failed');
  const sections = await response.json();
  // Validate every replacement before changing any UI; null sections are not success.
  const replacements = ids.map(id => {
    if (typeof sections[id] !== 'string') throw new Error('Missing section');
    const parsed = new DOMParser().parseFromString(sections[id], 'text/html');
    const replacement = parsed.getElementById(`shopify-section-${id}`);
    const current = document.getElementById(`shopify-section-${id}`);
    if (!replacement || !current) throw new Error('Invalid section');
    return { current, replacement };
  });
  for (const { current, replacement } of replacements) current.replaceWith(replacement);
  return document.querySelector('[data-cart-controller]');
}

async function update(controller, changes) {
  if (controller.dataset.busy === 'true') return;
  controller.dataset.busy = 'true';
  controller.setAttribute('aria-busy', 'true');
  controller.querySelector('[data-cart-status]').textContent = controller.dataset.loading;
  controller.querySelectorAll('button,input').forEach(input => { input.disabled = true; });
  let failed = false;
  try { await changeCart(controller.dataset.changeUrl, changes); }
  catch { failed = true; }
  try {
    controller = await refreshCart(controller);
    const status = controller.querySelector('[data-cart-status]');
    status.textContent = failed ? controller.dataset.error : controller.dataset.updated;
    if (failed) status.setAttribute('role', 'alert');
    status.focus();
  } catch {
    // The request may have reached Shopify. Do not retry automatically or allow
    // checkout against stale totals. A full reload is the recovery path.
    controller.removeAttribute('aria-busy');
    const status = controller.querySelector('[data-cart-status]');
    status.textContent = controller.dataset.error;
    status.setAttribute('role', 'alert');
    controller.querySelector('[data-cart-reload]').hidden = false;
    status.focus();
  }
}

if (typeof document !== 'undefined') {
  // Delegation survives theme editor section replacement and cart empty states.
  document.addEventListener('submit', event => {
    const form = event.target;
    const controller = form.closest('[data-cart-controller]');
    if (!controller || event.submitter?.name === 'checkout') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const changes = Array.from(form.querySelectorAll('[data-line-key]'))
      .filter(input => input.value !== input.dataset.originalQuantity)
      .map(input => ({ key: input.dataset.lineKey, quantity: Number(input.value) }));
    update(controller, changes);
  }, true);
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-cart-remove]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const controller = link.closest('[data-cart-controller]');
    const input = link.closest('.cart-line').querySelector('[data-line-key]');
    update(controller, [{ key: input.dataset.lineKey, quantity: 0 }]);
  }, true);
}
