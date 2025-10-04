import sampleButtonTemplate from '../template/sample_button.html';

W.component('sample-button', {
  init: function() {
    this.clickCount = 0;
  },

  getData: function(cb) {
    cb({
      clickCount: this.clickCount,
      buttonText: this.clickCount === 0 ? 'Click me!' : `Clicked ${this.clickCount} times`
    });
  },

  getTemplate: function(cb) {
    cb(sampleButtonTemplate);
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('.sample-btn').on('click', () => {
      this.clickCount++;
      this.load();
    });

    cb();
  }
});