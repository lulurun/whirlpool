W.component('preview', {
  init: function() {
    this.data = null;
    this.subscribe('data.formData.updated', (data) => {
      this.data = data;
      this.load();
    })
  },
  getData: function(cb) {
    cb(JSON.stringify(this.data, null, 2));
  }
});