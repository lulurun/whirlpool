import { formData as globalFormData, FORM_DATA_EVENT } from '../shared/formState.js';

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const buildPath = (currentPath, fieldName) => {
  if (!currentPath) {
    return `/${fieldName}`;
  }
  return `${currentPath}/${fieldName}`;
};

const resolveScopedData = (path) => {
  const segments = path.split('/').filter(Boolean);
  let current = globalFormData;
  segments.forEach((segment) => {
    if (current && typeof current === 'object') {
      current = current[segment];
    }
  });
  return current || {};
};

W.component('dynamic_form', {
  init: function() {
    this.dataPath = this.el.getAttribute('data-path') || '';
    this.isRoot = this.dataPath === '';
    this.formData = this.isRoot ? globalFormData : resolveScopedData(this.dataPath);
  },

  getData: function(cb) {
    const fields = Object.keys(this.formData).map((fieldName) => {
      const value = this.formData[fieldName];
      const isObject = isPlainObject(value);

      return {
        name: fieldName,
        value: isObject ? '' : value,
        type: isObject ? 'object' : 'value',
        path: buildPath(this.dataPath, fieldName),
      };
    });

    cb({
      isRoot: this.isRoot,
      fields,
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    const emitChange = () => {
      this.app.ev.emit(FORM_DATA_EVENT);
    };

    $container.find('[data-role="add-field"]').on('click', (event) => {
      const $row = $(event.currentTarget).closest('[data-role="add-field-row"]');
      const nameInput = $row.find('[data-role="new-field-name"]');
      const typeSelect = $row.find('[data-role="new-field-type"]');
      const fieldName = (nameInput.val() || '').trim();
      const selectedType = typeSelect.val();

      if (!fieldName || fieldName in this.formData) {
        return;
      }

      this.formData[fieldName] = selectedType === 'object' ? {} : '';

      nameInput.val('');
      typeSelect.val('value');

      emitChange();
      this.load();
    });

    $container.find('input[data-field]').on('input', (event) => {
      const fieldName = $(event.currentTarget).data('field');
      this.formData[fieldName] = event.currentTarget.value;
      emitChange();
    });

    $container.find('[data-role="remove-field"]').on('click', (event) => {
      const fieldName = $(event.currentTarget).data('remove');
      delete this.formData[fieldName];
      emitChange();
      this.load();
    });

    if (this.isRoot) {
      $container.find('[data-role="dynamic-form-root"]').on('submit', (event) => {
        event.preventDefault();
        console.log('Form Data:', globalFormData);
        emitChange();
      });

      emitChange();
    }

    cb();
  }
});
