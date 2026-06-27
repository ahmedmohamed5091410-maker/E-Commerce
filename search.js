// js/search.js
import { debounce } from './utils.js';

export class Search {
  constructor(products, onSearchChange) {
    this.allProducts = products;
    this.onSearchChange = onSearchChange;
  }

  handleSearch = debounce((query) => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      this.onSearchChange(this.allProducts);
      return;
    }

    const results = this.allProducts.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );

    this.onSearchChange(results);
  }, 300);

  init(inputElement) {
    if (inputElement) {
      inputElement.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }
}
