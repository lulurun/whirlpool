W.component('simple-app', {
  init: function() {
    this.appName = 'Whirlpool Starter';
    this.items = [
      { id: 1, name: 'First Item', status: 'active' },
      { id: 2, name: 'Second Item', status: 'pending' },
      { id: 3, name: 'Third Item', status: 'completed' }
    ];
  },

  getData: function(cb) {
    cb({
      appName: this.appName,
      items: this.items,
      itemCount: this.items.length
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Simple click handler example
    $container.find('.item-row').on('click', (ev) => {
      const itemId = $(ev.currentTarget).data('item-id');
      console.log('Clicked item:', itemId);

      // Toggle highlight
      $container.find('.item-row').removeClass('table-active');
      $(ev.currentTarget).addClass('table-active');
    });

    cb();
  }
});