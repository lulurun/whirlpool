# Portfolio Dashboard Example

A cryptocurrency portfolio management dashboard built with the Whirlpool framework. This example demonstrates how to create a complete data-driven application with multiple views, real-time updates, and interactive charts.

## Features

### Core Functionality
- **Portfolio Overview**: Display total portfolio value in JPY
- **Multi-View Display**: Three different views of the same data
  - Detailed Holdings: Individual holdings with full details
  - By Exchange: Holdings aggregated by exchange
  - By Symbol: Holdings aggregated by cryptocurrency symbol
- **Auto-Refresh**: Automatic data refresh every 60 seconds
- **Manual Refresh**: Refresh button with loading state
- **Price Charts**: Interactive modal charts showing 30-day price history using Chart.js
- **Responsive Design**: Bootstrap 5 responsive tables and layouts

### Data Management
- **Mock API Service**: Simulates real API with network delays
- **Data Aggregation**: Processes raw holdings into multiple views
- **Event-Driven Updates**: Components automatically reload when data changes
- **Shared State**: Uses `app.data` for centralized state management

## Architecture

### Components

1. **api_client** (Service Component)
   - Invisible component that manages all data fetching
   - Generates realistic mock portfolio data
   - Auto-refreshes every 60 seconds
   - Emits `portfolio.updated` events
   - Calculates aggregations and percentages

2. **header**
   - Displays total portfolio value
   - Shows last update timestamp
   - Refresh button with loading spinner

3. **detailed_view**
   - Table of all individual holdings
   - Shows exchange, symbol, amount, price, value, percentage
   - Visual allocation bars
   - Chart buttons for each holding

4. **exchange_view**
   - Aggregated view grouped by exchange
   - Shows holdings count and total value per exchange
   - Visual allocation bars

5. **symbol_view**
   - Aggregated view grouped by cryptocurrency symbol
   - Shows total amount, average price, exchanges holding the symbol
   - Chart buttons for price history

6. **chart_modal**
   - Bootstrap modal with Chart.js line chart
   - Shows 30-day price history
   - Loads data on demand when chart button is clicked

### Data Flow

```
1. App starts → api_client initializes
2. api_client fetches and processes mock portfolio data
3. Data stored in app.data.portfolio with aggregations
4. api_client emits 'portfolio.updated' event
5. All view components listen for event and reload
6. Auto-refresh triggers every 60 seconds
7. User clicks chart button → emits 'chart.show' event
8. chart_modal listens for event, fetches history, displays chart
```

### Handlebars Helpers

- **formatNumber(value, decimals)**: Formats numbers with comma separators
- **formatPercent(value, decimals)**: Formats percentages with % symbol
- **formatDate(isoString)**: Formats ISO timestamps to readable format
- **eq(a, b)**: Equality comparison for conditionals in templates

## Mock Data

The `api_client` component generates realistic mock data including:
- 3-5 exchanges: binance, coinbase, kraken, bitflyer
- 10-14 different cryptocurrency holdings
- 8-12 unique symbols: BTC, ETH, USDT, USDC, BNB, SOL, ADA, DOT, MATIC, AVAX
- Total portfolio value: ¥10M - ¥50M JPY
- Realistic price fluctuations (±5% from base price)
- 30 days of historical price data with sine wave + random variations

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:8080`.

## Production Build

Build for production:

```bash
npm build
```

The compiled files will be in the `public/` directory.

## Technologies Used

- **Whirlpool Framework**: Component-based architecture
- **Bootstrap 5**: UI components and responsive layout
- **Chart.js**: Interactive price history charts
- **Handlebars**: Template rendering
- **jQuery**: DOM manipulation and event handling
- **Font Awesome**: Icons
- **Webpack**: Module bundling and build process

## Project Structure

```
13-portfolio/
├── src/
│   ├── html/
│   │   └── index.html              # Main HTML with Bootstrap layout
│   └── js/
│       ├── component/
│       │   ├── api_client.js       # Mock API service
│       │   ├── header.js           # Header with total value
│       │   ├── detailed_view.js    # Detailed holdings table
│       │   ├── exchange_view.js    # Exchange aggregation table
│       │   ├── symbol_view.js      # Symbol aggregation table
│       │   └── chart_modal.js      # Chart.js modal
│       ├── helpers/
│       │   ├── formatNumber.js     # Number formatting
│       │   ├── formatPercent.js    # Percentage formatting
│       │   ├── formatDate.js       # Date formatting
│       │   └── eq.js               # Equality helper
│       ├── template/
│       │   ├── header.html
│       │   ├── detailed_view.html
│       │   ├── exchange_view.html
│       │   ├── symbol_view.html
│       │   └── chart_modal.html
│       └── index.js                # App entry point
├── public/                         # Generated build output
├── package.json
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── .gitignore
├── spec.md                         # Detailed specification
└── README.md
```

## Key Concepts Demonstrated

1. **Service Components**: The `api_client` is an invisible component that provides data services
2. **Event Bus**: Components communicate via `app.ev.emit()` and `app.ev.on()`
3. **Shared State**: `app.data` provides centralized state accessible to all components
4. **Auto-Refresh**: Using `setInterval` for periodic updates
5. **Data Aggregation**: Processing raw data into multiple views
6. **Bootstrap Integration**: Using Bootstrap modals, tabs, tables, and responsive design
7. **Chart.js Integration**: Creating dynamic charts based on user interaction
8. **Custom Handlebars Helpers**: Creating reusable template formatting functions
9. **Loading States**: Managing and displaying loading/busy states
10. **Component Lifecycle**: Using `init`, `load`, `getData`, `rendered`, and `unload` hooks

## Styling

The application uses:
- Bootstrap 5 default classes for most styling
- Colored badges for exchange names
- Progress bars for visual allocation representation
- Monospace font for numeric values
- Success color (green) for positive values
- Responsive tables with horizontal scrolling on mobile
- Font Awesome icons for visual enhancement

## License

This is an example project for the Whirlpool framework.
