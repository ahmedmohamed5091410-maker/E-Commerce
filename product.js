// js/product.js
import { API } from './api.js';
import { Cart } from './cart.js';
import { Wishlist } from './wishlist.js';
import { formatCurrency, showToast } from './utils.js';

class ProductPage {
  constructor() {
    this.productId = new URLSearchParams(window.location.search).get('id');
    this.product = null;
    this.quantity = 1;
    this.init();
  }

  async init() {
    if (!this.productId) {
      window.location.href = 'products.html';
      return;
    }

    try {
      this.product = await API.getProductById(this.productId);
      this.render();
      this.setupEventListeners();
      this.loadRelatedProducts();
    } catch (error) {
      document.querySelector('.product-container').innerHTML = '<div class="error-msg">Failed to load product details.</div>';
    }
  }

  render() {
    document.title = `${this.product.title} | Luxe`;
    
    // Image
    const imgEl = document.getElementById('main-product-image');
    if (imgEl) imgEl.src = this.product.image;

    // Info
    document.getElementById('product-title').textContent = this.product.title;
    document.getElementById('product-category').textContent = this.product.category;
    document.getElementById('product-price').textContent = formatCurrency(this.product.price);
    document.getElementById('product-description').textContent = this.product.description;
    
    // Rating
    const ratingEl = document.getElementById('product-rating');
    if (ratingEl) {
      ratingEl.innerHTML = `
        <span style="color: var(--warning-color);">★</span>
        <span>${this.product.rating.rate} (${this.product.rating.count} reviews)</span>
      `;
    }

    // Wishlist button state
    this.updateWishlistBtn();
  }

  updateWishlistBtn() {
    const btn = document.getElementById('wishlist-btn');
    if (btn) {
      if (Wishlist.has(this.product.id)) {
        btn.innerHTML = '❤️ Remove from Wishlist';
        btn.classList.add('active');
      } else {
        btn.innerHTML = '🤍 Add to Wishlist';
        btn.classList.remove('active');
      }
    }
  }

  setupEventListeners() {
    // Quantity controls
    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        document.getElementById('qty-input').value = this.quantity;
      }
    });

    document.getElementById('qty-plus')?.addEventListener('click', () => {
      this.quantity++;
      document.getElementById('qty-input').value = this.quantity;
    });

    document.getElementById('qty-input')?.addEventListener('change', (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      this.quantity = val;
      e.target.value = val;
    });

    // Actions
    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      Cart.add(this.product, this.quantity);
    });

    document.getElementById('wishlist-btn')?.addEventListener('click', () => {
      Wishlist.toggle(this.product);
      this.updateWishlistBtn();
    });

    // Image Zoom (Simple CSS-based zoom)
    const imgWrap = document.querySelector('.product-image-large-wrap');
    const img = document.getElementById('main-product-image');
    
    imgWrap?.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = imgWrap.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
      img.style.transform = 'scale(2)';
    });

    imgWrap?.addEventListener('mouseleave', () => {
      img.style.transformOrigin = 'center';
      img.style.transform = 'scale(1)';
    });
  }

  async loadRelatedProducts() {
    const grid = document.getElementById('related-products');
    if (!grid) return;

    try {
      const products = await API.getProductsByCategory(this.product.category);
      // Filter out current product and take up to 4
      const related = products.filter(p => p.id !== this.product.id).slice(0, 4);
      
      if (related.length === 0) {
        document.getElementById('related-section').style.display = 'none';
        return;
      }

      grid.innerHTML = related.map(product => `
        <div class="card animate-fade-in">
          <a href="product.html?id=${product.id}" class="product-image-wrap">
            <img src="${product.image}" alt="${product.title}" loading="lazy" class="product-image">
          </a>
          <div class="product-info">
            <h3 class="product-title" title="${product.title}">${product.title}</h3>
            <span class="product-price">${formatCurrency(product.price)}</span>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error('Failed to load related products');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProductPage();
});
