import dataInterface from '../data.js';

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value;
};

const convertValue = (raw, original, declaredType) => {
  if (Array.isArray(original) || declaredType === 'array') {
    return raw
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length);
  }
  if (typeof original === 'number' || declaredType === 'number') {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof original === 'boolean' || declaredType === 'boolean') {
    return raw === 'true';
  }
  return raw;
};

const resolvePath = (root, path) => {
  if (!path) return root;
  const segments = path.split('/').filter(Boolean);
  return segments.reduce((acc, segment) => {
    if (acc && typeof acc === 'object') {
      return acc[segment];
    }
    return undefined;
  }, root);
};

const ensureChild = (root, path, key, asObject) => {
  const target = resolvePath(root, path);
  if (!target || typeof target !== 'object') return;
  if (asObject) {
    target[key] = {};
  } else {
    target[key] = '';
  }
};

const deleteField = (root, path, key) => {
  const target = resolvePath(root, path);
  if (!target || typeof target !== 'object') return;
  delete target[key];
};

const saveSettings = (component, rootSettings) => {
  dataInterface.updateWorkspaceSettings(rootSettings, (result) => {
    component.app.data.emit('workspaceSettings', result.settings, component);
    component.app.data.emit('auditLog', result.auditLog, component);
  });
};

W.component('settings_form', {
  init: function() {
    this.dataPath = this.el.getAttribute('data-path') || '';
    this.isRoot = this.el.hasAttribute('data-root') || this.dataPath === '';
    if (this.isRoot) {
      this.rootSettings = this.app.data.get('workspaceSettings');
    } else if (this.parent && this.parent.rootSettings) {
      this.rootSettings = this.parent.rootSettings;
    }
    this.app.data.on('workspaceSettings', () => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const root = this.rootSettings || this.app.data.get('workspaceSettings') || {};
    const scope = resolvePath(root, this.dataPath);
    if (!scope || typeof scope !== 'object') {
      cb({ fields: [], isRoot: this.isRoot });
      return;
    }

    const fields = Object.keys(scope).map((name) => {
      const value = scope[name];
      const valueType = Array.isArray(value)
        ? 'array'
        : isPlainObject(value)
          ? 'object'
          : typeof value;
      return {
        name,
        value: isPlainObject(value) ? '' : formatValue(value),
        type: isPlainObject(value) ? 'object' : 'value',
        valueType,
        path: this.dataPath ? `${this.dataPath}/${name}` : `/${name}`,
      };
    });

    cb({
      fields,
      isRoot: this.isRoot,
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);
    const rootSettings = this.rootSettings || this.app.data.get('workspaceSettings');
    const currentScope = resolvePath(rootSettings, this.dataPath);

    $container.find('[data-role="add-field"]').on('click', (ev) => {
      const $row = $(ev.currentTarget).closest('[data-role="add-field-row"]');
      const name = ($row.find('[data-role="new-field-name"]').val() || '').trim();
      const type = $row.find('[data-role="new-field-type"]').val();
      if (!name || (currentScope && Object.prototype.hasOwnProperty.call(currentScope, name))) {
        return;
      }

      ensureChild(rootSettings, this.dataPath, name, type === 'object');
      saveSettings(this, rootSettings);
      $row.find('[data-role="new-field-name"]').val('');
      $row.find('[data-role="new-field-type"]').val('value');
      this.load();
    });

    $container.find('[data-field]').on('change', (ev) => {
      const fieldName = $(ev.currentTarget).data('field');
      const valueType = $(ev.currentTarget).data('value-type');
      const original = currentScope ? currentScope[fieldName] : undefined;
      const nextValue = convertValue(ev.currentTarget.value, original, valueType);
      if (currentScope) {
        currentScope[fieldName] = nextValue;
        saveSettings(this, rootSettings);
      }
    });

    $container.find('[data-role="remove-field"]').on('click', (ev) => {
      const fieldName = $(ev.currentTarget).data('remove');
      deleteField(rootSettings, this.dataPath, fieldName);
      saveSettings(this, rootSettings);
      this.load();
    });

    if (cb) cb();
  }
});
