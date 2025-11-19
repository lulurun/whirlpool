# API Integration

This directory contains the API layer for the portfolio application.

## File Structure

### `api.js`
The main API module that exposes two methods:
- `fetchPortfolio(callback)` - Fetches and returns processed portfolio data
- `fetchPriceHistory(symbol, callback)` - Fetches price history for a specific symbol

**This is the only file that needs to be modified when integrating with the real Andes API.**

### `mockData.js`
Contains mock data generators and data processing utilities:
- `generatePortfolio()` - Generates mock portfolio data
- `generateHistory(symbol)` - Generates mock price history
- `processPortfolioData(rawData)` - Processes raw portfolio data into aggregated views

This file can remain unchanged when switching to the real API, as it can be used for testing or removed entirely.

## How It Works

### Portfolio Data (Shared State)

Portfolio data is managed through Whirlpool's `app.data` system:

1. **Registration** (`index.js`):
   ```javascript
   app.data.register('portfolio', (cb) => {
     api.fetchPortfolio(cb);
   });
   ```

2. **Initial Fetch** (header component):
   ```javascript
   this.app.data.fetch(['portfolio']); // Calls api.fetchPortfolio()
   ```

3. **Refresh/Re-fetch** (header component):
   ```javascript
   this.app.data.fetch(['portfolio']); // Re-fetches and notifies all subscribers
   ```

4. **Subscribe** (tab components):
   ```javascript
   this.app.data.on('portfolio', () => {
     this.load(); // Automatically called when data changes
   }, this);
   ```

5. **Access** (all components):
   ```javascript
   const portfolio = this.app.data.get('portfolio');
   ```

### Price History Data (Component-Specific)

Price history is fetched per-symbol and is not shared state:

```javascript
import { api } from '../util/api.js';

api.fetchPriceHistory(symbol, (history) => {
  // Use history data
});
```

## Integration with Real API

To integrate with the real Andes API, modify `api.js`:

```javascript
// Before (mock implementation)
export const api = {
  fetchPortfolio: function(callback) {
    setTimeout(() => {
      const rawData = mockData.generatePortfolio();
      const processed = mockData.processPortfolioData(rawData);
      callback(processed);
    }, delay);
  }
};

// After (real API implementation)
export const api = {
  fetchPortfolio: function(callback) {
    fetch('https://andes-api.example.com/portfolio')
      .then(response => response.json())
      .then(rawData => {
        // Use mockData.processPortfolioData if data format matches
        // or implement custom processing
        const processed = mockData.processPortfolioData(rawData);
        callback(processed);
      })
      .catch(error => {
        console.error('Failed to fetch portfolio:', error);
        // Handle error appropriately
      });
  }
};
```

The same pattern applies to `fetchPriceHistory()`.

**No other files need to be changed** - the `app.data` system will automatically handle fetching and notifying all components.

## Data Format

### Portfolio Data (Raw)
```javascript
{
  holdings: [
    {
      exchange: 'binance',
      symbol: 'BTC',
      amount: 1.5,
      price: 6500000,
      jpy_value: 9750000
    },
    // ...
  ],
  timestamp: '2025-11-19T12:00:00.000Z'
}
```

### Portfolio Data (Processed)
The `processPortfolioData()` function transforms raw data into:
```javascript
{
  holdings: [...],        // Sorted by value with percentages
  exchanges: [...],       // Grouped by exchange with totals
  symbols: [...],         // Grouped by symbol with averages
  totalValue: 50000000,
  timestamp: '2025-11-19T12:00:00.000Z'
}
```

### Price History Data
```javascript
[
  {
    time: '2025-10-20T00:00:00.000Z',
    price: 6500000
  },
  // ... 30 days of data
]
```
