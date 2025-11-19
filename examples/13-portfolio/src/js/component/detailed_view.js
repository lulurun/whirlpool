W.component('detailed_view', {
  init: function() {
    // Subscribe to portfolio data
    this.app.data.on('portfolio', () => {
      this.load();
    }, this);

    // Fetch initial data
    this.app.data.fetch(['portfolio']);
  },

  getData: function(cb) {
    const portfolio = this.app.data.get('portfolio');
    const holdings = portfolio ? portfolio.holdings : [];
    const totalValue = portfolio ? portfolio.totalValue : 0;

    cb({
      holdings,
      totalValue,
      hasHoldings: holdings.length > 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Handle chart button clicks
    $container.find('[data-role="show-chart"]').on('click', (e) => {
      const symbol = $(e.currentTarget).data('symbol');
      this.app.ev.emit('chart.show', symbol);
    });

    cb();
  }
});
