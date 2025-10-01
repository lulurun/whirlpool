// Main application component
import appTemplate from '../../templates/app.hbs';

W.component('app', {
  init: function() {
    // Application initialization
    this.currentPage = 'data-table';
    console.log('App component initialized');
  },

  getData: function(cb) {
    // Sample data for the app
    cb({
      title: 'Whirlpool Framework Demo',
      subtitle: 'Component-based web application',
      currentPage: this.currentPage,
      showDataTable: this.currentPage === 'data-table'
    });
  },

  getTemplate: function(cb) {
    cb(appTemplate);
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Navigation handlers
    $container.find('.nav-link').on('click', (ev) => {
      ev.preventDefault();
      const page = $(ev.currentTarget).data('page');
      this.currentPage = page;
      this.load();
    });

    cb();
  }
});