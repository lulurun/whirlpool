W.component('user_settings', {
  init: function() {
    // Extract user ID from hash
    const match = /^#user\/(\d+)/.exec(location.hash);
    this.userId = match ? parseInt(match[1]) : null;
  },

  getData: function(cb) {
    cb({
      userId: this.userId,
      settings: [
        { name: 'Email Notifications', value: true, type: 'boolean' },
        { name: 'Theme', value: 'Light', type: 'select', options: ['Light', 'Dark', 'Auto'] },
        { name: 'Language', value: 'English', type: 'select', options: ['English', 'Spanish', 'French', 'German'] },
        { name: 'Two-Factor Auth', value: false, type: 'boolean' },
        { name: 'Auto-save', value: true, type: 'boolean' },
        { name: 'Show Online Status', value: true, type: 'boolean' }
      ]
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('input[type="checkbox"]').on('change', (e) => {
      const settingName = $(e.currentTarget).data('setting');
      const isChecked = e.currentTarget.checked;
      console.log(`User ${this.userId} - ${settingName} changed to:`, isChecked);
    });

    $container.find('select').on('change', (e) => {
      const settingName = $(e.currentTarget).data('setting');
      const value = e.currentTarget.value;
      console.log(`User ${this.userId} - ${settingName} changed to:`, value);
    });

    $container.find('#saveBtn').on('click', () => {
      alert(`Settings saved for User ${this.userId}!`);
    });

    cb();
  }
});
