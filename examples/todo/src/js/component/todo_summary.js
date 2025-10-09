W.component('todo_summary', {
  init: function() {
    this.app.data.on('todos', () => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const todos = this.app.data.get('todos') || [];
    const completed = todos.filter((todo) => todo.completed);
    const active = todos.length - completed.length;
    const highPriority = todos.filter((todo) => todo.priority === 'high').length;

    cb({
      total: todos.length,
      completed: completed.length,
      active,
      highPriority,
      hasCompleted: completed.length > 0,
      allCompleted: todos.length > 0 && active === 0
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('#clearCompleted').on('click', () => {
      const todos = this.app.data.get('todos') || [];
      const filtered = todos.filter((todo) => !todo.completed);
      this.app.data.emit('todos', filtered, this);
    });

    $container.find('#toggleAll').on('click', () => {
      const todos = this.app.data.get('todos') || [];
      if (!todos.length) return;
      const shouldCompleteAll = todos.some((todo) => !todo.completed);
      const updated = todos.map((todo) => ({ ...todo, completed: shouldCompleteAll }));
      this.app.data.emit('todos', updated, this);
    });

    cb();
  }
});
