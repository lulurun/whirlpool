# Todo Example

This example showcases how Whirlpool coordinates multiple components around shared `app.data` sources to build a feature-complete todo list.

## Available scripts

```bash
npm install
npm start    # launches webpack dev server on http://localhost:8082
npm run build
```

## Key ideas
- `todo_form` adds tasks with a priority flag and emits updates through `app.data.emit('todos')`.
- `todo_filters` shares filter state across components using the `todoFilter` data channel.
- `todo_list` renders a filtered view, supporting inline toggles and deletions.
- `todo_summary` derives aggregate metrics and exposes bulk actions (complete all, clear completed).
- `webpack.common.js` copies the root `dist/whirlpool.min.js` bundle so the global `W` API is always served beside the example.
