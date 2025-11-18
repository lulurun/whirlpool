W.component('stats', {
  init: function() {
    // Listen to BOTH products and cart data
    // This component combines data from multiple sources
    this.app.data.on('products', (data) => {
      console.log('stats: products updated', data);
      this.load();
    }, this);

    this.app.data.on('cart', (data) => {
      console.log('stats: cart updated', data);
      this.load();
    }, this);

    // Fetch both products and cart data
    this.app.data.fetch(['products', 'cart']);
  },

  getData: function(cb) {
    const products = this.app.data.get('products');
    const cart = this.app.data.get('cart');

    // Check if data is loading (null means not yet fetched)
    const isLoading = products === null || cart === null;

    if (isLoading) {
      cb({ isLoading: true });
      return;
    }

    // Calculate statistics from both data sources
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const itemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const averagePrice = products.length > 0
      ? (products.reduce((sum, p) => sum + p.price, 0) / products.length)
      : 0;

    cb({
      isLoading: false,
      totalProducts: totalProducts,
      totalStock: totalStock,
      itemsInCart: itemsInCart,
      cartValue: cartValue.toFixed(2),
      averagePrice: averagePrice.toFixed(2)
    });
  }
});
