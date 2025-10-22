W.component('step1_component1', {
  getData: function(cb) {
    cb({
      title: 'Hello from Component 1',
      items: [
        { name: 'Item A', value: 100 },
        { name: 'Item B', value: 200 },
        { name: 'Item C', value: 300 }
      ]
    });
  },

  rendered: function(cb) {
    cb();
  }
});
