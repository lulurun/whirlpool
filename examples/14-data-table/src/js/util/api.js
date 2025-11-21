// API module - simulates fetching table data

import { mockTableData } from './mockData.js';

export const api = {
  /**
   * Fetch table data with simulated network delay
   * @param {Function} callback - Called with table data
   */
  fetchTableData: function(callback) {
    const delay = Math.floor(Math.random() * 300) + 200; // 200-500ms

    setTimeout(() => {
      // In production, replace with actual API call:
      // fetch('/api/table-data')
      //   .then(response => response.json())
      //   .then(data => callback(data));

      callback(mockTableData);
    }, delay);
  }
};
