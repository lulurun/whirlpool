// Helper function to refresh portfolio data
function refreshData(component) {
  // Set loading state
  component.isLoading = true;
  component.load();

  // Fetch portfolio data via app.data
  // This will call the registered fetch function and emit events to all listeners
  component.app.data.fetch(['portfolio']);
}

W.component('header', {
  init: function() {
    // Initialize internal state
    this.lastUpdate = null;
    this.isLoading = false;

    // Subscribe to portfolio data
    this.app.data.on('portfolio', (data) => {
      // Update internal state when portfolio data changes
      if (data && data.timestamp) {
        this.lastUpdate = data.timestamp;
      }
      this.isLoading = false;
      this.load();
    }, this);

    // Fetch initial data
    this.isLoading = true;
    this.app.data.fetch(['portfolio']);

    // Set up auto-refresh (60 seconds)
    this.refreshInterval = setInterval(() => {
      if (!this.isLoading) {
        refreshData(this);
      }
    }, 60000);
  },

  getData: function(cb) {
    const portfolio = this.app.data.get('portfolio');
    const totalValue = portfolio ? portfolio.totalValue : 0;

    cb({
      totalValue,
      lastUpdate: this.lastUpdate,
      isLoading: this.isLoading
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Handle refresh button click
    $container.find('[data-role="refresh"]').on('click', () => {
      refreshData(this);
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
