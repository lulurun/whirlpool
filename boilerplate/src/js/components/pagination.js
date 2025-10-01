// Pagination component for data navigation
import paginationTemplate from '../../templates/pagination.hbs';

W.component('pagination', {
  init: function() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalItems = 0;

    // Subscribe to selection changes to show counts
    this.subscribe('selection.changed', (data) => {
      this.selectedCount = data.count;
      this.load();
    });
  },

  getData: function(cb) {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

    // Generate page numbers for pagination
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        number: i,
        isCurrent: i === this.currentPage,
        isActive: i === this.currentPage
      });
    }

    cb({
      currentPage: this.currentPage,
      totalPages: totalPages,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      startItem: startItem,
      endItem: endItem,
      pages: pages,
      hasPrevious: this.currentPage > 1,
      hasNext: this.currentPage < totalPages,
      hasMultiplePages: totalPages > 1,
      selectedCount: this.selectedCount || 0,
      hasSelection: (this.selectedCount || 0) > 0
    });
  },

  getTemplate: function(cb) {
    cb(paginationTemplate);
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Page navigation handlers
    $container.find('.page-link').on('click', (ev) => {
      ev.preventDefault();
      const page = parseInt($(ev.currentTarget).data('page'));

      if (page && page !== this.currentPage) {
        this.currentPage = page;
        this.load();

        // Publish page change event
        this.publish('page.changed', {
          page: this.currentPage,
          itemsPerPage: this.itemsPerPage
        });
      }
    });

    // Previous/Next handlers
    $container.find('.page-prev').on('click', (ev) => {
      ev.preventDefault();
      if (this.currentPage > 1) {
        this.currentPage--;
        this.load();
        this.publish('page.changed', {
          page: this.currentPage,
          itemsPerPage: this.itemsPerPage
        });
      }
    });

    $container.find('.page-next').on('click', (ev) => {
      ev.preventDefault();
      const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.load();
        this.publish('page.changed', {
          page: this.currentPage,
          itemsPerPage: this.itemsPerPage
        });
      }
    });

    // Items per page selector
    $container.find('.items-per-page').on('change', (ev) => {
      this.itemsPerPage = parseInt($(ev.currentTarget).val());
      this.currentPage = 1; // Reset to first page
      this.load();

      this.publish('page.changed', {
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage
      });
    });

    cb();
  },

  // Public method to update total items count
  setTotalItems: function(count) {
    this.totalItems = count;
    this.load();
  }
});