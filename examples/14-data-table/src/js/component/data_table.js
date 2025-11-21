import { dataFlattener } from '../util/dataFlattener.js';
import { tableConfig } from '../util/mockData.js';
import { hiddenColumnsStorage } from '../util/hiddenColumnsStorage.js';

// Helper function to hide a column
function hideColumn(component, columnKey) {
  if (columnKey === component.idColumn) return; // Cannot hide ID column

  // Update localStorage and trigger fetch
  hiddenColumnsStorage.addHiddenColumn(columnKey);

  // Fetch updated hidden columns via app.data
  component.app.data.fetch(['hiddenColumns']);
}

// Helper function to sort data
function sortData(component, columnKey) {
  if (columnKey === component.sortColumn) {
    // Toggle sort direction
    component.sortDirection = component.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to ascending
    component.sortColumn = columnKey;
    component.sortDirection = 'asc';
  }

  // Sort the data
  component.sortedData = [...component.flattenedData].sort((a, b) => {
    const aVal = a[columnKey];
    const bVal = b[columnKey];

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Type-aware comparison
    let comparison = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return component.sortDirection === 'asc' ? comparison : -comparison;
  });

  component.load();
}

// Helper function to select a cell
function selectCell(component, rowIndex, columnKey) {
  component.selectedCell = { rowIndex, columnKey };
  component.load();
}

W.component('data_table', {
  init: function() {
    // Configuration
    this.tableId = tableConfig.tableId;
    this.idColumn = tableConfig.idColumn;

    // State
    this.flattenedData = [];
    this.allColumns = [];
    this.sortedColumns = [];
    this.hiddenColumns = [];
    this.sortColumn = this.idColumn;
    this.sortDirection = 'asc';
    this.selectedCell = null;
    this.sortedData = [];

    // Subscribe to table data changes
    this.app.data.on('tableData', (data) => {
      // Flatten the data
      this.flattenedData = dataFlattener.flattenArray(data);
      this.allColumns = dataFlattener.getColumns(this.flattenedData);
      this.sortedColumns = dataFlattener.sortColumns([...this.allColumns], this.idColumn);

      // Sort data
      this.sortedData = [...this.flattenedData].sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return this.sortDirection === 'asc' ? comparison : -comparison;
      });

      this.load();
    }, this);

    // Subscribe to hidden columns changes
    this.app.data.on('hiddenColumns', (hiddenColumns) => {
      this.hiddenColumns = hiddenColumns;
      this.load();
    }, this);

    // Fetch initial data
    this.app.data.fetch(['tableData', 'hiddenColumns']);
  },

  getData: function(cb) {
    // Get visible columns
    const visibleColumns = this.sortedColumns.filter(col =>
      !this.hiddenColumns.includes(col)
    );

    // Prepare column headers
    const headers = visibleColumns.map(col => ({
      key: col,
      name: dataFlattener.formatColumnName(col),
      isId: col === this.idColumn,
      isSorted: col === this.sortColumn,
      sortDirection: col === this.sortColumn ? this.sortDirection : null
    }));

    // Prepare table rows
    const rows = this.sortedData.map((row, rowIndex) => {
      const cells = visibleColumns.map(col => ({
        key: col,
        value: row[col] != null ? row[col] : '',
        isSelected: this.selectedCell &&
                   this.selectedCell.rowIndex === rowIndex &&
                   this.selectedCell.columnKey === col,
        isRowHighlight: this.selectedCell && this.selectedCell.rowIndex === rowIndex,
        isColumnHighlight: this.selectedCell && this.selectedCell.columnKey === col
      }));

      return {
        rowIndex,
        cells
      };
    });

    cb({
      headers,
      rows,
      hasData: rows.length > 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Handle column header clicks for sorting (all columns including ID)
    $container.find('th[data-column]').on('click', (e) => {
      const columnKey = $(e.currentTarget).data('column');
      sortData(this, columnKey);
    });

    // Handle hide button clicks
    $container.find('.hide-btn').on('click', (e) => {
      e.stopPropagation(); // Prevent sort trigger
      const columnKey = $(e.currentTarget).data('column');
      hideColumn(this, columnKey);
    });

    // Handle cell clicks
    $container.find('td[data-row][data-column]').on('click', (e) => {
      const rowIndex = parseInt($(e.currentTarget).data('row'));
      const columnKey = $(e.currentTarget).data('column');
      selectCell(this, rowIndex, columnKey);
    });

    cb();
  }
});
