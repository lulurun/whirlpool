W.component('step1_component2', {
  getData: function(cb) {
    cb({
      message: 'This is Component 2',
      timestamp: new Date().toLocaleString()
    });
  },

  rendered: function(cb) {
    cb();
  }
});
