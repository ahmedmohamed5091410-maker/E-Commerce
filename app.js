// js/app.js
import { Cart } from './cart.js';
import { Wishlist } from './wishlist.js';
import { Auth } from './auth.js';
import { Storage, STORAGE_KEYS } from './storage.js';

class App {
  constructor() {
    this.initTheme();
    this.initMobileMenu();
    this.initCartWishlistBadges();
    this.initAuthUI();
    this.initScrollEffects();
  }

  initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = Storage.get(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icon
    themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      Storage.set(STORAGE_KEYS.THEME, newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }

  initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }
  }

  initCartWishlistBadges() {
    const updateCartBadge = (items) => {
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      const badge = document.getElementById('cart-badge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    };

    const updateWishlistBadge = (items) => {
      const count = items.length;
      const badge = document.getElementById('wishlist-badge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    };

    Cart.subscribe(updateCartBadge);
    Wishlist.subscribe(updateWishlistBadge);
  }

  initAuthUI() {
    const user = Auth.getUser();
    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
      if (user) {
        userIcon.innerHTML = '👤'; // Could be replaced with user initials
        userIcon.href = 'profile.html';
      } else {
        userIcon.href = 'login.html';
      }
    }
  }

  initScrollEffects() {
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
      // Header shadow
      if (window.scrollY > 10) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      // Back to top button
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      }
    });

    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 150;

      reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
