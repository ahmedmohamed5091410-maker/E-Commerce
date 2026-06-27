// js/cart-ui.js
import { Cart } from './cart.js';
import { formatCurrency } from './utils.js';

class CartUI {
  constructor() {
    this.container = document.getElementById('cart-items-container');
    this.totalEl = document.getElementById('cart-subtotal');
    this.finalTotalEl = document.getElementById('cart-total');
    this.taxEl = document.getElementById('cart-tax');
    this.emptyMsg = document.getElementById('empty-cart-msg');
    this.checkoutBtn = document.getElementById('checkout-btn');

    this.init();
  }

  init() {
    this.render();
    Cart.subscribe(() => this.render());
  }

  render() {
    const items = Cart.items;

    if (items.length === 0) {
      this.container.innerHTML = '';
      this.emptyMsg.style.display = 'block';
      this.checkoutBtn.disabled = true;
      this.updateTotals(0);
      return;
    }

    this.emptyMsg.style.display = 'none';
    this.checkoutBtn.disabled = false;

    this.container.innerHTML = items.map(item => `
      <div class="cart-item animate-fade-in" style="display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 1rem; background: var(--surface-color);">
        <img src="${item.image}" alt="${item.title}" style="width: 100px; height: 100px; object-fit: contain;">
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div class="flex-between">
            <h4 style="margin:0; font-size: 1rem; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
            <button class="remove-btn icon-btn" data-id="${item.id}" style="color: var(--error-color);">🗑</button>
          </div>
          <div class="flex-between" style="align-items: center; margin-top: auto;">
            <span style="font-weight: 600; color: var(--primary-color);">${formatCurrency(item.price)}</span>
            <div class="qty-selector" style="display: flex; border: 1px solid var(--border-color); border-radius: var(--radius-full);">
              <button class="qty-btn-minus" data-id="${item.id}" style="padding: 0.25rem 0.75rem; background: transparent; border: none; cursor: pointer;">-</button>
              <input type="text" value="${item.quantity}" readonly style="width: 30px; text-align: center; border: none; background: transparent;">
              <button class="qty-btn-plus" data-id="${item.id}" style="padding: 0.25rem 0.75rem; background: transparent; border: none; cursor: pointer;">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    this.setupListeners();
    this.updateTotals(Cart.getTotal());
  }

  updateTotals(subtotal) {
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    if (this.totalEl) this.totalEl.textContent = formatCurrency(subtotal);
    if (this.taxEl) this.taxEl.textContent = formatCurrency(tax);
    if (this.finalTotalEl) this.finalTotalEl.textContent = formatCurrency(total);
  }

  setupListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        Cart.remove(parseInt(e.currentTarget.dataset.id));
      });
    });

    document.querySelectorAll('.qty-btn-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = Cart.items.find(i => i.id === id);
        if (item) Cart.updateQuantity(id, item.quantity - 1);
      });
    });

    document.querySelectorAll('.qty-btn-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = Cart.items.find(i => i.id === id);
        if (item) Cart.updateQuantity(id, item.quantity + 1);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CartUI();
});
