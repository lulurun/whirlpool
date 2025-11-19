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
import { api } from './util/api.js';

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

// Register shared data sources with API fetch functions
app.data.register('portfolio', (cb) => {
  api.fetchPortfolio(cb);
});

app.data.register('priceHistory', (cb) => {
  // Price history needs a symbol parameter
  // This will be called with app.data.fetch(['priceHistory'])
  // For now, return null - actual fetch will be done per-symbol basis
  cb(null);
});

// Start the application
app.start(document.body);
