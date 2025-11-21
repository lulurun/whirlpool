// Import components
import './component/data_table.js';
import './component/hidden_columns.js';

// Import utilities
import { api } from './util/api.js';
import { hiddenColumnsStorage } from './util/hiddenColumnsStorage.js';

function getTemplate(name, cb) {
  // Load templates from the template directory
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app
const app = W.app('data-table-app', getTemplate);

// Register data sources
app.data.register('tableData', (cb) => {
  api.fetchTableData(cb);
});

app.data.register('hiddenColumns', (cb) => {
  // Fetch from localStorage (synchronous but wrapped in callback)
  const hiddenColumns = hiddenColumnsStorage.getHiddenColumns();
  cb(hiddenColumns);
});

// Start the application
app.start(document.body);
