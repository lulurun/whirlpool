W.component('settings_preview', {
  init: function() {
    this.settings = this.app.data.get('workspaceSettings') || {};
    this.app.data.on('workspaceSettings', (value) => {
      this.settings = value;
      if (this.complete) {
        this.load();
      }
    }, this);
  },

  getData: function(cb) {
    cb({ json: JSON.stringify(this.settings, null, 2) });
  }
});
