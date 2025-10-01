// Data table component with sorting, filtering, and selection
import dataTableTemplate from '../../templates/data_table.hbs';

// Sample data generator
function generateSampleData() {
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eve Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const data = [];

  for (let i = 1; i <= 50; i++) {
    data.push({
      id: i,
      name: names[Math.floor(Math.random() * names.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 80000) + 40000,
      experience: Math.floor(Math.random() * 15) + 1,
      status: Math.random() > 0.3 ? 'Active' : 'Inactive'
    });
  }

  return data;
}

// Data accessor class for external data handling
class DataTableAccessor {
  constructor() {
    this.rawData = null;
    this.processedData = null;
  }

  fetchData(callback) {
    // Simulate API call with timeout
    setTimeout(() => {
      this.rawData = generateSampleData();
      this.processedData = this.processData(this.rawData);
      if (callback) callback();
    }, 500);
  }

  processData(data) {
    if (!data || !Array.isArray(data)) {
      return {
        items: [],
        columns: []
      };
    }

    // Get all unique columns
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return {
      items: data,
      columns: columns
    };
  }

  getData() {
    return this.processedData || {
      items: [],
      columns: []
    };
  }
}

// Utility function for sorting data
function sortData(data, column, direction) {
  return data.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];

    // Handle null/undefined values
    if (aVal == null) aVal = '';
    if (bVal == null) bVal = '';

    // Try to parse as numbers
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    let comparison = 0;
    if (!isNaN(aNum) && !isNaN(bNum)) {
      // Both are numbers
      comparison = aNum - bNum;
    } else {
      // String comparison
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

W.component('data-table', {
  init: function() {
    this.data_accessor = new DataTableAccessor();
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.searchTerm = '';
    this.selectedItems = [];

    // Subscribe to search events
    this.subscribe('search.changed', (data) => {
      this.searchTerm = data.term;
      this.load();
    });

    // Fetch initial data
    this.data_accessor.fetchData(() => {
      this.load();
    });
  },

  getData: function(cb) {
    const processedData = this.data_accessor.getData();

    if (!processedData.items || processedData.items.length === 0) {
      cb({
        items: [],
        columns: [],
        hasItems: false,
        loading: !processedData.items,
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection
      });
      return;
    }

    // Apply sorting
    let sortedItems = [...processedData.items];
    if (this.sortColumn) {
      sortedItems = sortData(sortedItems, this.sortColumn, this.sortDirection);
    }

    // Apply search filtering
    let filteredItems = sortedItems;
    if (this.searchTerm && this.searchTerm.length >= 2) {
      filteredItems = sortedItems.filter(item => {
        return Object.values(item).some(val =>
          String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    }

    cb({
      items: filteredItems,
      columns: processedData.columns,
      hasItems: filteredItems.length > 0,
      loading: false,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      searchTerm: this.searchTerm,
      totalItems: processedData.items.length,
      filteredItems: filteredItems.length,
      isFiltered: this.searchTerm && this.searchTerm.length >= 2
    });
  },

  getTemplate: function(cb) {
    cb(dataTableTemplate);
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Sort handlers
    $container.find('.sortable-header').on('click', (ev) => {
      const column = $(ev.currentTarget).data('column');

      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }

      this.load();
    });

    // Selection handlers
    $container.find('.select-all').on('change', (ev) => {
      const isChecked = $(ev.currentTarget).is(':checked');
      $container.find('.row-select').prop('checked', isChecked);
      this.updateSelection();
    });

    $container.find('.row-select').on('change', () => {
      this.updateSelection();
    });

    // Row highlighting on cell click
    $container.find('tbody td').on('click', (ev) => {
      const $clickedCell = $(ev.currentTarget);
      const cellIndex = $clickedCell.index();
      const $table = $clickedCell.closest('table');
      const $clickedRow = $clickedCell.closest('tr');

      // Skip checkbox column
      if (cellIndex === 0) return;

      // Remove previous highlights
      $table.find('tr').removeClass('highlighted-row');
      $table.find('td, th').removeClass('highlighted-column');

      // Highlight clicked row and column
      $clickedRow.addClass('highlighted-row');
      $table.find('tr').each(function() {
        $(this).find('td, th').eq(cellIndex).addClass('highlighted-column');
      });
    });

    cb();
  },

  updateSelection: function() {
    const $container = $(this.el);
    const selectedIds = [];

    $container.find('.row-select:checked').each(function() {
      selectedIds.push($(this).data('id'));
    });

    this.selectedItems = selectedIds;

    // Publish selection change
    this.publish('selection.changed', {
      items: selectedIds,
      count: selectedIds.length
    });

    // Update select-all checkbox state
    const $selectAll = $container.find('.select-all');
    const $rowSelects = $container.find('.row-select');
    const totalRows = $rowSelects.length;
    const checkedRows = $rowSelects.filter(':checked').length;

    if (checkedRows === 0) {
      $selectAll.prop('indeterminate', false).prop('checked', false);
    } else if (checkedRows === totalRows) {
      $selectAll.prop('indeterminate', false).prop('checked', true);
    } else {
      $selectAll.prop('indeterminate', true).prop('checked', false);
    }
  }
});