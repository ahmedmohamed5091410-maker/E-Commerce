# Luxe E-Commerce Platform

A completely custom, high-end e-commerce frontend built from scratch using only **HTML5, CSS3, and Vanilla JavaScript**. This project avoids all libraries (no React, no jQuery, no Tailwind) to demonstrate advanced architectural patterns and clean code principles.

## Features

- **Modern UI/UX**: Premium aesthetic featuring glassmorphism, soft shadows, micro-animations, and modern typography.
- **Dark Mode**: Fully implemented CSS Variables-based dark mode that persists via LocalStorage.
- **State Management**: Custom observable patterns for Shopping Cart and Wishlist to keep UI in sync without frameworks.
- **API Integration**: Fetches real product data from [Fake Store API](https://fakestoreapi.com/).
- **Search & Filter**: Debounced search and multi-criteria filtering (category, sort by price/name/rating).
- **Authentication**: Simulated JWT-style auth with route protection and session management.
- **Responsive Design**: Mobile-first grid/flexbox architecture adapting beautifully across all breakpoints.

## Architecture

- `js/api.js`: Fetch API wrappers and endpoint management.
- `js/storage.js`: LocalStorage wrapper for persistence.
- `js/utils.js`: Helper functions (debounce, formatting, toasts).
- `js/cart.js` & `js/wishlist.js`: Global state singletons.
- `js/app.js`: Global initialization (theme, mobile menu, scroll effects).
- **Page Modules**: Dedicated scripts for specific views (`products.js`, `checkout.js`, etc.) to keep logic modular.

## Setup Instructions

Simply open the `index.html` file in your browser, or run via a local server:

1. Clone or download the repository.
2. Open the project folder in VS Code.
3. Install the "Live Server" extension.
4. Right-click on `index.html` and select "Open with Live Server".

## Author
Senior Front-End Engineer
