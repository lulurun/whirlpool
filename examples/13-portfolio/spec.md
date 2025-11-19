# Portfolio Dashboard - Specification

## Overview

A cryptocurrency portfolio management dashboard that displays holdings across multiple exchanges, aggregated by exchange and by symbol. This is a reimplementation of the Andes portfolio web UI using the Whirlpool framework.

## Features

### 1. Header Component
- Display total portfolio value in JPY
- Show last update timestamp
- Refresh button with loading state
- Auto-refresh every 60 seconds

### 2. Tab Navigation
Three views accessible via Bootstrap tabs:
- **Detailed Holdings**: List all individual holdings with exchange, symbol, amount, price, and value
- **By Exchange**: Aggregate holdings grouped by exchange
- **By Symbol**: Aggregate holdings grouped by cryptocurrency symbol

### 3. Detailed Holdings View
Display table with columns:
- Exchange (with colored badge)
- Symbol
- Amount (8 decimal places)
- Price in JPY (2 decimal places)
- Total Value in JPY (2 decimal places)
- Percentage of total portfolio
- Visual allocation bar (progress bar showing percentage)
- Chart button (to show price history chart)

Features:
- Sort by JPY value (descending)
- Show total value in table footer
- Empty state message when no holdings

### 4. Exchange View
Display table with columns:
- Exchange name
- Number of holdings
- Total value in JPY
- Percentage of total portfolio
- Visual allocation bar

Features:
- Sort by JPY value (descending)
- Show total value in table footer
- Empty state message when no exchanges

### 5. Symbol View
Display table with columns:
- Symbol (cryptocurrency)
- Total amount across all exchanges
- Average price in JPY
- Total value in JPY
- Percentage of total portfolio
- Exchanges holding this symbol (comma-separated list)
- Chart button

Features:
- Sort by JPY value (descending)
- Show total value in table footer
- Empty state message when no symbols

### 6. Chart Modal
- Modal dialog showing price history chart
- Uses Chart.js for line chart
- Shows symbol name in title
- Close button
- Load history data from mock API

### 7. Data Management

#### Mock API Client
Create a stub client that simulates fetching from Andes API:
- `GET /api/portfolio` - Returns portfolio holdings data
- `GET /api/portfolio_history?symbol=BTC` - Returns price history for a symbol

Mock data structure:
```javascript
{
  "holdings": [
    {
      "exchange": "binance",
      "symbol": "BTC",
      "amount": 0.5,
      "price": 6500000,
      "jpy_value": 3250000
    },
    {
      "exchange": "coinbase",
      "symbol": "ETH",
      "amount": 10.5,
      "price": 320000,
      "jpy_value": 3360000
    },
    // ... more holdings
  ],
  "timestamp": "2024-11-18T12:00:00Z"
}
```

History data:
```javascript
[
  { "time": "2024-11-01T00:00:00Z", "price": 6000000 },
  { "time": "2024-11-02T00:00:00Z", "price": 6100000 },
  // ... more data points
]
```

#### Data Processing
The API client component should:
- Fetch portfolio data on init
- Auto-refresh every 60 seconds
- Calculate aggregations:
  - Total portfolio value
  - Group by exchange with totals
  - Group by symbol with totals across exchanges
- Store processed data in `app.data`:
  - `portfolio` - Processed portfolio data with holdings, exchanges, symbols, totals
  - `history` - Price history data
  - `lastUpdate` - Timestamp of last update
  - `isLoading` - Loading state
- Emit events:
  - `portfolio.updated` - When portfolio data is refreshed
  - `portfolio.error` - When fetch fails
  - `chart.show` - When user clicks chart button

## Technical Requirements

### Framework
- Use Whirlpool framework
- Bootstrap 5 for styling (use default Bootstrap classes, minimal custom CSS)
- Font Awesome icons
- Chart.js for charts
- jQuery for DOM manipulation

### Components
1. `api_client` - Invisible service component for API calls and data management
2. `header` - Header with title, total value, refresh button
3. `detailed_view` - Detailed holdings table
4. `exchange_view` - Exchange aggregation table
5. `symbol_view` - Symbol aggregation table
6. `chart_modal` - Modal for displaying price charts

### Switch
- `portfolio_tabs` - Switch component for tab navigation between the three views

### Handlebars Helpers
- `formatNumber(value, decimals)` - Format numbers with comma separators
- `formatPercent(value, decimals)` - Format percentage with % symbol
- `formatDate(isoString)` - Format ISO date to readable format
- `eq(a, b)` - Equality check for conditionals

### Data Flow
1. App starts → api_client initializes
2. api_client fetches portfolio data from mock API
3. api_client processes and aggregates data
4. api_client stores in app.data (portfolio, totals, etc.)
5. All view components subscribe to app.data changes
6. When data updates, views automatically reload
7. User can manually refresh via header button
8. Auto-refresh runs every 60 seconds
9. Clicking chart button emits event → chart_modal opens and loads history

### Mock Data Generation
Generate realistic mock data with:
- 3-5 exchanges (binance, coinbase, kraken, bitflyer, liquid)
- 8-12 different cryptocurrency symbols (BTC, ETH, USDT, USDC, BNB, SOL, ADA, DOT, etc.)
- Random amounts and realistic JPY prices
- Total portfolio value around ¥10,000,000 - ¥50,000,000
- Price history with 30 days of data, realistic fluctuations

### Styling
- Use Bootstrap 5 default classes
- Exchange badges with different colors per exchange
- Progress bars for allocation visualization
- Responsive table design
- Loading spinner on refresh button
- Alert message for last update timestamp
- Monospace font for numbers
- Success color (green) for positive values
- Warning/info colors for empty states

### File Structure
```
examples/13-portfolio/
├── src/
│   ├── html/
│   │   └── index.html
│   └── js/
│       ├── component/
│       │   ├── api_client.js
│       │   ├── header.js
│       │   ├── detailed_view.js
│       │   ├── exchange_view.js
│       │   ├── symbol_view.js
│       │   └── chart_modal.js
│       ├── helpers/
│       │   ├── formatNumber.js
│       │   ├── formatPercent.js
│       │   ├── formatDate.js
│       │   └── eq.js
│       ├── template/
│       │   ├── header.html
│       │   ├── detailed_view.html
│       │   ├── exchange_view.html
│       │   ├── symbol_view.html
│       │   └── chart_modal.html
│       └── index.js
├── public/              (generated by webpack)
├── package.json
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── spec.md
└── README.md
```

## Development Notes

### Bootstrap Components to Use
- `.table`, `.table-striped`, `.table-hover` - For tables
- `.badge` - For exchange labels
- `.progress`, `.progress-bar` - For allocation bars
- `.btn`, `.btn-primary`, `.btn-outline-primary` - For buttons
- `.nav`, `.nav-tabs` - For tab navigation
- `.modal` - For chart dialog
- `.alert` - For messages
- `.spinner-border` - For loading state

### Testing
The mock API client should simulate:
- Network delay (500ms - 1000ms)
- Occasional errors (10% failure rate for testing error states)
- Realistic data that changes slightly on each refresh to simulate live updates

### Accessibility
- Proper ARIA labels for progress bars
- Semantic table structure
- Button text and icons
- Loading state announcements
