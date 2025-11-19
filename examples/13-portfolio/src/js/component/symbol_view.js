W.component('symbol_view', {
  init: function() {
    // Subscribe to portfolio data
    this.app.data.on('portfolio', () => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const portfolio = this.app.data.get('portfolio');
    const symbols = portfolio ? portfolio.symbols : [];
    const totalValue = portfolio ? portfolio.totalValue : 0;

    cb({
      symbols,
      totalValue,
      hasSymbols: symbols.length > 0
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
