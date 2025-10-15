import { getUser, getUserId } from '../users.js';

W.component('user_info', {
  getData: function(cb) {
    const userId = getUserId();
    const user = getUser(userId) || {};

    cb({
      user,
      helper: {
        title: 'Account Details',
        body: 'This tab surfaces the core profile fields. Jump to Settings for console-logged preference updates.',
      },
    });
  }
});
