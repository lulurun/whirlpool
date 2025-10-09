import { getUsers } from '../users.js';

W.component('user_list', {
  getData: function(cb) {
    cb({
      title: 'User List',
      users: getUsers()
    });
  }
});
