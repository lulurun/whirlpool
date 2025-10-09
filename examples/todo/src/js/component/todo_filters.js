W.component('todo_filters', {
  init: function() {
    this.app.data.on('todoFilter', () => {
      this.load();
    }, this);
    this.app.data.on('todos', () => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const filter = this.app.data.get('todoFilter') || { status: 'all', priority: 'all' };
    const todos = this.app.data.get('todos') || [];
    const counts = {
      all: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    };

    const statusOptions = [
      { key: 'all', label: 'All', count: counts.all },
      { key: 'active', label: 'Active', count: counts.active },
      { key: 'completed', label: 'Completed', count: counts.completed },
    ].map((option) => ({
      ...option,
      active: option.key === filter.status,
    }));

    const priorityOptions = [
      { key: 'all', label: 'Any priority' },
      { key: 'high', label: 'High' },
      { key: 'medium', label: 'Medium' },
      { key: 'low', label: 'Low' }
    ].map((option) => ({
      ...option,
      selected: option.key === filter.priority,
    }));

    cb({
      statusOptions,
      priorityOptions
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    const updateFilter = (partial) => {
      const current = this.app.data.get('todoFilter') || { status: 'all', priority: 'all' };
      this.app.data.emit('todoFilter', { ...current, ...partial }, this);
    };

    $container.find('[data-status]').on('click', (ev) => {
      const status = $(ev.currentTarget).data('status');
      updateFilter({ status });
    });

    $container.find('#priorityFilter').on('change', (ev) => {
      updateFilter({ priority: $(ev.currentTarget).val() });
    });

    cb();
  }
});
