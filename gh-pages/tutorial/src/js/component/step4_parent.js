W.component('step4_parent', {
  getData: function(cb) {
    cb({
      title: 'Step 4: Shared Data with app.data',
      description: 'This step demonstrates centralized data management using app.data. Multiple components share the same data source and automatically update when the data changes.'
    });
  },

  rendered: function(cb) {
    cb();
  }
});
