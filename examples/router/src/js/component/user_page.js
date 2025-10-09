import { getUser, getUserId } from '../users.js';

W.component('user_page', {
  init: function() {
    this.userId = getUserId();
    this.app.nav.on(() => {
      const userId = getUserId();
      if (!userId || userId === this.userId) return;
      this.load();
    }, this);
  },

  getData: function(cb) {
    const user = getUser(this.userId);

    if (!user) {
      cb({ error: true, userId: this.userId });
      return;
    }

    cb({
      user: user,
      userId: this.userId
    });
  }
});
