// Import components
import './component/api_client.js';
import './component/header.js';
import './component/detailed_view.js';
import './component/exchange_view.js';
import './component/symbol_view.js';
import './component/chart_modal.js';

function getTemplate(name, cb) {
  // Load templates from the template directory
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app
const app = W.app('portfolio-app', getTemplate);

// Start the application
app.start(document.body);
