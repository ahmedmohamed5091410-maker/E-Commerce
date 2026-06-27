// js/wishlist-ui.js
import { Wishlist } from './wishlist.js';
import { Cart } from './cart.js';
import { formatCurrency } from './utils.js';

class WishlistUI {
  constructor() {
    this.container = document.getElementById('wishlist-container');
    this.emptyMsg = document.getElementById('empty-wishlist-msg');
    this.init();
  }

  init() {
    this.render();
    Wishlist.subscribe(() => this.render());
  }

  render() {
    const items = Wishlist.items;

    if (items.length === 0) {
      this.container.innerHTML = '';
      this.emptyMsg.style.display = 'block';
      return;
    }

    this.emptyMsg.style.display = 'none';

    this.container.innerHTML = items.map(item => `
      <div class="card animate-fade-in" style="position: relative;">
        <button class="remove-wishlist-btn icon-btn" data-id="${item.id}" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: var(--surface-color); box-shadow: var(--shadow-sm); color: var(--error-color);">✕</button>
        <a href="product.html?id=${item.id}" class="product-image-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" class="product-image">
        </a>
        <div class="product-info">
          <h3 class="product-title" title="${item.title}">${item.title}</h3>
          <div class="flex-between">
            <span class="product-price">${formatCurrency(item.price)}</span>
            <button class="btn btn-primary add-to-cart-btn" data-id="${item.id}" style="padding: 0.5rem 1rem;">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');

    this.setupListeners();
  }

  setupListeners() {
    document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        Wishlist.remove(parseInt(e.currentTarget.dataset.id));
      });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = Wishlist.items.find(i => i.id === id);
        if (item) {
          Cart.add(item, 1);
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WishlistUI();
});
