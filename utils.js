// js/utils.js

/**
 * Creates and displays a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', 'warning'
 */
export const showToast = (message, type = 'success') => {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'warning') icon = '⚠';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

/**
 * Formats a number to USD currency
 * @param {number} price 
 * @returns {string} Formatted price
 */
export const formatCurrency = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Debounce function for search inputs
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Scroll to top smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Generates a loading skeleton HTML
 * @returns {string} HTML string
 */
export const generateSkeleton = () => {
  return `
    <div class="card skeleton" style="height: 300px; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
      <div class="skeleton" style="height: 150px; width: 100%;"></div>
      <div class="skeleton" style="height: 20px; width: 80%;"></div>
      <div class="skeleton" style="height: 20px; width: 40%;"></div>
      <div class="skeleton" style="height: 40px; width: 100%; margin-top: auto;"></div>
    </div>
  `;
};
