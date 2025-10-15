import { getUser, getUserId, getUserSection } from '../users.js';

W.component('user_page', {
  init: function() {
    this.userId = getUserId();
    this.section = getUserSection();
    this.app.nav.on(() => {
      const userId = getUserId();
      const nextSection = getUserSection();
      if (!userId && !this.userId) return;
      if (userId !== this.userId || nextSection !== this.section) {
        this.userId = userId;
        this.section = nextSection;
        this.load();
      }
    }, this);
  },

  getData: function(cb) {
    const userId = this.userId;
    if (!userId) {
      cb({ error: true, userId: null });
      return;
    }

    const user = getUser(userId);
    if (!user) {
      cb({ error: true, userId });
      return;
    }

    cb({
      user,
      userId,
      activeSection: this.section || 'info',
    });
  },

  rendered: function(cb) {
    if (!this.el.querySelector('[data-route]')) {
      if (cb) cb();
      return;
    }

    const active = this.section || 'info';
    const navLinks = this.el.querySelectorAll('[data-route]');
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('data-route') === active;
      link.classList.toggle('active', isActive);
    });

    if (cb) cb();
  }
});
