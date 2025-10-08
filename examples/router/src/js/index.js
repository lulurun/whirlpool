// Import switches
import './switch/main_switch.js';
import './switch/user_switch.js';

// Import page components
import './component/home_page.js';
import './component/about_page.js';
import './component/user_list.js';
import './component/user_page.js';
import './component/user_info.js';
import './component/user_settings.js';

function getTemplate(name, cb) {
  // Load templates from the same directory
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app
const app = W.app('router-app', getTemplate);

// Start the application
app.start(document.body);