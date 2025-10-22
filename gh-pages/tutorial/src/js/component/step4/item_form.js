W.component('step4_item_form', {
  init: function() {
    // Subscribe to data changes to update form state
    this.app.data.on('items', (data) => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const items = this.app.data.get('items') || [];
    cb({
      itemCount: items.length
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Form submit handler
    $container.find('form').on('submit', (ev) => {
      ev.preventDefault();

      const itemName = $container.find('input[name="itemName"]').val().trim();
      if (!itemName) return;

      // Get current items
      const items = this.app.data.get('items') || [];

      // Add new item
      const newItem = {
        id: Date.now(),
        name: itemName,
        addedAt: new Date().toLocaleTimeString()
      };
      items.push(newItem);

      // Save to localStorage
      localStorage.setItem('tutorial_items', JSON.stringify(items));

      // Refresh data - this will notify all subscribers
      this.app.data.refresh('items');

      // Clear input
      $container.find('input[name="itemName"]').val('');
    });

    // Clear all button
    $container.find('.clear-all-btn').on('click', () => {
      if (confirm('Clear all items?')) {
        localStorage.setItem('tutorial_items', JSON.stringify([]));
        this.app.data.refresh('items');
      }
    });

    cb();
  }
});
