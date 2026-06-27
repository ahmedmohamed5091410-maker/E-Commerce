// js/api.js

const BASE_URL = 'https://fakestoreapi.com';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export const API = {
  // Products
  getAllProducts: () => fetchAPI('/products'),
  getProductById: (id) => fetchAPI(`/products/${id}`),
  getCategories: () => fetchAPI('/products/categories'),
  getProductsByCategory: (category) => fetchAPI(`/products/category/${category}`),
  getLimitedProducts: (limit) => fetchAPI(`/products?limit=${limit}`),
  
  // Custom search since API doesn't support it directly
  searchProducts: async (query) => {
    const products = await API.getAllProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }
};
