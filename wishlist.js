// js/wishlist.js
import { Storage, STORAGE_KEYS } from './storage.js';
import { showToast } from './utils.js';

class WishlistService {
  constructor() {
    this.items = Storage.get(STORAGE_KEYS.WISHLIST) || [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.items);
  }

  notify() {
    Storage.set(STORAGE_KEYS.WISHLIST, this.items);
    this.listeners.forEach(listener => listener(this.items));
  }

  toggle(product) {
    const exists = this.items.some(item => item.id === product.id);
    if (exists) {
      this.items = this.items.filter(item => item.id !== product.id);
      showToast('Removed from wishlist', 'warning');
    } else {
      this.items.push(product);
      showToast('Added to wishlist', 'success');
    }
    this.notify();
    return !exists;
  }
  
  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    showToast('Removed from wishlist', 'warning');
    this.notify();
  }

  has(productId) {
    return this.items.some(item => item.id === productId);
  }

  getCount() {
    return this.items.length;
  }
}

export const Wishlist = new WishlistService();
