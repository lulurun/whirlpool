W.component('header', {
  init: function() {
    // Subscribe to portfolio data
    this.app.data.on('portfolio', () => {
      this.load();
    }, this);

    // Subscribe to lastUpdate
    this.app.data.on('lastUpdate', () => {
      this.load();
    }, this);

    // Subscribe to isLoading
    this.app.data.on('isLoading', () => {
      this.load();
    }, this);

    // Fetch initial data
    this.app.data.fetch(['portfolio', 'lastUpdate', 'isLoading']);

    // Set up auto-refresh (60 seconds)
    this.refreshInterval = setInterval(() => {
      const isLoading = this.app.data.get('isLoading');
      if (!isLoading) {
        this.refreshData();
      }
    }, 60000);
  },

  refreshData: function() {
    // Set loading state
    this.app.data.emit('isLoading', true, this);

    // Fetch new data from mock API
    window.mockApi.fetchPortfolio((rawData) => {
      const processed = window.mockApi.processPortfolioData(rawData);

      // Update app.data
      this.app.data.emit('portfolio', processed, this);
      this.app.data.emit('lastUpdate', processed.timestamp, this);
      this.app.data.emit('isLoading', false, this);
    });
  },

  getData: function(cb) {
    const portfolio = this.app.data.get('portfolio');
    const totalValue = portfolio ? portfolio.totalValue : 0;
    const lastUpdate = this.app.data.get('lastUpdate');
    const isLoading = this.app.data.get('isLoading');

    cb({
      totalValue,
      lastUpdate,
      isLoading
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Handle refresh button click
    $container.find('[data-role="refresh"]').on('click', () => {
      this.refreshData();
    });

    cb();
  },

  cleanup: function() {
    // Clear auto-refresh interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
});
