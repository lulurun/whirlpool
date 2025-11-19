W.component('detailed_view', {
  getData: function(cb) {
    const portfolio = this.app.data.portfolio || {};
    const holdings = portfolio.holdings || [];
    const totalValue = portfolio.totalValue || 0;

    cb({
      holdings,
      totalValue,
      hasHoldings: holdings.length > 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Listen for portfolio updates
    this.app.ev.on('portfolio.updated', () => {
      this.load();
    });

    // Handle chart button clicks
    $container.find('[data-role="show-chart"]').on('click', (e) => {
      const symbol = $(e.currentTarget).data('symbol');
      this.app.ev.emit('chart.show', symbol);
    });

    cb();
  },

  getExchangeBadgeClass: function(exchange) {
    const classes = {
      'binance': 'bg-warning',
      'coinbase': 'bg-primary',
      'kraken': 'bg-info',
      'bitflyer': 'bg-success',
      'liquid': 'bg-danger'
    };
    return classes[exchange] || 'bg-secondary';
  }
});
