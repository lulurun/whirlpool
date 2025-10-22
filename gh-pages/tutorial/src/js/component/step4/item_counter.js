W.component('step4_item_counter', {
  init: function() {
    // Subscribe to items data changes
    this.app.data.on('items', (data) => {
      console.log('item_counter: items updated', data);
      this.load();
    }, this);
  },

  getData: function(cb) {
    const items = this.app.data.get('items') || [];
    cb({
      totalItems: items.length,
      lastUpdated: new Date().toLocaleTimeString()
    });
  },

  rendered: function(cb) {
    cb();
  }
});
