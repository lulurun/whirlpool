import { getUserRoute } from '../shared/hash.js';

const statusMap = {
  active: { label: 'Active', theme: 'success' },
  invited: { label: 'Invited', theme: 'warning' },
  suspended: { label: 'Suspended', theme: 'danger' },
};

W.component('user_list', {
  init: function() {
    this.app.data.on('users', () => this.load(), this);
    this.app.nav.on(() => this.load(), this);
  },

  getData: function(cb) {
    const users = this.app.data.get('users') || [];
    const { userId } = getUserRoute();

    const items = users.map((user) => {
      const status = statusMap[user.status] || { label: user.status, theme: 'secondary' };
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        statusLabel: status.label,
        statusTheme: status.theme,
        region: user.region,
        active: userId === user.id,
        profileHash: `#users/${user.id}/profile`,
      };
    });

    cb({ users: items });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('[data-user-link]').on('click', (ev) => {
      const hash = $(ev.currentTarget).data('user-link');
      window.location.hash = hash;
    });

    cb();
  }
});
