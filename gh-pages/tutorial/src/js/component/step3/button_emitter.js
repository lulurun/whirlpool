W.component('step3_button_emitter', {
  init: function() {
    this.clickCount = 0;
  },

  getData: function(cb) {
    cb({
      clickCount: this.clickCount
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Button click handler - emits event to other components
    $container.find('.emit-btn').on('click', () => {
      this.clickCount++;

      // Emit event with data
      this.app.ev.emit('button.clicked', {
        message: 'Hello from button!',
        timestamp: new Date().toLocaleTimeString(),
        clickNumber: this.clickCount
      }, this);

      // Update this component too
      this.load();
    });

    cb();
  }
});
