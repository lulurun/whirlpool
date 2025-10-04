import { API_CONFIG } from '../common.js';
import mainAppTemplate from '../template/main_app.html';

W.component('main-app', {
  init: function() {
    this.title = 'Whirlpool Starter App';
  },

  getData: function(cb) {
    cb({
      title: this.title,
      message: 'Your Whirlpool application is running!'
    });
  },

  getTemplate: function(cb) {
    cb(mainAppTemplate);
  },

  rendered: function(cb) {
    cb();
  }
});