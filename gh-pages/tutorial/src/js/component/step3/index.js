W.component('step3/index', {
  getData: function(cb) {
    cb({
      title: 'Step 3: Event Communication with app.ev',
      description: 'This step demonstrates how components communicate using the event bus. Components don\'t know about each other - they only publish and subscribe to events.'
    });
  },

  rendered: function(cb) {
    cb();
  }
});
