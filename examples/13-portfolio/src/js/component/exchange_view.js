W.component('exchange_view', {
  getData: function(cb) {
    const portfolio = this.app.data.portfolio || {};
    const exchanges = portfolio.exchanges || [];
    const totalValue = portfolio.totalValue || 0;

    cb({
      exchanges,
      totalValue,
      hasExchanges: exchanges.length > 0
    });
  },

  rendered: function(cb) {
    // Listen for portfolio updates
    this.app.ev.on('portfolio.updated', () => {
      this.load();
    });

    cb();
  }
});
