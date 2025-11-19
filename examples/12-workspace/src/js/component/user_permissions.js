import dataInterface from '../data.js';
import { getUserRoute } from '../shared/hash.js';

const FEATURE_CATALOG = [
  { key: 'analytics', label: 'Analytics', description: 'Access dashboards and export insights.' },
  { key: 'billing', label: 'Billing', description: 'Manage invoices, subscriptions, and payment methods.' },
  { key: 'automation', label: 'Automation', description: 'Configure workflow automations across teams.' },
  { key: 'experiments', label: 'Experiments', description: 'Create and monitor product experiments.' },
];

W.component('user_permissions', {
  init: function() {
    this.app.data.on('permissions', () => this.load(), this);
    this.app.data.on('users', () => this.load(), this);
    this.app.nav.on(() => this.load(), this);
  },

  getData: function(cb) {
    const { userId } = getUserRoute();
    const user = userId ? dataInterface.getUserSync(userId) : null;
    const permissions = this.app.data.get('permissions') || {};

    if (!user) {
      cb({ missing: true });
      return;
    }

    const current = permissions[user.id] || {};

    const features = FEATURE_CATALOG.map((feature) => ({
      ...feature,
      enabled: Boolean(current[feature.key]),
      inputId: `${feature.key}-${user.id}`,
    }));

    cb({
      user,
      features,
    });
  },

  rendered: function(cb) {
    const { userId } = getUserRoute();
    if (!userId) {
      if (cb) cb();
      return;
    }

    const $container = $(this.el);

    $container.find('[data-permission-toggle]').on('change', (ev) => {
      const featureKey = $(ev.currentTarget).data('permission-toggle');
      const enabled = ev.currentTarget.checked;
      dataInterface.togglePermission(userId, featureKey, enabled, () => {
        this.app.data.fetch(['permissions', 'auditLog']);
      });
    });

    $container.find('#savePermissions').on('click', () => {
      alert('Permissions saved successfully.');
    });

    if (cb) cb();
  }
});
