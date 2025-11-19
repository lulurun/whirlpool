// Mock data generator - simulates backend data

export const mockData = {
  // Generate mock portfolio data
  generatePortfolio: function() {
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

  // Generate mock price history
  generateHistory: function(symbol) {
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
  },

  // Process raw portfolio data into aggregated views
  processPortfolioData: function(rawData) {
    const holdings = rawData.holdings;

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

    return {
      holdings: detailedHoldings,
      exchanges,
      symbols,
      totalValue,
      timestamp: rawData.timestamp
    };
  }
};
