// js/checkout.js
import { Cart } from './cart.js';
import { Auth } from './auth.js';
import { formatCurrency, showToast } from './utils.js';

class Checkout {
  constructor() {
    this.form = document.getElementById('checkout-form');
    this.summaryContainer = document.getElementById('checkout-summary');
    this.init();
  }

  init() {
    Auth.requireAuth();

    if (Cart.items.length === 0) {
      showToast('Your cart is empty', 'warning');
      window.location.href = 'products.html';
      return;
    }

    this.renderSummary();
    this.setupForm();
  }

  renderSummary() {
    if (!this.summaryContainer) return;
    
    const itemsHTML = Cart.items.map(item => `
      <div class="flex-between" style="margin-bottom: 0.5rem;">
        <span style="font-size: 0.9rem; color: var(--text-secondary);">${item.quantity}x ${item.title.substring(0,20)}...</span>
        <span style="font-weight: 500;">${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `).join('');

    const subtotal = Cart.getTotal();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    this.summaryContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        ${itemsHTML}
      </div>
      <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <div class="flex-between" style="margin-bottom: 0.5rem;">
          <span style="color: var(--text-secondary);">Subtotal</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="flex-between" style="margin-bottom: 0.5rem;">
          <span style="color: var(--text-secondary);">Tax (10%)</span>
          <span>${formatCurrency(tax)}</span>
        </div>
        <div class="flex-between" style="margin-top: 1rem; font-weight: 700; font-size: 1.25rem; color: var(--text-primary);">
          <span>Total</span>
          <span>${formatCurrency(total)}</span>
        </div>
      </div>
    `;
  }

  setupForm() {
    if (!this.form) return;

    // Pre-fill email from Auth
    const user = Auth.getUser();
    if (user && user.email) {
      document.getElementById('email').value = user.email;
    }

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = this.form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      btn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Processing...';
      btn.disabled = true;

      // Simulate payment processing
      setTimeout(() => {
        Cart.clear();
        showToast('Payment successful! Order placed.', 'success');
        
        // Save order to profile (mock)
        const userOrders = JSON.parse(localStorage.getItem('ecommerce_orders') || '[]');
        userOrders.push({
          id: 'ORD-' + Math.floor(Math.random() * 1000000),
          date: new Date().toISOString(),
          total: Cart.getTotal() * 1.1,
          status: 'Processing'
        });
        localStorage.setItem('ecommerce_orders', JSON.stringify(userOrders));

        window.location.href = 'profile.html?success=true';
      }, 2000);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Checkout();
});
