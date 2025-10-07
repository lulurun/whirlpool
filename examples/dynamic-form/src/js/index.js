// Import Whirlpool components
import './component/dynamic_form.js';
import './component/preview.js';

function getTemplate(name, cb) {
  // Load templates from the same directory
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app
const app = W.app('dynamic-form-app', getTemplate);

// Start the application
app.start(document.body);
