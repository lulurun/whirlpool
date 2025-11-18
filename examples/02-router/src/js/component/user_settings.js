import { getUserId, getUserSettings } from '../users.js';

W.component('user_settings', {
  getData: function(cb) {
    this.userId = getUserId();
    cb({
      userId: this.userId,
      settings: getUserSettings(),
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('input[type="checkbox"]').on('change', (e) => {
      const settingName = $(e.currentTarget).data('setting');
      const isChecked = e.currentTarget.checked;
      console.log(`User ${this.userId} - ${settingName}:`, isChecked);
    });

    $container.find('select').on('change', (e) => {
      const settingName = $(e.currentTarget).data('setting');
      const value = e.currentTarget.value;
      console.log(`User ${this.userId} - ${settingName}:`, value);
    });

    $container.find('#saveBtn').on('click', () => {
      alert(`Settings saved for User ${this.userId}!`);
    });

    cb();
  }
});
