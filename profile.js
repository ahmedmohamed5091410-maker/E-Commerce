// js/profile.js
import { Auth } from './auth.js';
import { Wishlist } from './wishlist.js';
import { formatCurrency, showToast } from './utils.js';

class Profile {
  constructor() {
    this.user = null;
    this.init();
  }

  init() {
    Auth.requireAuth();
    this.user = Auth.getUser();

    // Show success toast if coming from checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      showToast('Order placed successfully!', 'success');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    this.renderUserInfo();
    this.renderOrders();
    this.setupListeners();
  }

  renderUserInfo() {
    document.getElementById('user-name').textContent = this.user.name || 'User';
    document.getElementById('user-email').textContent = this.user.email;
    document.getElementById('user-initial').textContent = (this.user.name || this.user.email).charAt(0).toUpperCase();
  }

  renderOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const orders = JSON.parse(localStorage.getItem('ecommerce_orders') || '[]');

    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p style="color: var(--text-secondary);">You have no previous orders.</p>';
      return;
    }

    // Reverse to show latest first
    ordersContainer.innerHTML = orders.reverse().map(order => `
      <div class="card" style="padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid var(--accent-color);">
        <div class="flex-between" style="margin-bottom: 1rem;">
          <h4 style="margin: 0;">Order #${order.id}</h4>
          <span style="background: var(--success-color); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem;">${order.status}</span>
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">Date: ${new Date(order.date).toLocaleDateString()}</div>
        <div style="font-weight: 600;">Total: ${formatCurrency(order.total)}</div>
      </div>
    `).join('');
  }

  setupListeners() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Auth.logout();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Profile();
});
