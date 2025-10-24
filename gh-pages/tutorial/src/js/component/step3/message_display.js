W.component('step3/message_display', {
  init: function() {
    this.message = 'Waiting for event...';
    this.timestamp = '';

    // Subscribe to the event
    this.app.ev.on('button.clicked', (data, emitter) => {
      // Update local state with event data
      this.message = data.message;
      this.timestamp = data.timestamp;

      // Reload to show new message
      this.load();
    }, this);
  },

  getData: function(cb) {
    cb({
      message: this.message,
      timestamp: this.timestamp
    });
  },

  rendered: function(cb) {
    cb();
  }
});
