W.component('chart_modal', {
  init: function() {
    this.chart = null;
    this.currentSymbol = null;
  },

  getData: function(cb) {
    cb({
      symbol: this.currentSymbol || ''
    });
  },

  rendered: function(cb) {
    const $modal = $(this.el).find('.modal');

    // Listen for chart.show event
    this.app.ev.on('chart.show', (symbol) => {
      this.currentSymbol = symbol;
      this.showChart(symbol);
    });

    // Clean up chart when modal is hidden
    $modal.on('hidden.bs.modal', () => {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    });

    cb();
  },

  showChart: function(symbol) {
    const $modal = $(this.el).find('.modal');
    const $title = $modal.find('[data-role="modal-title"]');
    const $canvas = $modal.find('[data-role="chart-canvas"]');
    const $loading = $modal.find('[data-role="loading"]');
    const $chartContainer = $modal.find('[data-role="chart-container"]');

    // Update modal title
    $title.text(`${symbol} Price History (30 Days)`);

    // Show modal
    const modalInstance = new bootstrap.Modal($modal[0]);
    modalInstance.show();

    // Show loading state
    $loading.show();
    $chartContainer.hide();

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    // Fetch price history
    const apiClient = this.app.components.find(c => c.name === 'api_client');
    if (apiClient) {
      apiClient.fetchPriceHistory(symbol, (history) => {
        // Hide loading, show chart
        $loading.hide();
        $chartContainer.show();

        // Prepare chart data
        const labels = history.map(h => {
          const date = new Date(h.time);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const prices = history.map(h => h.price);

        // Create chart
        const ctx = $canvas[0].getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `${symbol} Price (JPY)`,
              data: prices,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.1,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += '¥' + context.parsed.y.toLocaleString();
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  callback: function(value) {
                    return '¥' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      });
    }
  }
});
