// Import components
import './component/product_list.js';
import './component/cart_summary.js';
import './component/cart_details.js';
import './component/stats.js';

// Import data interface
import dataInterface from './data.js';

// Template loader
function getTemplate(name, cb) {
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create app
const app = W.app('shopping-cart', getTemplate);

// Register shared data sources using data.js
// 1. Products data - shared across multiple components
app.data.register('products', (cb) => {
  dataInterface.getProducts(cb);
});

// 2. Shopping cart data - shared across multiple components
app.data.register('cart', (cb) => {
  // Get current cart from data interface
  cb(dataInterface.getCart());
});

// Fetch initial data before starting app
app.data.fetch(['products', 'cart'], (results) => {
  console.log('Initial data loaded:', results);
  app.start(document.body);
});
