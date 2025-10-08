// Mock user database
const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Editor' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User' }
];

W.component('user_page', {
  init: function() {
    // Extract user ID from hash: #user/123/info -> 123
    const match = /^#user\/(\d+)/.exec(location.hash);
    this.userId = match ? parseInt(match[1]) : null;
  },

  getData: function(cb) {
    const user = USERS.find(u => u.id === this.userId);

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
