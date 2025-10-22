W.component('step1_parent', {
  getData: function(cb) {
    cb({
      title: 'Step 1: Component Loading',
      description: 'This step demonstrates how components are loaded and how data is rendered with templates.'
    });
  },

  rendered: function(cb) {
    cb();
  }
});
