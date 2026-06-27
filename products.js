// js/products.js
import { API } from './api.js';
import { Filter } from './filter.js';
import { Search } from './search.js';
import { formatCurrency, generateSkeleton } from './utils.js';

class ProductsPage {
  constructor() {
    this.grid = document.getElementById('products-grid');
    this.categorySelect = document.getElementById('category-filter');
    this.sortSelect = document.getElementById('sort-filter');
    this.searchInput = document.getElementById('search-input');
    
    this.products = [];
    this.filter = null;
    this.search = null;

    this.init();
  }

  async init() {
    this.showLoading();
    try {
      this.products = await API.getAllProducts();
      this.populateCategories();
      
      // Initialize Filter and Search
      this.filter = new Filter(this.products, (filtered) => this.renderProducts(filtered));
      this.search = new Search(this.products, (searched) => {
        // When searching, we reset filters to apply search on all products, or we can intersect.
        // For simplicity, let's update filter's allProducts and apply
        this.filter.allProducts = searched;
        this.filter.applyFilters();
      });

      this.search.init(this.searchInput);
      
      // Event Listeners for Filters
      this.categorySelect?.addEventListener('change', (e) => this.filter.setCategory(e.target.value));
      this.sortSelect?.addEventListener('change', (e) => this.filter.setSort(e.target.value));

      // Read URL params (e.g. products.html?category=electronics)
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        this.categorySelect.value = categoryParam;
        this.filter.setCategory(categoryParam);
      } else {
        this.renderProducts(this.products);
      }
      
    } catch (error) {
      this.grid.innerHTML = '<div class="error-msg">Failed to load products. Please try again later.</div>';
    }
  }

  showLoading() {
    this.grid.innerHTML = Array(8).fill(0).map(() => generateSkeleton()).join('');
  }

  populateCategories() {
    const categories = [...new Set(this.products.map(p => p.category))];
    if (this.categorySelect) {
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        this.categorySelect.appendChild(option);
      });
    }
  }

  renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
      this.grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><h3>No products found</h3></div>';
      return;
    }

    this.grid.innerHTML = productsToRender.map(product => `
      <div class="card animate-fade-in">
        <a href="product.html?id=${product.id}" class="product-image-wrap">
          <img src="${product.image}" alt="${product.title}" loading="lazy" class="product-image">
        </a>
        <div class="product-info">
          <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">${product.category}</span>
          <h3 class="product-title" title="${product.title}">${product.title}</h3>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="color: var(--warning-color);">★</span>
            <span>${product.rating.rate} (${product.rating.count})</span>
          </div>
          <div class="flex-between">
            <span class="product-price">${formatCurrency(product.price)}</span>
            <a href="product.html?id=${product.id}" class="btn btn-primary" style="padding: 0.5rem 1rem;">View</a>
          </div>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProductsPage();
});
