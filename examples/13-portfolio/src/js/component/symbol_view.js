W.component('symbol_view', {
  getData: function(cb) {
    const portfolio = this.app.data.portfolio || {};
    const symbols = portfolio.symbols || [];
    const totalValue = portfolio.totalValue || 0;

    cb({
      symbols,
      totalValue,
      hasSymbols: symbols.length > 0
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
  }
});
