W.component('step3_event_counter', {
  init: function() {
    this.eventCount = 0;
    this.lastClickNumber = 0;

    // Subscribe to the same event
    this.app.ev.on('button.clicked', (data, emitter) => {
      // Increment our counter
      this.eventCount++;
      this.lastClickNumber = data.clickNumber;

      // Reload to show new count
      this.load();
    }, this);
  },

  getData: function(cb) {
    cb({
      eventCount: this.eventCount,
      lastClickNumber: this.lastClickNumber
    });
  },

  rendered: function(cb) {
    cb();
  }
});
