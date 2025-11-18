// Static products list
const PRODUCTS = [
  { id: 1, name: 'Laptop', price: 999, stock: 5 },
  { id: 2, name: 'Mouse', price: 29, stock: 20 },
  { id: 3, name: 'Keyboard', price: 79, stock: 15 },
  { id: 4, name: 'Monitor', price: 299, stock: 8 },
  { id: 5, name: 'Headphones', price: 149, stock: 12 }
];

// Shopping cart state
let cart = [];

// Data interface for the app
export default {
  /**
   * Get products list (async with setTimeout)
   * @param {Function} callback - Called with products array
   */
  getProducts: function(callback) {
    setTimeout(() => {
      callback(PRODUCTS);
    }, 100);
  },

  /**
   * Add item to cart (async with setTimeout)
   * @param {Object} cartItem - Item to add { productId, name, price, quantity }
   * @param {Function} callback - Called with updated cart
   */
  addToCart: function(cartItem, callback) {
    setTimeout(() => {
      // Find product to validate stock
      const product = PRODUCTS.find(p => p.id === cartItem.productId);
      if (!product) {
        callback({ error: 'Product not found', cart });
        return;
      }

      // Check if already in cart
      const existingItem = cart.find(item => item.productId === cartItem.productId);

      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity >= product.stock) {
          callback({ error: 'Stock limit reached', cart });
          return;
        }
        // Increase quantity
        cart = cart.map(item =>
          item.productId === cartItem.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        cart = [...cart, cartItem];
      }

      callback({ cart });
    }, 100);
  },

  /**
   * Remove item from cart (async with setTimeout)
   * @param {Number} productId - Product ID to remove
   * @param {Function} callback - Called with updated cart
   */
  removeFromCart: function(productId, callback) {
    setTimeout(() => {
      cart = cart.filter(item => item.productId !== productId);
      callback({ cart });
    }, 100);
  },

  /**
   * Update cart item quantity (async with setTimeout)
   * @param {Number} productId - Product ID
   * @param {Number} quantity - New quantity (0 removes item)
   * @param {Function} callback - Called with updated cart
   */
  updateQuantity: function(productId, quantity, callback) {
    setTimeout(() => {
      if (quantity <= 0) {
        // Remove item
        cart = cart.filter(item => item.productId !== productId);
      } else {
        // Find product to validate stock
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) {
          callback({ error: 'Product not found', cart });
          return;
        }

        // Check stock limit
        if (quantity > product.stock) {
          callback({ error: 'Stock limit reached', cart });
          return;
        }

        // Update quantity
        cart = cart.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
      }

      callback({ cart });
    }, 100);
  },

  /**
   * Clear entire cart (async with setTimeout)
   * @param {Function} callback - Called with empty cart
   */
  clearCart: function(callback) {
    setTimeout(() => {
      cart = [];
      callback({ cart });
    }, 100);
  },

  /**
   * Get current cart (synchronous)
   * @returns {Array} Current cart items
   */
  getCart: function() {
    return cart;
  }
};
