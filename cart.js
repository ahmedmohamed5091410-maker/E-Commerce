// js/cart.js
import { Storage, STORAGE_KEYS } from './storage.js';
import { showToast } from './utils.js';

class CartService {
  constructor() {
    this.items = Storage.get(STORAGE_KEYS.CART) || [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.items);
  }

  notify() {
    Storage.set(STORAGE_KEYS.CART, this.items);
    this.listeners.forEach(listener => listener(this.items));
  }

  add(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      showToast('Cart updated', 'success');
    } else {
      this.items.push({ ...product, quantity });
      showToast('Added to cart', 'success');
    }
    this.notify();
  }

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    showToast('Item removed from cart', 'warning');
    this.notify();
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.notify();
    }
  }

  clear() {
    this.items = [];
    this.notify();
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

export const Cart = new CartService();
