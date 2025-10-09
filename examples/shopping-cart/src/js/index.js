// Import components
import './component/product_list.js';
import './component/cart_summary.js';
import './component/cart_details.js';
import './component/stats.js';

// Template loader
function getTemplate(name, cb) {
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create app
const app = W.app('shopping-cart', getTemplate);

// Register shared data sources
// 1. Products data - shared across multiple components
app.data.register('products', (cb) => {
  // Simulate API call - in real app, this would be $.ajax()
  setTimeout(() => {
    const products = [
      { id: 1, name: 'Laptop', price: 999, stock: 5 },
      { id: 2, name: 'Mouse', price: 29, stock: 20 },
      { id: 3, name: 'Keyboard', price: 79, stock: 15 },
      { id: 4, name: 'Monitor', price: 299, stock: 8 },
      { id: 5, name: 'Headphones', price: 149, stock: 12 }
    ];
    cb(products);
  }, 100);
});

// 2. Shopping cart data - shared across multiple components
app.data.register('cart', (cb) => {
  // Initialize empty cart
  // In real app, might load from localStorage or API
  cb([]);
});

// Fetch initial data before starting app
app.data.fetch(['products', 'cart'], (results) => {
  console.log('Initial data loaded:', results);
  app.start(document.body);
});
