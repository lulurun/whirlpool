import { dataFlattener } from '../util/dataFlattener.js';
import { hiddenColumnsStorage } from '../util/hiddenColumnsStorage.js';

// Helper function to show a column
function showColumn(component, columnKey) {
  // Update localStorage and trigger fetch
  hiddenColumnsStorage.removeHiddenColumn(columnKey);

  // Fetch updated hidden columns via app.data
  component.app.data.fetch(['hiddenColumns']);
}

W.component('hidden_columns', {
  init: function() {
    // Initialize with data from localStorage directly
    // this.hiddenColumns = hiddenColumnsStorage.getHiddenColumns();

    // Subscribe to hidden columns changes
    this.app.data.on('hiddenColumns', (hiddenColumns) => {
      this.hiddenColumns = hiddenColumns;
      hiddenColumns.push('4444444');
      this.load();
    }, this);

    // Fetch initial data
    this.app.data.fetch(['hiddenColumns']);
  },

  getData: function(cb) {
    const hiddenColumns = this.app.data.get('hiddenColumns') || [];
    hiddenColumns.push('77777');
    const columns = hiddenColumns.map(col => ({
      key: col,
      name: dataFlattener.formatColumnName(col)
    }));

    cb({
      columns,
      hasHiddenColumns: true,//columns.length > 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Handle show button clicks
    $container.find('.show-btn').on('click', (e) => {
      const columnKey = $(e.currentTarget).data('column');
      showColumn(this, columnKey);
    });

    cb();
  }
});
