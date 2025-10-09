import './component/todo_form.js';
import './component/todo_filters.js';
import './component/todo_list.js';
import './component/todo_summary.js';

function getTemplate(name, cb) {
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

const app = W.app('todo-example', getTemplate);

const seedTodos = [
  { id: 1, title: 'Finish Whirlpool docs', completed: false, priority: 'high' },
  { id: 2, title: 'Ship demo bundle', completed: true, priority: 'low' },
  { id: 3, title: 'Plan regression checklist', completed: false, priority: 'medium' }
];

const defaultFilter = {
  status: 'all',
  priority: 'all'
};

app.data.register('todos', (cb) => {
  cb(seedTodos);
});

app.data.register('todoFilter', (cb) => {
  cb(defaultFilter);
});

app.data.fetch(['todos', 'todoFilter'], () => {
  app.start(document.body);
});
