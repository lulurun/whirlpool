import { FORM_DATA_EVENT, formData as sharedFormData } from '../shared/formState.js';

W.component('preview', {
  init: function() {
    this.data = sharedFormData;
    this.app.data.on(FORM_DATA_EVENT, (payload) => {
      this.data = payload;
      if (this.complete) {
        this.load();
      }
    }, this);
  },

  getData: function(cb) {
    cb(JSON.stringify(this.data, null, 2));
  }
});
