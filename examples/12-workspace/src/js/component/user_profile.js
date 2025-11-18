import dataInterface from '../data.js';
import { getUserRoute } from '../shared/hash.js';

const prettyDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (err) {
    return iso;
  }
};

const prettyTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    return iso;
  }
};

W.component('user_profile', {
  init: function() {
    this.app.data.on('users', () => this.load(), this);
    this.app.data.on('auditLog', () => this.load(), this);
    this.app.nav.on(() => this.load(), this);
  },

  getData: function(cb) {
    const { userId } = getUserRoute();
    const user = userId ? dataInterface.getUserSync(userId) : null;
    const auditLog = this.app.data.get('auditLog') || [];

    if (!user) {
      cb({ missing: true });
      return;
    }

    const timeline = auditLog
      .filter((entry) => entry.userId === user.id)
      .map((entry) => ({
        id: entry.id,
        message: entry.message,
        date: prettyDate(entry.timestamp),
        time: prettyTime(entry.timestamp),
      }));

    cb({
      user,
      joined: prettyDate(user.joinedAt),
      timeline,
    });
  }
});
