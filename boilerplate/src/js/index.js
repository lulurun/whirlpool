// Import Whirlpool components
import './component/simple_app.js';

function getTemplate(name, cb) {
  // Load templates from the same directory
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app
const app = W.app('starter-app', getTemplate);

// Start the application
app.start(document.body);