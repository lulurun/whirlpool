W.component('step4/item_list', {
  init: function() {
    // Subscribe to items data changes
    this.app.data.on('items', (data) => {
      console.log('item_list: items updated', data);
      this.load();
    }, this);
  },

  getData: function(cb) {
    const items = this.app.data.get('items') || [];
    cb({
      items: items,
      hasItems: items.length > 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Delete button handler
    $container.find('.delete-item-btn').on('click', (ev) => {
      const itemId = parseInt($(ev.currentTarget).data('item-id'));

      // Get current items
      const items = this.app.data.get('items') || [];

      // Filter out the deleted item
      const updatedItems = items.filter(item => item.id !== itemId);

      // Save to localStorage
      localStorage.setItem('tutorial_items', JSON.stringify(updatedItems));

      // Refresh data - notify all subscribers
      this.app.data.refresh('items');
    });

    cb();
  }
});
