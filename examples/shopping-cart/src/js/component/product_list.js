import dataInterface from '../data.js';

W.component('product_list', {
  init: function() {
    // Listen to product data changes
    this.app.data.on('products', (data) => {
      console.log('product_list: products updated', data);
      this.load();
    }, this);

    // Listen to cart changes to update button states
    this.app.data.on('cart', (data) => {
      console.log('product_list: cart updated', data);
      this.load();
    }, this);
  },

  getData: function(cb) {
    const products = this.app.data.get('products') || [];
    const cart = this.app.data.get('cart') || [];

    // Enhance products with cart info
    const productsWithCartInfo = products.map(product => {
      const cartItem = cart.find(item => item.productId === product.id);
      return {
        ...product,
        inCart: cartItem ? cartItem.quantity : 0
      };
    });

    cb({ products: productsWithCartInfo });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Add to cart button handler
    $container.find('.add-to-cart').on('click', (e) => {
      const productId = parseInt($(e.currentTarget).data('product-id'));
      const products = this.app.data.get('products');

      const product = products.find(p => p.id === productId);
      if (!product) return;

      // Create cart item
      const cartItem = {
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: 1
      };

      // Call async addToCart method
      dataInterface.addToCart(cartItem, (result) => {
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
