# Whirlpool Starter - Quick Start

A minimal boilerplate for starting new Whirlpool framework projects.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development:**
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── js/
│   ├── index.js                # Main entry point - imports all components
│   ├── common.js               # Shared configuration and utilities
│   ├── component/              # Component JavaScript files
│   │   ├── main_app.js         # Main application component
│   │   └── sample_button.js    # Example button component
│   └── template/               # HTML template files
│       ├── main_app.html       # Template for main_app component
│       └── sample_button.html  # Template for sample_button component
├── css/
│   └── styles.css              # Application styles
public/
└── index.html                  # Main HTML file
```

## Adding New Components

1. **Create component file:** `src/js/component/my_feature.js`
   ```javascript
   W.component('my-feature', {
     init: function() {
       // Component initialization
     },

     getData: function(cb) {
       cb({
         message: 'Hello from my feature!'
       });
     },

     rendered: function(cb) {
       // DOM event handlers using arrow functions
       const $container = $(this.el);

       $container.find('.my-button').on('click', () => {
         // Handle click - 'this' refers to component
         this.load(); // Reload component
       });

       cb();
     }
   });
   ```

2. **Create template file:** `src/js/template/my_feature.html`
   ```html
   <div>
     <h3>{{message}}</h3>
     <button class="btn btn-primary my-button">Click me</button>
   </div>
   ```

3. **Import in index.js:** Add `import './component/my_feature.js';`

4. **Use in template:** `<div data-component="my-feature"></div>`

## Component Naming

- **File names:** Use underscore format: `my_feature.js`, `user_profile.js`
- **Component names:** Use kebab-case: `my-feature`, `user-profile`
- **Template files:** Match component file name: `my_feature.html`

## Key Patterns

- **Event handlers:** Always use arrow functions `() => {}` to preserve `this`
- **Component communication:** Use `this.publish()` and `this.subscribe()`
- **External data:** Create DataAccessor classes for complex data handling
- **Templates:** Use Handlebars syntax with Bootstrap classes

Start building your Whirlpool application! 🌊