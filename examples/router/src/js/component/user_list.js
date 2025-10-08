// Mock user database
const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Editor' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User' }
];

W.component('user_list', {
  getData: function(cb) {
    cb({
      title: 'User List',
      users: USERS
    });
  }
});
