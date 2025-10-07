// Global form data shared across all instances
const globalFormData = {};

W.component('dynamic_form', {
  init: function() {
    // Get the data-path attribute to determine which part of formData to edit
    this.dataPath = this.el.getAttribute('data-path') || '';
    this.isRoot = this.dataPath === '';

    // Get reference to the nested object this component should edit
    if (this.isRoot) {
      this.formData = globalFormData;
    } else {
      const keys = this.dataPath.split('/');
      keys.shift();
      let current = globalFormData;
      for (const key of keys) {
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
          path: `${this.dataPath}/${fieldName}`,
        };
      }),
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Update JSON display (only for root component)
    const updateJsonDisplay = () => {
      this.publish('data.formData.updated', globalFormData);
    };
    this.updateJsonDisplay = updateJsonDisplay;

    // Handle add field button
    $container.find('#addFieldBtn').on('click', (e) => {
      const $row = $(e.target).closest('.row')
      const name = $row.find('input').val();
      const type = $row.find('select').val();
      if (!name || name in this.formData) {
        return;
      }
      var value = '';
      if (type === 'object') value = {};
      this.formData[name] = value;
      updateJsonDisplay();
      this.load();
      console.log(globalFormData);
    });

    // Handle field value changes
    $container.find('input[data-field]').on('input', (e) => {
      const fieldName = $(e.target).data('field');
      this.formData[fieldName] = e.target.value;
      updateJsonDisplay();
      console.log(globalFormData);
    });

    // Handle remove field buttons
    $container.find('button[data-remove]').on('click', (e) => {
      const fieldName = $(e.currentTarget).data('remove');
      delete this.formData[fieldName];
      updateJsonDisplay();
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
