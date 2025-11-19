W.component('exchange_view', {
  init: function() {
    // Subscribe to portfolio data
    this.app.data.on('portfolio', () => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const portfolio = this.app.data.get('portfolio');
    const exchanges = portfolio ? portfolio.exchanges : [];
    const totalValue = portfolio ? portfolio.totalValue : 0;

    cb({
      exchanges,
      totalValue,
      hasExchanges: exchanges.length > 0
    });
  },

  rendered: function(cb) {
    cb();
  }
});
