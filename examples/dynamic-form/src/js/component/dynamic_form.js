W.component('dynamic_form', {
  init: function() {
    this.formData = {};
    this.fieldCounter = 0;
  },

  getData: function(cb) {
    cb({
      fields: Object.keys(this.formData).map(fieldName => ({
        name: fieldName,
        value: this.formData[fieldName]
      })),
      formDataJson: JSON.stringify(this.formData, null, 2)
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Update JSON display
    const updateJsonDisplay = () => {
      $container.find('#jsonDisplay').text(JSON.stringify(this.formData, null, 2));
    };

    // Handle add field button
    $container.find('#addFieldBtn').on('click', () => {
      const newFieldName = '';
      this.formData[newFieldName] = '';
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

    // Handle form submit
    $container.find('#dynamicForm').on('submit', (e) => {
      e.preventDefault();
      console.log('Form Data:', this.formData);
    });

    cb();
  }
});
