W.component('step2/index', {
  getData: function(cb) {
    cb({
      title: 'Step 2: Counter',
      description: 'This step demonstrates how to define internal component state and handle user interactions.'
    });
  },

  rendered: function(cb) {
    cb();
  }
});
