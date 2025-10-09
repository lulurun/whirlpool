W.component('cart_details', {
  init: function() {
    // Subscribe to cart changes
    this.app.data.on('cart', (data) => {
      console.log('cart_details: cart updated', data);
      this.load();
    }, this);
  },

  getData: function(cb) {
    const cart = this.app.data.get('cart') || [];
    cb({ items: cart });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Remove item button
    $container.find('.remove-item').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));
      const cart = this.app.data.get('cart') || [];

      const newCart = cart.filter(item => item.productId !== productId);

      // Emit updated cart
      this.app.data.emit('cart', newCart, this);
    });

    // Decrease quantity button
    $container.find('.decrease-qty').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));
      const cart = this.app.data.get('cart') || [];

      const newCart = cart.map(item => {
        if (item.productId === productId) {
          const newQuantity = item.quantity - 1;
          if (newQuantity <= 0) return null; // Remove item
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item !== null);

      // Emit updated cart
      this.app.data.emit('cart', newCart, this);
    });

    // Increase quantity button
    $container.find('.increase-qty').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));
      const cart = this.app.data.get('cart') || [];
      const products = this.app.data.get('products') || [];

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newCart = cart.map(item => {
        if (item.productId === productId) {
          if (item.quantity >= product.stock) {
            alert('Cannot add more - stock limit reached');
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      // Emit updated cart
      this.app.data.emit('cart', newCart, this);
    });

    cb();
  }
});
