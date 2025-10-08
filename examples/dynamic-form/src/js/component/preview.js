W.component('preview', {
  init: function() {
    this.data = null;
    this.app.data.on('formData', (data) => {
      this.data = data;
      this.load();
    })
  },
  getData: function(cb) {
    cb(JSON.stringify(this.data, null, 2));
  }
});