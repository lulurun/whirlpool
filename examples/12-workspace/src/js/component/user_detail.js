import dataInterface from '../data.js';
import { getUserRoute } from '../shared/hash.js';

W.component('user_detail', {
  init: function() {
    this.app.data.on('users', () => this.load(), this);
    this.app.data.on('auditLog', () => this.load(), this);
    this.app.nav.on(() => this.load(), this);
  },

  getData: function(cb) {
    const { userId, section } = getUserRoute();
    if (!userId) {
      cb({ hasSelection: false });
      return;
    }

    const user = dataInterface.getUserSync(userId);
    if (!user) {
      cb({ hasSelection: false, missing: true, missingId: userId });
      return;
    }

    cb({
      hasSelection: true,
      user,
      activeSection: section || 'profile',
      profileHash: `#users/${user.id}/profile`,
      permissionsHash: `#users/${user.id}/permissions`,
    });
  },

  rendered: function(cb) {
    const { section } = getUserRoute();
    const active = section || 'profile';
    const navLinks = this.el.querySelectorAll('[data-route]');
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('data-route') === active;
      link.classList.toggle('active', isActive);
    });
    if (cb) cb();
  }
});
