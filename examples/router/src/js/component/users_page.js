W.component('users_page', {
  getData: function(cb) {
    cb({
      title: 'Users Page',
      users: [
        { id: 1, name: 'Alice Johnson', role: 'Admin' },
        { id: 2, name: 'Bob Smith', role: 'User' },
        { id: 3, name: 'Carol Williams', role: 'Editor' },
        { id: 4, name: 'David Brown', role: 'User' }
      ]
    });
  }
});
