// API module - interface for fetching portfolio and price history data
// Currently uses mock data, but can be easily replaced with real API calls

import { mockData } from './mockData.js';

export const api = {
  /**
   * Fetch portfolio data
   * @param {Function} callback - Called with processed portfolio data
   */
  fetchPortfolio: function(callback) {
    const delay = Math.floor(Math.random() * 500) + 500; // 500-1000ms

    setTimeout(() => {
      // In production, replace this with actual API call:
      // fetch('/api/portfolio')
      //   .then(response => response.json())
      //   .then(rawData => {
      //     const processed = mockData.processPortfolioData(rawData);
      //     callback(processed);
      //   });

      const rawData = mockData.generatePortfolio();
      const processed = mockData.processPortfolioData(rawData);
      callback(processed);
    }, delay);
  },

  /**
   * Fetch price history for a specific symbol
   * @param {string} symbol - The cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @param {Function} callback - Called with array of price history data
   */
  fetchPriceHistory: function(symbol, callback) {
    const delay = 300;

    setTimeout(() => {
      // In production, replace this with actual API call:
      // fetch(`/api/price-history/${symbol}`)
      //   .then(response => response.json())
      //   .then(history => callback(history));

      const history = mockData.generateHistory(symbol);
      callback(history);
    }, delay);
  }
};
