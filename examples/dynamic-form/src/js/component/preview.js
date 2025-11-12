import { FORM_DATA_EVENT, formData as sharedFormData } from '../shared/formState.js';

W.component('preview', {
  init: function() {
    this.app.ev.on(FORM_DATA_EVENT, () => {
      if (this.complete) {
        this.load();
      }
    }, this);
  },

  getData: function(cb) {
    cb(JSON.stringify(sharedFormData, null, 2));
  }
});
