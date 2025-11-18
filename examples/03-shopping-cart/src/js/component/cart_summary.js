import dataInterface from '../data.js';

W.component('cart_summary', {
  init: function() {
    // Subscribe to cart changes
    this.app.data.on('cart', (data) => {
      console.log('cart_summary: cart updated', data);
      this.load();
    }, this);

    // Fetch cart data
    this.app.data.fetch('cart');
  },

  getData: function(cb) {
    const cart = this.app.data.get('cart');

    // Check if data is loading (null means not yet fetched)
    const isLoading = cart === null;

    if (isLoading) {
      cb({ isLoading: true });
      return;
    }

    // Calculate totals
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cb({
      isLoading: false,
      itemCount: itemCount,
      totalPrice: totalPrice.toFixed(2),
      isEmpty: cart.length === 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Clear cart button
    $container.find('#clearCart').on('click', () => {
      if (confirm('Clear entire cart?')) {
        // Call async clearCart method
        dataInterface.clearCart((result) => {
          // Refresh cart data to publish updates to all subscribers
          this.app.data.fetch('cart');
        });
      }
    });

    cb();
  }
});
