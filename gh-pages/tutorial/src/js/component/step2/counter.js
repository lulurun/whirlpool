W.component('step2_counter', {
  init: function() {
    // Initialize internal state
    this.count = 0;
  },

  getData: function(cb) {
    cb({
      count: this.count
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Increment button handler - MUST use arrow function to preserve 'this'
    $container.find('.increment-btn').on('click', () => {
      this.count++;
      this.load(); // Reload component to show new count
    });

    // Decrement button handler
    $container.find('.decrement-btn').on('click', () => {
      this.count--;
      this.load();
    });

    // Reset button handler
    $container.find('.reset-btn').on('click', () => {
      this.count = 0;
      this.load();
    });

    cb();
  }
});
