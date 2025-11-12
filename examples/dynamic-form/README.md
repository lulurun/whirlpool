# Dynamic Form Builder Example

This example demonstrates a component that dynamically builds and manages a form with the following features:

- **Add Fields**: Click "Add Field" button to add new form fields dynamically
- **Remove Fields**: Each field has a remove button
- **Auto-sync**: The internal data object automatically syncs with form inputs
- **Submit**: Prints the complete form data object to the console

## Running the Example

1. Navigate to the example directory:
   ```bash
   cd examples/dynamic-form
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The app will automatically open in your browser at http://localhost:8080

## Building for Production

```bash
npm run build
```

This will create optimized bundles in the `public/` directory.

## Structure

This example follows the Whirlpool boilerplate structure:

```
examples/dynamic-form/
├── src/
│   ├── html/
│   │   └── index.html          # Main HTML template
│   └── js/
│       ├── component/
│       │   ├── dynamic_form.js # Form component logic
│       │   └── preview.js      # Preview component logic
│       ├── template/
│       │   ├── dynamic_form.html # Form template
│       │   └── preview.html    # Preview template
│       └── index.js            # App entry point
├── public/                     # Built files (generated)
├── webpack.common.js           # Webpack common config
├── webpack.dev.js              # Webpack dev config
├── webpack.prod.js             # Webpack prod config
└── package.json                # Dependencies and scripts
```

## How Components Work in Whirlpool

### 1. Application Entry Points

**index.html**: The main HTML file for your application
- Customize the `<body>` section based on your app's needs
- The `<head>` and `<script>` sections should be sufficient for most cases - they include `whirlpool.js`
- The app bundle JavaScript built by webpack will be automatically embedded by webpack

**index.js**: The application entry point
- Import all component JavaScript files here
- Import any utility JavaScript files defined by your app
- The rest of the `index.js` boilerplate should be sufficient for most cases

### 2. Component Structure

A Whirlpool component consists of two files:
- **Handlebars template**: Located in `template/{componentName}.html` - defines the component's HTML structure
- **JavaScript definition**: Located in `component/{componentName}.js` - defines the component's behavior

### 3. Component Definition

When defining a component with `W.component('componentName', {...})`, you should only define these lifecycle methods when necessary:

- **`init()`**: Called when the component is first instantiated. Use this to initialize component state, set up event listeners on the app, or prepare data. This runs before the template is rendered.

- **`getData(cb)`**: Called before rendering the template. Use this to prepare data that will be passed to the Handlebars template. Call `cb(data)` with the data object you want to make available in the template.

- **`rendered(cb)`**: Called after the template has been rendered to the DOM. Use this to attach event listeners to DOM elements, manipulate the rendered HTML, or perform any setup that requires the DOM to be ready. Always call `cb()` when done.

- **`cleanup()`**: Called when the component is about to be removed from the DOM. Use this to clean up event listeners, timers, or any other resources to prevent memory leaks.

Any other fields in the component definition will be ignored by the framework.

### 4. Component Instantiation

To use a component, place a `<div data-component="componentName"></div>` element in your HTML:

- The Whirlpool framework automatically scans the HTML and instantiates components when it finds these elements
- Components can be nested: if you place a component element inside another component's template, the framework will instantiate them recursively
- This allows you to build complex UIs by composing smaller, reusable components

### 5. Event System

Components can communicate with each other using the application's event bus (`app.ev`):

- **`app.ev.emit(eventName, data, emitter)`**: Emit an event with optional data. The `emitter` parameter is typically `this` to identify which component emitted the event.

- **`app.ev.on(eventName, handler, listener)`**: Subscribe to an event. The `handler` is a callback function that receives `(data, emitter)` as parameters. The `listener` parameter (typically `this`) identifies the subscriber and is used for cleanup.

- **`app.ev.off(eventName, listener)`**: Unsubscribe a specific listener from an event.

- **`app.ev.remove(listener)`**: Remove a listener from all events. Useful in the `cleanup()` method to ensure all event listeners are removed when a component is destroyed.

Events allow components to stay decoupled while still being able to react to changes in other parts of the application.
