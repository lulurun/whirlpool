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
│       │   └── dynamic_form.js # Component logic
│       ├── template/
│       │   └── dynamic_form.html # Handlebars template
│       └── index.js            # App entry point
├── public/                     # Built files (generated)
├── webpack.common.js           # Webpack common config
├── webpack.dev.js              # Webpack dev config
├── webpack.prod.js             # Webpack prod config
└── package.json                # Dependencies and scripts
```

## Features Demonstrated

- Dynamic form generation
- Two-way data binding
- Event handling with jQuery
- Component lifecycle (getData, rendered hooks)
- Handlebars templating
- Bootstrap styling
