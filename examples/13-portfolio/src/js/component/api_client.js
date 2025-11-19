// Mock API client for portfolio data
W.component('api_client', {
  init: function() {
    this.refreshInterval = null;
    this.AUTO_REFRESH_INTERVAL = 60000; // 60 seconds
  },

  load: function(cb) {
    // Fetch initial data
    this.fetchPortfolio();

    // Set up auto-refresh
    this.refreshInterval = setInterval(() => {
      this.fetchPortfolio();
    }, this.AUTO_REFRESH_INTERVAL);

    cb();
  },

  unload: function(cb) {
    // Clean up interval on unload
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    cb();
  },

  fetchPortfolio: function() {
    // Set loading state
    this.app.data.isLoading = true;

    // Simulate network delay
    const delay = Math.floor(Math.random() * 500) + 500; // 500-1000ms

    setTimeout(() => {
      try {
        const mockData = this.generateMockPortfolio();
        this.processPortfolioData(mockData);

        // Update app data
        this.app.data.lastUpdate = mockData.timestamp;
        this.app.data.isLoading = false;

        // Emit event
        this.app.ev.emit('portfolio.updated');
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        this.app.data.isLoading = false;
        this.app.ev.emit('portfolio.error', error);
      }
    }, delay);
  },

  generateMockPortfolio: function() {
    const exchanges = ['binance', 'coinbase', 'kraken', 'bitflyer'];
    const symbols = [
      { name: 'BTC', basePrice: 6500000 },
      { name: 'ETH', basePrice: 320000 },
      { name: 'USDT', basePrice: 150 },
      { name: 'USDC', basePrice: 150 },
      { name: 'BNB', basePrice: 35000 },
      { name: 'SOL', basePrice: 12000 },
      { name: 'ADA', basePrice: 60 },
      { name: 'DOT', basePrice: 800 },
      { name: 'MATIC', basePrice: 120 },
      { name: 'AVAX', basePrice: 4500 }
    ];

    const holdings = [];
    const numHoldings = Math.floor(Math.random() * 5) + 10; // 10-14 holdings

    for (let i = 0; i < numHoldings; i++) {
      const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
      const symbolInfo = symbols[Math.floor(Math.random() * symbols.length)];

      // Add some price variation (±5%)
      const priceVariation = 1 + (Math.random() * 0.1 - 0.05);
      const price = Math.round(symbolInfo.basePrice * priceVariation);

      // Random amount based on symbol
      let amount;
      if (symbolInfo.name === 'BTC') {
        amount = parseFloat((Math.random() * 2).toFixed(8));
      } else if (symbolInfo.name === 'ETH') {
        amount = parseFloat((Math.random() * 20).toFixed(8));
      } else if (symbolInfo.name === 'USDT' || symbolInfo.name === 'USDC') {
        amount = parseFloat((Math.random() * 50000).toFixed(8));
      } else {
        amount = parseFloat((Math.random() * 1000).toFixed(8));
      }

      const jpy_value = Math.round(amount * price);

      holdings.push({
        exchange,
        symbol: symbolInfo.name,
        amount,
        price,
        jpy_value
      });
    }

    return {
      holdings,
      timestamp: new Date().toISOString()
    };
  },

  processPortfolioData: function(data) {
    const holdings = data.holdings;

    // Calculate total value
    const totalValue = holdings.reduce((sum, h) => sum + h.jpy_value, 0);

    // Sort holdings by value (descending)
    const sortedHoldings = holdings.sort((a, b) => b.jpy_value - a.jpy_value);

    // Add percentage to each holding
    const detailedHoldings = sortedHoldings.map(h => ({
      ...h,
      percentage: (h.jpy_value / totalValue) * 100
    }));

    // Group by exchange
    const exchangeMap = {};
    holdings.forEach(h => {
      if (!exchangeMap[h.exchange]) {
        exchangeMap[h.exchange] = {
          exchange: h.exchange,
          count: 0,
          total: 0
        };
      }
      exchangeMap[h.exchange].count++;
      exchangeMap[h.exchange].total += h.jpy_value;
    });

    const exchanges = Object.values(exchangeMap)
      .map(e => ({
        ...e,
        percentage: (e.total / totalValue) * 100
      }))
      .sort((a, b) => b.total - a.total);

    // Group by symbol
    const symbolMap = {};
    holdings.forEach(h => {
      if (!symbolMap[h.symbol]) {
        symbolMap[h.symbol] = {
          symbol: h.symbol,
          totalAmount: 0,
          totalValue: 0,
          exchanges: [],
          prices: []
        };
      }
      symbolMap[h.symbol].totalAmount += h.amount;
      symbolMap[h.symbol].totalValue += h.jpy_value;
      symbolMap[h.symbol].prices.push(h.price);
      if (!symbolMap[h.symbol].exchanges.includes(h.exchange)) {
        symbolMap[h.symbol].exchanges.push(h.exchange);
      }
    });

    const symbols = Object.values(symbolMap)
      .map(s => ({
        symbol: s.symbol,
        amount: s.totalAmount,
        avgPrice: Math.round(s.prices.reduce((a, b) => a + b, 0) / s.prices.length),
        total: s.totalValue,
        percentage: (s.totalValue / totalValue) * 100,
        exchanges: s.exchanges.join(', ')
      }))
      .sort((a, b) => b.total - a.total);

    // Store in app.data
    this.app.data.portfolio = {
      holdings: detailedHoldings,
      exchanges,
      symbols,
      totalValue
    };
  },

  fetchPriceHistory: function(symbol, cb) {
    // Simulate network delay
    setTimeout(() => {
      const history = this.generateMockHistory(symbol);
      cb(history);
    }, 300);
  },

  generateMockHistory: function(symbol) {
    const symbolPrices = {
      'BTC': 6500000,
      'ETH': 320000,
      'USDT': 150,
      'USDC': 150,
      'BNB': 35000,
      'SOL': 12000,
      'ADA': 60,
      'DOT': 800,
      'MATIC': 120,
      'AVAX': 4500
    };

    const basePrice = symbolPrices[symbol] || 1000;
    const history = [];
    const days = 30;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Generate realistic price fluctuation
      const variation = 1 + (Math.sin(i / 5) * 0.1) + (Math.random() * 0.1 - 0.05);
      const price = Math.round(basePrice * variation);

      history.push({
        time: date.toISOString(),
        price
      });
    }

    return history;
  }
});
