import { getUser, getUserId } from '../users.js';

W.component('user_info', {
  getData: function(cb) {
    this.userId = getUserId();
    const user = getUser(this.userId);

    cb({
      user: user || {}
    });
  }
});
