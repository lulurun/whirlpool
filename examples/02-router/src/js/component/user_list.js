import { getUsers } from '../users.js';

W.component('user_list', {
  getData: function(cb) {
    cb({
      title: 'Team Directory',
      intro: 'Choose a teammate to open their profile and explore nested routing states.',
      users: getUsers(),
    });
  }
});
