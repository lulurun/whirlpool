import dataInterface from '../data.js';

W.component('cart_details', {
  init: function() {
    // Subscribe to cart changes
    this.app.data.on('cart', (data) => {
      console.log('cart_details: cart updated', data);
      this.load();
    }, this);

    // Fetch cart data
    this.app.data.fetch(['cart']);
  },

  getData: function(cb) {
    const cart = this.app.data.get('cart');

    // Check if data is loading (null means not yet fetched)
    const isLoading = cart === null;

    cb({
      items: cart || [],
      isLoading: isLoading
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Remove item button
    $container.find('.remove-item').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));

      // Call async removeFromCart method
      dataInterface.removeFromCart(productId, (result) => {
        // Refresh cart data to publish updates to all subscribers
        this.app.data.refresh('cart');
      });
    });

    // Decrease quantity button
    $container.find('.decrease-qty').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));
      const cart = this.app.data.get('cart') || [];

      const item = cart.find(i => i.productId === productId);
      if (!item) return;

      const newQuantity = item.quantity - 1;

      // Call async updateQuantity method (0 will remove item)
      dataInterface.updateQuantity(productId, newQuantity, (result) => {
        // Refresh cart data to publish updates to all subscribers
        this.app.data.refresh('cart');
      });
    });

    // Increase quantity button
    $container.find('.increase-qty').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));
      const cart = this.app.data.get('cart') || [];

      const item = cart.find(i => i.productId === productId);
      if (!item) return;

      const newQuantity = item.quantity + 1;

      // Call async updateQuantity method
      dataInterface.updateQuantity(productId, newQuantity, (result) => {
        if (result.error) {
          alert(result.error === 'Stock limit reached'
            ? 'Cannot add more - stock limit reached'
            : result.error);
          return;
        }

        // Refresh cart data to publish updates to all subscribers
        this.app.data.refresh('cart');
      });
    });

    cb();
  }
});
