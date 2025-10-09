// Seed todos
const seedTodos = [
  { id: 1, title: 'Finish Whirlpool docs', completed: false, priority: 'high' },
  { id: 2, title: 'Ship demo bundle', completed: true, priority: 'low' },
  { id: 3, title: 'Plan regression checklist', completed: false, priority: 'medium' }
];

// Todo state
let todos = [...seedTodos];

// Default filter
const defaultFilter = {
  status: 'all',
  priority: 'all'
};

// Data interface for the app
export default {
  /**
   * Get todos list (async with setTimeout)
   * @param {Function} callback - Called with todos array
   */
  getTodos: function(callback) {
    setTimeout(() => {
      callback(todos);
    }, 100);
  },

  /**
   * Get todo filter (async with setTimeout)
   * @param {Function} callback - Called with filter object
   */
  getTodoFilter: function(callback) {
    setTimeout(() => {
      callback(defaultFilter);
    }, 100);
  },

  /**
   * Add new todo (async with setTimeout)
   * @param {Object} todo - Todo item to add { id, title, completed, priority }
   * @param {Function} callback - Called with updated todos
   */
  addTodo: function(todo, callback) {
    setTimeout(() => {
      todos = [...todos, todo];
      callback({ todos });
    }, 100);
  },

  /**
   * Toggle todo completion (async with setTimeout)
   * @param {Number} id - Todo ID to toggle
   * @param {Function} callback - Called with updated todos
   */
  toggleTodo: function(id, callback) {
    setTimeout(() => {
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      callback({ todos });
    }, 100);
  },

  /**
   * Delete todo (async with setTimeout)
   * @param {Number} id - Todo ID to delete
   * @param {Function} callback - Called with updated todos
   */
  deleteTodo: function(id, callback) {
    setTimeout(() => {
      todos = todos.filter((todo) => todo.id !== id);
      callback({ todos });
    }, 100);
  },

  /**
   * Clear completed todos (async with setTimeout)
   * @param {Function} callback - Called with updated todos
   */
  clearCompleted: function(callback) {
    setTimeout(() => {
      todos = todos.filter((todo) => !todo.completed);
      callback({ todos });
    }, 100);
  },

  /**
   * Toggle all todos completion status (async with setTimeout)
   * @param {Boolean} completed - Target completion status
   * @param {Function} callback - Called with updated todos
   */
  toggleAll: function(completed, callback) {
    setTimeout(() => {
      todos = todos.map((todo) => ({ ...todo, completed }));
      callback({ todos });
    }, 100);
  },

  /**
   * Get current todos (synchronous)
   * @returns {Array} Current todos
   */
  getCurrentTodos: function() {
    return todos;
  }
};
