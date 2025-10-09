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
      const cart = this.app.data.get('cart') || [];

      const product = products.find(p => p.id === productId);
      if (!product) return;

      // Check if already in cart
      const existingItem = cart.find(item => item.productId === productId);

      let newCart;
      if (existingItem) {
        // Increase quantity
        if (existingItem.quantity >= product.stock) {
          alert('Cannot add more - stock limit reached');
          return;
        }
        newCart = cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        newCart = [...cart, {
          productId: productId,
          name: product.name,
          price: product.price,
          quantity: 1
        }];
      }

      // Emit cart change - all components listening to 'cart' will update
      this.app.data.emit('cart', newCart, this);
    });

    cb();
  }
});
