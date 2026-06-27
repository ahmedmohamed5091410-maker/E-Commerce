// js/auth.js
import { Storage, STORAGE_KEYS } from './storage.js';
import { showToast } from './utils.js';

export const Auth = {
  getUser: () => Storage.get(STORAGE_KEYS.USER),
  
  isAuthenticated: () => !!Storage.get(STORAGE_KEYS.USER),
  
  login: async (email, password) => {
    // Fake auth validation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = {
            id: Date.now(),
            email,
            name: email.split('@')[0],
            token: 'fake-jwt-token-' + Date.now()
          };
          Storage.set(STORAGE_KEYS.USER, user);
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  },

  register: async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password.length >= 6) {
          const user = {
            id: Date.now(),
            name,
            email,
            token: 'fake-jwt-token-' + Date.now()
          };
          Storage.set(STORAGE_KEYS.USER, user);
          resolve(user);
        } else {
          reject(new Error('Validation failed. Password must be at least 6 characters.'));
        }
      }, 1000);
    });
  },

  logout: () => {
    Storage.remove(STORAGE_KEYS.USER);
    // Optional: clear cart and wishlist on logout, but let's keep it for guest users
    showToast('Logged out successfully', 'success');
    window.location.href = 'index.html';
  },

  requireAuth: () => {
    if (!Auth.isAuthenticated()) {
      showToast('Please login to access this page', 'warning');
      window.location.href = 'login.html';
    }
  }
};
