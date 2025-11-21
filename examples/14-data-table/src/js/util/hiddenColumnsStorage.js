// Utility for managing hidden columns in localStorage

import { tableConfig } from './mockData.js';

const STORAGE_KEY = `data-table-hidden-columns-${tableConfig.tableId}`;

export const hiddenColumnsStorage = {
  /**
   * Get hidden columns from localStorage
   * @returns {Array<string>} Array of hidden column keys
   */
  getHiddenColumns: function() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Add a column to hidden list
   * @param {string} columnKey - Column key to hide
   */
  addHiddenColumn: function(columnKey) {
    const hiddenColumns = this.getHiddenColumns();

    // Don't add if already hidden
    if (hiddenColumns.includes(columnKey)) {
      return hiddenColumns;
    }

    // Add to list
    hiddenColumns.push(columnKey);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenColumns));

    return hiddenColumns;
  },

  /**
   * Remove a column from hidden list
   * @param {string} columnKey - Column key to show
   */
  removeHiddenColumn: function(columnKey) {
    const hiddenColumns = this.getHiddenColumns();

    // Find and remove
    const index = hiddenColumns.indexOf(columnKey);
    if (index > -1) {
      hiddenColumns.splice(index, 1);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenColumns));
    }

    return hiddenColumns;
  },

  /**
   * Clear all hidden columns
   */
  clearHiddenColumns: function() {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};
