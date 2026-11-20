'use strict';

const PRODUCTS = [
  { id: 'mouse', name: 'Wireless Mouse', price: 79900 }, // paise
  { id: 'cable', name: 'USB-C Cable', price: 24950 },
];
const MIN_QTY = 1;
const MAX_QTY = 99;

const state = { cart: {}, orderPlaced: false };

const $ = (id) => document.querySelector(`[data-testid="${id}"]`);
const money = (paise) => `₹${(paise / 100).toFixed(2)}`;
const productOf = (id) => PRODUCTS.find((p) => p.id === id);

function makeReference() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (let i = 0; i < 4; i++) tail += chars[Math.floor(Math.random() * chars.length)];
  return `ORD-${date}-${tail}`;
}

function cartTotal() {
  return Object.entries(state.cart).reduce((sum, [id, qty]) => sum + productOf(id).price * qty, 0);
}

function render() {
  const ids = Object.keys(state.cart);
  const locked = state.orderPlaced;

  $('cart-empty').hidden = ids.length > 0;
  $('cart-items').innerHTML = ids.map((id) => {
    const p = productOf(id);
    const qty = state.cart[id];
    return `<li data-testid="line-${id}">
      <span>${p.name} (${money(p.price)})</span>
      <button type="button" data-testid="dec-${id}" data-action="dec" data-id="${id}" aria-label="Decrease ${p.name}" ${locked || qty <= MIN_QTY ? 'disabled' : ''}>-</button>
      <span data-testid="qty-${id}">${qty}</span>
      <button type="button" data-testid="inc-${id}" data-action="inc" data-id="${id}" aria-label="Increase ${p.name}" ${locked || qty >= MAX_QTY ? 'disabled' : ''}>+</button>
      <span data-testid="line-total-${id}">${money(p.price * qty)}</span>
      <button type="button" data-testid="remove-${id}" data-action="remove" data-id="${id}" ${locked ? 'disabled' : ''}>Remove</button>
    </li>`;
  }).join('');

  $('order-total').textContent = money(cartTotal());
  document.querySelectorAll('[data-add]').forEach((b) => (b.disabled = locked));
  $('name-input').readOnly = locked;
  $('place-order').disabled = locked;
}

function clearErrors() {
  $('name-error').hidden = true;
  $('name-error').textContent = '';
  $('cart-error').hidden = true;
  $('cart-error').textContent = '';
}

function placeOrder() {
  if (state.orderPlaced) return; // guard against double click
  clearErrors();

  const name = $('name-input').value.trim();
  let valid = true;

  if (Object.keys(state.cart).length === 0) {
    $('cart-error').textContent = 'Your cart is empty. Add at least one item.';
    $('cart-error').hidden = false;
    valid = false;
  }
  if (name === '') {
    $('name-error').textContent = 'Please enter your name.';
    $('name-error').hidden = false;
    valid = false;
  }
  if (!valid) {
    if (name === '') $('name-input').focus();
    return; // typed value stays in the input
  }

  state.orderPlaced = true;
  $('confirm-name').textContent = name;
  $('order-reference').textContent = makeReference();
  $('confirmation').hidden = false;
  render();
}

function newOrder() {
  state.cart = {};
  state.orderPlaced = false;
  $('name-input').value = '';
  $('confirmation').hidden = true;
  clearErrors();
  render();
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t || state.orderPlaced && !t.matches('[data-testid="new-order"]')) return;

  if (t.dataset.add) {
    const id = t.dataset.add;
    state.cart[id] = Math.min((state.cart[id] || 0) + 1, MAX_QTY);
    $('cart-error').hidden = true;
    render();
  } else if (t.dataset.action) {
    const id = t.dataset.id;
    if (t.dataset.action === 'inc') state.cart[id] = Math.min(state.cart[id] + 1, MAX_QTY);
    if (t.dataset.action === 'dec') state.cart[id] = Math.max(state.cart[id] - 1, MIN_QTY);
    if (t.dataset.action === 'remove') delete state.cart[id];
    render();
  } else if (t.matches('[data-testid="place-order"]')) {
    placeOrder();
  } else if (t.matches('[data-testid="new-order"]')) {
    newOrder();
  }
});

render();