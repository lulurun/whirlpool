W.component('settings_page', {
  getData: function(cb) {
    cb({
      title: 'Settings Page',
      settings: [
        { name: 'Dark Mode', value: false, type: 'boolean' },
        { name: 'Language', value: 'English', type: 'select', options: ['English', 'Spanish', 'French'] },
        { name: 'Notifications', value: true, type: 'boolean' },
        { name: 'Auto-save', value: true, type: 'boolean' }
      ]
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('input[type="checkbox"]').on('change', (e) => {
      const settingName = $(e.currentTarget).data('setting');
      const isChecked = e.currentTarget.checked;
      console.log(`${settingName} changed to:`, isChecked);
    });

    $container.find('select').on('change', (e) => {
      const settingName = $(e.currentTarget).data('setting');
      const value = e.currentTarget.value;
      console.log(`${settingName} changed to:`, value);
    });

    cb();
  }
});
