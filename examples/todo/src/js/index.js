import './component/todo_form.js';
import './component/todo_filters.js';
import './component/todo_list.js';
import './component/todo_summary.js';

// Import data interface
import dataInterface from './data.js';

function getTemplate(name, cb) {
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

const app = W.app('todo-example', getTemplate);

// Register shared data sources using data.js
app.data.register('todos', (cb) => {
  dataInterface.getTodos(cb);
});

app.data.register('todoFilter', (cb) => {
  dataInterface.getTodoFilter(cb);
});

app.data.fetch(['todos', 'todoFilter'], () => {
  app.start(document.body);
});
