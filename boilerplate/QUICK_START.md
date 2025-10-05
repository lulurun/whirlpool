# Whirlpool Starter - Quick Start

Minimal boilerplate following exact kilimanjaro web structure.

## Setup

```bash
npm install
npm start    # Development server
npm run build # Production build
```

## Project Structure

```
boilerplate/
├── src/
│   ├── html/
│   │   └── index.html           # Main HTML template
│   └── js/
│       ├── index.js             # Entry point - imports all components
│       ├── component/           # Component JavaScript files
│       │   └── simple_app.js    # Example component
│       └── template/            # HTML template files
│           └── simple_app.html  # Component template
├── public/
│   └── whirlpool.min.js        # Whirlpool framework
├── package.json                # Dependencies
├── webpack.common.js           # Webpack base config
├── webpack.dev.js              # Development config
└── webpack.prod.js             # Production config
```

## Adding Components

1. **Create component:** `src/js/component/my_component_name.js`
2. **Create template:** `src/js/template/my_component_name.html`
3. **Import in index.js:** Add `import './component/my_component_name.js';`
4. **Use in template:** `<div data-component="my_component_name"></div>`

## Component Pattern

```javascript
W.component('my_component_name', {
  init: function() {
    // Initialize data
  },

  getData: function(cb) {
    cb({ message: 'Hello World' });
  },

  rendered: function(cb) {
    // Event handlers with arrow functions
    $(this.el).find('.button').on('click', () => {
      this.load(); // Reload component
    });
    cb();
  }
});
```

## Template Pattern

```html
<div class="container">
  <h3>{{message}}</h3>
  <button class="btn btn-primary button">Click me</button>
</div>
```

Start building! 🌊