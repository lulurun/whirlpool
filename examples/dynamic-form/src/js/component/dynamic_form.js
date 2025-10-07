// Global form data shared across all instances
let globalFormData = {};

W.component('dynamic_form', {
  init: function() {
    // Get the data-path attribute to determine which part of formData to edit
    const dataPath = this.el.getAttribute('data-path') || '';
    this.dataPath = dataPath;
    this.isRoot = dataPath === '';

    // Get reference to the nested object this component should edit
    if (this.isRoot) {
      this.formData = globalFormData;
    } else {
      const keys = dataPath.split('.');
      let current = globalFormData;
      for (const key of keys) {
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      }
      this.formData = current;
    }
  },

  getData: function(cb) {
    cb({
      isRoot: this.isRoot,
      fields: Object.keys(this.formData).map(fieldName => {
        const value = this.formData[fieldName];
        const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

        return {
          name: fieldName,
          value: isObject ? '' : value,
          type: isObject ? 'object' : 'value',
          path: this.dataPath ? `${this.dataPath}.${fieldName}` : fieldName
        };
      }),
      formDataJson: JSON.stringify(globalFormData, null, 2)
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Update JSON display (only for root component)
    const updateJsonDisplay = () => {
      if (this.isRoot) {
        $container.find('#jsonDisplay').text(JSON.stringify(globalFormData, null, 2));
      } else {
        // Find root component and update its display
        let root = this.parent;
        while (root && root.parent) {
          root = root.parent;
        }
        if (root && root.updateJsonDisplay) {
          root.updateJsonDisplay();
        }
      }
    };
    this.updateJsonDisplay = updateJsonDisplay;

    // Handle add field button
    $container.find('#addFieldBtn').on('click', () => {
      const newFieldName = '';
      this.formData[newFieldName] = '';
      this.load();
    });

    // Handle add object button
    $container.find('#addObjectBtn').on('click', () => {
      const newFieldName = '';
      this.formData[newFieldName] = {};
      this.load();
    });

    // Handle field name changes
    $container.find('input[data-field-name]').on('input', (e) => {
      const oldFieldName = $(e.target).data('field-name');
      const newFieldName = e.target.value;

      if (oldFieldName !== newFieldName) {
        const value = this.formData[oldFieldName];
        delete this.formData[oldFieldName];
        this.formData[newFieldName] = value;
        $(e.target).data('field-name', newFieldName);
        $(e.target).closest('.row').find('input[data-field]').data('field', newFieldName);
      }
      updateJsonDisplay();
    });

    // Handle field value changes
    $container.find('input[data-field]').on('input', (e) => {
      const fieldName = $(e.target).data('field');
      this.formData[fieldName] = e.target.value;
      updateJsonDisplay();
    });

    // Handle remove field buttons
    $container.find('button[data-remove]').on('click', (e) => {
      const fieldName = $(e.currentTarget).data('remove');
      delete this.formData[fieldName];
      this.load();
    });

    // Handle form submit (only for root)
    $container.find('#dynamicForm').on('submit', (e) => {
      e.preventDefault();
      console.log('Form Data:', globalFormData);
    });

    cb();
  }
});
