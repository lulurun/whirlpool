W.component('header', {
  getData: function(cb) {
    const portfolio = this.app.data.portfolio || {};
    const totalValue = portfolio.totalValue || 0;
    const lastUpdate = this.app.data.lastUpdate || '';
    const isLoading = this.app.data.isLoading || false;

    cb({
      totalValue,
      lastUpdate,
      isLoading
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Listen for portfolio updates
    this.app.ev.on('portfolio.updated', () => {
      this.load();
    });

    // Handle refresh button click
    $container.find('[data-role="refresh"]').on('click', () => {
      // Get the api_client component and trigger refresh
      const apiClient = this.app.components.find(c => c.name === 'api_client');
      if (apiClient) {
        apiClient.fetchPortfolio();
      }
    });

    cb();
  }
});
