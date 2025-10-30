// Import navigation component
import './component/tutorial_nav.js';

// Import Step 1 components
import './component/step1/index.js';
import './component/step1/component1.js';
import './component/step1/component2.js';
import './component/step1/component3.js';

// Import Step 2 components
import './component/step2/index.js';
import './component/step2/counter.js';

// Import Step 3 components
import './component/step3/index.js';
import './component/step3/button_emitter.js';
import './component/step3/message_display.js';
import './component/step3/event_counter.js';

// Import Step 4 components
import './component/step4/index.js';
import './component/step4/item_form.js';
import './component/step4/item_list.js';
import './component/step4/item_counter.js';

// Template loader
function getTemplate(name, cb) {
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create app
const app = W.app('whirlpool-tutorial', getTemplate);

// Register the switch for tutorial steps
W.switch('tutorial_switch', {
  knownComponents: {
    'step1': 'step1/index',
    'step2': 'step2/index',
    'step3': 'step3/index',
    'step4': 'step4/index'
  }
});

// Register shared data for Step 4
app.data.register('items', (cb) => {
  // Fetch items from localStorage or return empty array
  const items = JSON.parse(localStorage.getItem('tutorial_items') || '[]');
  cb(items);
});

// Start the application
app.start(document.body);
