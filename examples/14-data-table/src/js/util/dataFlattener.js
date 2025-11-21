// Utility for flattening nested JSON objects

export const dataFlattener = {
  /**
   * Flatten a nested object into a single-level object with dot notation keys
   * Example: {a: {b: 1}} => {"a.b": 1}
   */
  flattenObject: function(obj, prefix = '') {
    const flattened = {};

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = value;
      } else if (Array.isArray(value)) {
        // Convert arrays to JSON string for display
        flattened[newKey] = JSON.stringify(value);
      } else if (typeof value === 'object' && value.constructor === Object) {
        // Recursively flatten nested objects
        const nested = this.flattenObject(value, newKey);
        Object.assign(flattened, nested);
      } else {
        // Primitive values
        flattened[newKey] = value;
      }
    }

    return flattened;
  },

  /**
   * Flatten an array of objects
   */
  flattenArray: function(arr) {
    return arr.map(obj => this.flattenObject(obj));
  },

  /**
   * Get all unique columns from an array of flattened objects
   */
  getColumns: function(flattenedArray) {
    const columnsSet = new Set();

    flattenedArray.forEach(obj => {
      Object.keys(obj).forEach(key => columnsSet.add(key));
    });

    return Array.from(columnsSet);
  },

  /**
   * Sort columns: ID column first, then alphabetically
   */
  sortColumns: function(columns, idColumn) {
    return columns.sort((a, b) => {
      if (a === idColumn) return -1;
      if (b === idColumn) return 1;
      return a.localeCompare(b);
    });
  },

  /**
   * Format column name for display
   * Example: "contact.email" => "contact email"
   */
  formatColumnName: function(columnKey) {
    return columnKey.replace(/\./g, ' ');
  }
};
