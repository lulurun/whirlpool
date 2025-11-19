// Import components
import './component/header.js';
import './component/detailed_view.js';
import './component/exchange_view.js';
import './component/symbol_view.js';
import './component/chart_modal.js';

// Import helpers
import './helpers/formatNumber.js';
import './helpers/formatPercent.js';
import './helpers/formatDate.js';
import './helpers/eq.js';

// Import utilities
import { mockApi } from './util/mockApi.js';

function getTemplate(name, cb) {
  // Load templates from the template directory
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app
const app = W.app('portfolio-app', getTemplate);

// Register Switch for tab navigation
W.switch('portfolio_tabs', {
  knownComponents: {
    'detailed': 'detailed_view',
    'exchange': 'exchange_view',
    'symbol': 'symbol_view'
  }
});

// Register shared data sources
app.data.register('portfolio', (cb) => {
  // Fetch from mock API
  mockApi.fetchPortfolio((rawData) => {
    const processed = mockApi.processPortfolioData(rawData);
    cb(processed);
  });
});

app.data.register('lastUpdate', (cb) => {
  cb(null);
});

app.data.register('isLoading', (cb) => {
  cb(false);
});

app.data.register('priceHistory', (cb) => {
  cb(null);
});

// Start the application
app.start(document.body);

// Make mockApi globally available for components
window.mockApi = mockApi;
