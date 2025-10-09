W.component('cart_summary', {
  init: function() {
    // Subscribe to cart changes
    this.app.data.on('cart', (data) => {
      console.log('cart_summary: cart updated', data);
      this.load();
    }, this);
  },

  getData: function(cb) {
    const cart = this.app.data.get('cart') || [];

    // Calculate totals
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cb({
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
        // Emit empty cart - all subscribers will update
        this.app.data.emit('cart', [], this);
      }
    });

    cb();
  }
});
