const statusCssMap = {
  'active': 'success',
  'pending': 'warning',
  'completed': 'secondary'
};

W.component('simple_app', {
  getData: function(cb) {
    $.ajax({
      url: 'sample_data.json',
      dataType: 'json',
      success: (data) => {
        const items = data.items.map(item => ({
          ...item,
          badgeClass: statusCssMap[item.status] || 'secondary'
        }));

        cb({
          appName: data.appName,
          items: items,
          itemCount: items.length
        });
      },
      error: (xhr, status, error) => {
        console.error('Failed to load data:', error);
        cb({ appName: '', items: [], itemCount: 0 });
      }
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
