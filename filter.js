// js/filter.js

export class Filter {
  constructor(products, onFilterChange) {
    this.allProducts = products;
    this.filteredProducts = [...products];
    this.onFilterChange = onFilterChange;
    this.activeCategory = 'all';
    this.activeSort = 'default';
  }

  setCategory(category) {
    this.activeCategory = category;
    this.applyFilters();
  }

  setSort(sortType) {
    this.activeSort = sortType;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allProducts];

    // Apply Category
    if (this.activeCategory !== 'all') {
      result = result.filter(p => p.category === this.activeCategory);
    }

    // Apply Sort
    switch (this.activeSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // default order (by ID)
        result.sort((a, b) => a.id - b.id);
        break;
    }

    this.filteredProducts = result;
    this.onFilterChange(this.filteredProducts);
  }
}
