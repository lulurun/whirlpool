import dataInterface from '../data.js';

W.component('todo_list', {
  init: function() {
    this.app.data.on('todos', () => {
      this.load();
    }, this);
    this.app.data.on('todoFilter', () => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    const todos = this.app.data.get('todos') || [];
    const filter = this.app.data.get('todoFilter') || { status: 'all', priority: 'all' };

    const filtered = todos.filter((todo) => {
      const matchesStatus = filter.status === 'all'
        || (filter.status === 'active' && !todo.completed)
        || (filter.status === 'completed' && todo.completed);
      const matchesPriority = filter.priority === 'all' || todo.priority === filter.priority;
      return matchesStatus && matchesPriority;
    }).sort((a, b) => a.id - b.id);

    cb({
      hasTodos: filtered.length > 0,
      todos: filtered.map((todo) => ({
        ...todo,
        statusLabel: todo.completed ? 'Completed' : 'Active',
        statusClass: todo.completed ? 'text-decoration-line-through text-muted' : '',
        badgeClass: todo.priority === 'high'
          ? 'bg-danger'
          : todo.priority === 'medium'
            ? 'bg-warning text-dark'
            : 'bg-secondary'
      })),
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('.todo-toggle').on('change', (ev) => {
      const id = parseInt($(ev.currentTarget).data('id'), 10);

      // Call async toggleTodo method
      dataInterface.toggleTodo(id, (result) => {
        // Refresh todos data to publish updates to all subscribers
        this.app.data.refresh('todos');
      });
    });

    $container.find('.todo-delete').on('click', (ev) => {
      const id = parseInt($(ev.currentTarget).data('id'), 10);

      // Call async deleteTodo method
      dataInterface.deleteTodo(id, (result) => {
        // Refresh todos data to publish updates to all subscribers
        this.app.data.refresh('todos');
      });
    });

    cb();
  }
});
