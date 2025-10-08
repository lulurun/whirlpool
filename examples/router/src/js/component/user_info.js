// Mock user database
const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', phone: '+1-555-0101', department: 'Engineering', joinDate: '2020-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', phone: '+1-555-0102', department: 'Marketing', joinDate: '2021-03-20' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Editor', phone: '+1-555-0103', department: 'Content', joinDate: '2019-11-08' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', phone: '+1-555-0104', department: 'Sales', joinDate: '2022-06-12' }
];

W.component('user_info', {
  init: function() {
    // Extract user ID from hash
    const match = /^#user\/(\d+)/.exec(location.hash);
    this.userId = match ? parseInt(match[1]) : null;
  },

  getData: function(cb) {
    const user = USERS.find(u => u.id === this.userId);

    cb({
      user: user || {}
    });
  }
});
