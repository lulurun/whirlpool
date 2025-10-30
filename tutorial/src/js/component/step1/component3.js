W.component('step1/component3', {
  getData: function(cb) {
    cb({
      title: 'Hello from Component 3 (reusing Component 1)',
      items: [
        { name: 'Item X', value: 999 },
        { name: 'Item Y', value: 888 },
        { name: 'Item Z', value: 777 }
      ]
    });
  },

  rendered: function(cb) {
    cb();
  }
});
