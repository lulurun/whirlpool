// Search box component for filtering data
import searchBoxTemplate from '../../templates/search_box.hbs';

W.component('search-box', {
  init: function() {
    this.searchTerm = '';
    this.placeholder = 'Search...';
  },

  getData: function(cb) {
    cb({
      searchTerm: this.searchTerm,
      placeholder: this.placeholder,
      hasValue: this.searchTerm.length > 0
    });
  },

  getTemplate: function(cb) {
    cb(searchBoxTemplate);
  },

  rendered: function(cb) {
    const $container = $(this.el);
    const $input = $container.find('.search-input');

    // Search input handler with debouncing
    let searchTimeout;
    $input.on('input', (ev) => {
      const value = $(ev.currentTarget).val();

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchTerm = value;

        // Publish search change event
        this.publish('search.changed', {
          term: value,
          length: value.length
        });
      }, 300); // 300ms debounce
    });

    // Clear button handler
    $container.find('.clear-search').on('click', () => {
      this.searchTerm = '';
      $input.val('');
      this.publish('search.changed', {
        term: '',
        length: 0
      });
    });

    // Enter key handler
    $input.on('keypress', (ev) => {
      if (ev.which === 13) { // Enter key
        ev.preventDefault();
        this.publish('search.submitted', {
          term: this.searchTerm
        });
      }
    });

    cb();
  }
});