import dataInterface from '../data.js';

W.component('todo_form', {
  getData: function(cb) {
    cb({
      priorities: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium', selected: true },
        { value: 'low', label: 'Low' }
      ]
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);
    const $input = $container.find('#todoTitle');
    const $priority = $container.find('#todoPriority');

    const addTodo = () => {
      const title = $input.val().trim();
      if (!title) {
        $input.focus();
        return;
      }

      const todos = this.app.data.get('todos') || [];
      const nextId = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
      const newTodo = {
        id: nextId,
        title,
        completed: false,
        priority: $priority.val()
      };

      // Call async addTodo method
      dataInterface.addTodo(newTodo, (result) => {
        // Refresh todos data to publish updates to all subscribers
        this.app.data.refresh('todos');
      });

      $input.val('');
      $priority.val('medium');
    };

    $container.find('form').on('submit', (ev) => {
      ev.preventDefault();
      addTodo();
    });

    $container.find('#addTodoBtn').on('click', () => {
      addTodo();
    });

    cb();
  }
});
