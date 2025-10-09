# Whirlpool Reference Guide

## Core Concepts

### 1. Components

Components are the building blocks of Whirlpool applications. Each component:
- Has its own template, data, and behavior
- Can contain child components
- Communicates through events
- Has a well-defined lifecycle

### 2. Framework Methods

Components have access to these framework-reserved methods that are automatically bound:

#### Essential Methods
- `init()` - Called once when component is first created
- `getData(callback)` - Provides data for template rendering
- `rendered(callback)` - Called after template is rendered and DOM is updated
- `load(callback, param)` - Triggers the complete render cycle
- `destroyed()` - Called when component is removed from DOM

#### Cleanup Method
- `cleanup()` - Called during component destruction for custom cleanup logic

#### Framework Properties
- `this.el` - DOM element of the component
- `this.app` - Reference to the main application instance
- `this.parent` - Reference to parent component
- `this.children` - Array of child components

#### App Instance Methods
- `this.app.ev.emit(event, data, emitter)` - Emit events to other components
- `this.app.ev.on(event, handler, listener)` - Subscribe to events from other components
- `this.app.ev.off(event, listener)` - Unsubscribe from specific event
- `this.app.ev.remove(listener)` - Remove listener from all events
- `this.app.data.register(dataKey, fetchFn)` - Register a data source with fetch function
- `this.app.data.fetch(dataKeys, cb)` - Fetch multiple data sources at once
- `this.app.data.get(dataKey)` - Get cached data value
- `this.app.data.refresh(dataKey)` - Refresh data and emit update events
- `this.app.data.on(dataKey, cb, listener)` - Subscribe to data updates
- `this.app.data.emit(dataKey, data, emitter)` - Manually emit data update events
- `this.app.nav.on(cb, listener)` - Subscribe to navigation (popstate) events

## Component Definition Pattern

```javascript
W.component('component-name', {
  init: function() {
    // Initialization logic - called once
    // Set up subscriptions, initialize data accessors
    this.data_accessor = new DataAccessor();

    // Subscribe to events using app.ev
    this.app.ev.on('data.updated', (data) => {
      this.load(); // Reload component when data changes
    }, this);

    // Subscribe to navigation changes
    this.app.nav.on(() => {
      // Handle URL changes
      this.load();
    }, this);
  },

  getData: function(cb) {
    // Provide data for template rendering
    // This method is called every time the component loads
    const data = {
      items: [],
      hasItems: false
    };
    cb(data);
  },

  rendered: function(cb) {
    // DOM manipulation after template rendering
    const $container = $(this.el);

    // Event handlers - MUST use arrow functions () => {} to preserve 'this' context
    $container.find('.button').on('click', (ev) => {
      const $button = $(ev.currentTarget);
      const buttonId = $button.data('id');
      const buttonText = $button.text();

      // Access clicked element data
      console.log('Button clicked:', buttonId, buttonText);

      // 'this' refers to the component because we used arrow function
      this.app.ev.emit('button.clicked', {
        id: buttonId,
        text: buttonText,
        element: $button[0]
      }, this);

      // Update component state and reload if needed
      this.someState = 'updated';
      this.load(); // Reload component
    });

    // Multiple event handlers - always use arrow functions
    $container.find('.checkbox').on('change', (ev) => {
      const isChecked = $(ev.currentTarget).is(':checked');
      // 'this' works because of arrow function
      this.app.ev.emit('checkbox.changed', { checked: isChecked }, this);
    });

    // WRONG: Regular function loses 'this' context
    // $container.find('.button').on('click', function(ev) {
    //   this.app.ev.emit(...); // ERROR: 'this' refers to the button element, not component
    // });

    cb(); // Always call callback when done
  },

  cleanup: function() {
    // Optional cleanup logic called during component destruction
    // Useful for clearing intervals, removing external event listeners, etc.
    console.log('Cleaning up component');
  }
});
```

## Framework Limitations

### 1. Custom Methods Not Bound
**Important:** Only framework-reserved methods are bound to the component object. Custom methods like `this.fetchData()` will cause "no such method" errors.

**Solution:** Use external classes for complex logic:

### 2. Event Handler Context
**Critical:** Event handlers must use arrow functions `() => {}` to preserve component `this` context. Regular `function() {}` will lose the component reference.

```javascript
// CORRECT: Arrow function preserves 'this'
$container.find('.button').on('click', (ev) => {
  this.publish('event', data); // 'this' refers to component
});

// WRONG: Regular function loses 'this'
$container.find('.button').on('click', function(ev) {
  this.publish('event', data); // ERROR: 'this' refers to button element
});
```

```javascript
// Data accessor class (defined before component)
class ComponentDataAccessor {
  constructor() {
    this.data = null;
  }

  fetchData(callback) {
    // Data fetching logic
  }
}

W.component('my-component', {
  init: function() {
    // Initialize data accessor in init
    this.data_accessor = new ComponentDataAccessor();
  },

  getData: function(cb) {
    // Use data accessor
    const data = this.data_accessor.getData();
    cb(data);
  }
});
```

## Data Management System

The framework provides a built-in data management system via `app.data` for centralized state management and reactive data updates.

### Registering Data Sources

```javascript
// Register a data source with a fetch function
app.data.register('users', (callback) => {
  $.ajax({
    url: '/api/users',
    success: (data) => callback(data)
  });
});

app.data.register('settings', (callback) => {
  const settings = { theme: 'dark', lang: 'en' };
  callback(settings);
});
```

### Fetching Data

```javascript
// Fetch single data source
app.data.fetch(['users'], (results) => {
  console.log(results.users); // Array of users
});

// Fetch multiple data sources at once
app.data.fetch(['users', 'settings'], (results) => {
  console.log(results.users);    // Users data
  console.log(results.settings); // Settings data
});
```

### Getting Cached Data

```javascript
// Get cached data value (must be fetched first)
const users = app.data.get('users');
```

### Refreshing Data

```javascript
// Refresh data and emit update events to subscribers
app.data.refresh('users');
```

### Subscribing to Data Updates

```javascript
// In component init - listen for data changes
W.component('user_list', {
  init: function() {
    this.app.data.on('users', (data, emitter) => {
      console.log('Users updated:', data);
      this.load(); // Reload component with new data
    }, this);
  },

  getData: function(cb) {
    // Use cached data
    const users = this.app.data.get('users');
    cb({ users: users || [] });
  }
});
```

### Manually Emitting Data Updates

```javascript
// Emit data update event without re-fetching
this.app.data.emit('users', updatedUsers, this);
```

### Complete Data Management Example

```javascript
// Setup data sources in app entry
const app = W.app('my-app', getTemplate);

app.data.register('users', (cb) => {
  $.ajax({ url: '/api/users', success: cb });
});

// Initial data fetch
app.data.fetch(['users'], (results) => {
  app.start(document.body);
});

// In a component - update data and notify subscribers
W.component('user_form', {
  rendered: function(cb) {
    $(this.el).find('form').on('submit', (ev) => {
      ev.preventDefault();

      $.ajax({
        url: '/api/users',
        method: 'POST',
        data: $(ev.currentTarget).serialize(),
        success: () => {
          // Refresh data and notify all subscribers
          this.app.data.refresh('users');
        }
      });
    });
    cb();
  }
});
```

### Real-World Data Sharing Example

See the [Shopping Cart Example](examples/shopping-cart) for a complete demonstration of multiple components sharing data:

**Data Flow Pattern:**
```
app.data.register('cart', fetchFn)  // Register shared data
         ↓
Component A: app.data.on('cart', handler)  // Subscribe
Component B: app.data.on('cart', handler)  // Subscribe
Component C: app.data.on('cart', handler)  // Subscribe
         ↓
User Action in Component A
         ↓
Component A: app.data.emit('cart', newData)  // Emit change
         ↓
Framework automatically notifies all subscribers
         ↓
Components A, B, C all reload with new data
```

**Key Benefits:**
- **Centralized State**: Single source of truth for shared data
- **Reactive Updates**: Components automatically update when data changes
- **Decoupled**: Components only know about data keys, not each other
- **Multiple Subscribers**: Any number of components can share the same data
- **Multiple Sources**: Components can subscribe to multiple data sources

## Navigation System

The framework provides a navigation system via `app.nav` for handling browser navigation events (hash changes, back/forward buttons).

### Subscribing to Navigation Events

```javascript
W.component('user_page', {
  init: function() {
    this.userId = getUserIdFromHash();

    // Listen to navigation changes
    this.app.nav.on(() => {
      const newUserId = getUserIdFromHash();

      // Only reload if the user ID changed
      if (newUserId && newUserId !== this.userId) {
        this.userId = newUserId;
        this.load();
      }
    }, this);
  }
});
```

**How it works:**
- `app.nav` listens to browser `popstate` events (triggered by hash changes, back/forward buttons)
- Components subscribe via `app.nav.on(callback, listener)` to be notified of navigation changes
- The callback receives the popstate event data
- Always pass `this` as the second parameter for proper cleanup

## Event-Driven Communication

### Publishing Events
```javascript
// In component method
this.app.ev.emit('action.completed', {
  type: 'delete',
  items: ['item1', 'item2']
}, this);
```

### Subscribing to Events
```javascript
// In component init
this.app.ev.on('action.completed', (data, emitter) => {
  if (data.type === 'delete') {
    this.load(); // Reload component
  }
}, this);
```

**Important:** Always pass `this` as the third parameter to `on()` and as the last parameter to `emit()`. This allows the framework to properly clean up event listeners when components are destroyed via `this.app.ev.remove(this)` in the `destroyed()` lifecycle method.

### Common Event Patterns

1. **Data Updates**: `data.updated` with `{ type: 'results' }`
2. **User Actions**: `action.hide`, `action.delete`, `results.selected`
3. **State Changes**: `state.changed` with relevant data

## Template Integration

Components automatically render using Handlebars templates:

```html
<!-- Template file: component-name.html -->
<div class="component-content">
  {{#if hasItems}}
    <ul>
      {{#items}}
        <li>{{name}}</li>
      {{/items}}
    </ul>
  {{else}}
    <p>No items found</p>
  {{/if}}
</div>
```

## Getting Started

### Quick Setup

1. **Clone the boilerplate:**
```bash
git clone <whirlpool-repo>
cd whirlpool/boilerplate
npm install
npm start    # Development server at http://localhost:8080
```

2. **Build for production:**
```bash
npm run build  # Output to public/ directory
```

### Project Structure

```
your-app/
├── src/
│   ├── html/
│   │   └── index.html           # Main HTML entry point
│   └── js/
│       ├── index.js             # App entry - imports components & sets up template loader
│       ├── component/           # Component JavaScript files
│       │   └── my_component.js
│       └── template/            # Handlebars template files
│           └── my_component.html
├── public/
│   ├── whirlpool.min.js        # Whirlpool framework (6.7KB)
│   └── sample_data.json         # Optional static data
├── package.json                # Dependencies
├── webpack.common.js           # Webpack base config
├── webpack.dev.js              # Development config
└── webpack.prod.js             # Production config
```

### Application Entry Point

Your `src/js/index.js` is the entry point that sets up the Whirlpool app:

```javascript
// Import all your components
import './component/my_component.js';
import './component/another_component.js';

// Template loader function - required for Whirlpool
function getTemplate(name, cb) {
  // Dynamically imports template files
  import('./template/' + name + '.html').then((tmpl) => {
    cb(tmpl.default);
  });
}

// Create Whirlpool app with a name and template loader
const app = W.app('my-app-name', getTemplate);

// Start the application on document.body
app.start(document.body);
```

**Key Points:**
- Import all component files at the top
- `getTemplate` function loads Handlebars templates dynamically
- Template files must be in `src/js/template/` directory
- Component name must match template filename (e.g., `my_component.js` → `my_component.html`)
- `app.start(document.body)` initializes all components with `data-component` attributes

## DOM Integration

### Component Declaration in HTML

```html
<!-- Main entry point: src/html/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>My Whirlpool App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="//code.jquery.com/jquery-3.6.0.min.js"></script>
    <script defer src="./whirlpool.min.js"></script>
  </head>
  <body>
    <div class="container-fluid">
      <!-- Components are declared with data-component attribute -->
      <div data-component="my_component"></div>
    </div>
  </body>
</html>
```

### Nested Components

Components can contain other components using `data-component` attributes in templates:

```html
<!-- parent_component.html -->
<div class="parent">
  <h2>Parent Component</h2>

  <!-- Child component with data attributes -->
  <div data-component="child_component" data-path="/some/path"></div>

  <!-- Multiple children -->
  <div data-component="another_child"></div>
</div>
```

**Passing Data to Child Components:**
- Use `data-*` attributes to pass data from parent to child
- Access in child component: `this.el.getAttribute('data-path')`
- Example from dynamic-form: `<div data-component="dynamic_form" data-path="{{path}}"></div>`

### Automatic Instantiation
Whirlpool automatically:
1. Scans for `data-component` attributes when app starts
2. Creates component instances for each matching element
3. Calls component lifecycle methods in order: `init()` → `getData()` → render → `rendered()`
4. Recursively instantiates nested child components
5. Manages parent-child relationships via `this.parent` and `this.children`

## Data Flow Patterns

### 1. Simple Data Flow
```
Component.init() → Component.getData() → Template Rendering → Component.rendered()
```

### 2. Event-Driven Updates
```
User Action → this.publish() → Other Components Subscribe → this.load() → Re-render
```

### 3. External Data Access Pattern
```
Raw API Data → DataAccessor.fetch() → DataAccessor.process() →
Component.getData() → Apply UI State → Template Rendering
```

## Creating New Components

### Step-by-Step Process

1. **Create component file:** `src/js/component/my_component.js`
```javascript
W.component('my_component', {
  init: function() {
    // Setup code here
  },

  getData: function(cb) {
    cb({ message: 'Hello World' });
  },

  rendered: function(cb) {
    // DOM event handlers here
    cb();
  }
});
```

2. **Create template file:** `src/js/template/my_component.html`
```html
<div class="my-component">
  <h3>{{message}}</h3>
</div>
```

3. **Import in index.js:**
```javascript
import './component/my_component.js';
```

4. **Use in HTML or parent template:**
```html
<div data-component="my_component"></div>
```

### Component Naming Convention

- **File names**: Use snake_case (e.g., `my_component.js`)
- **Component names**: Match file names exactly (e.g., `W.component('my_component', {...})`)
- **Template names**: Must match component name (e.g., `my_component.html`)

## Common Handlebars Template Patterns

### Conditionals
```html
{{#if hasItems}}
  <p>Has items!</p>
{{else}}
  <p>No items</p>
{{/if}}
```

### Loops
```html
{{#items}}
  <div>{{name}} - {{value}}</div>
{{/items}}
```

### Custom Helpers (Built-in)
```html
{{#eq type "object"}}
  <p>This is an object</p>
{{/eq}}
```

### Accessing Current Context
```html
<!-- When data is a string or primitive -->
<pre>{{.}}</pre>
```

### Data Attributes in Templates
```html
<!-- Pass data to event handlers -->
<button data-item-id="{{id}}" data-action="delete">Delete</button>

<!-- Access in rendered() -->
<script>
$container.find('button').on('click', (ev) => {
  const itemId = $(ev.currentTarget).data('item-id');
  const action = $(ev.currentTarget).data('action');
});
</script>
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Event Communication**: Use events for component communication, not direct method calls
3. **State Management**: Keep UI state in components, data state in data accessors or global variables
4. **Lifecycle Management**: Use `init()` for setup, `rendered()` for DOM manipulation
5. **Arrow Functions**: Always use `() => {}` in event handlers to preserve `this` context

### Data Management
1. **Separation of Concerns**: Use external classes for complex data access and processing
2. **Caching**: Store data in instance variables to avoid re-fetching
3. **Smart Updates**: Use events to trigger selective updates rather than full page reloads
4. **Transform in getData**: Transform raw data into template-ready format in `getData()`

### Event Patterns
1. **Descriptive Names**: Use clear event names like `data.updated`, `action.clicked`
2. **Data Payloads**: Include relevant data in event payloads
3. **Type Discrimination**: Use type fields in events for different update types
4. **Subscribe in init()**: Set up all subscriptions in the `init()` method

### Common Pitfalls to Avoid

1. **❌ Using regular functions in event handlers**
```javascript
// WRONG - loses 'this' context
$container.find('.btn').on('click', function(ev) {
  this.load(); // ERROR: 'this' is the button, not the component
});

// CORRECT - preserves 'this' context
$container.find('.btn').on('click', (ev) => {
  this.load(); // 'this' is the component
});
```

2. **❌ Defining custom methods on component**
```javascript
// WRONG - methods not bound by framework
W.component('my_component', {
  myCustomMethod: function() { // This won't work!
    return this.data;
  }
});

// CORRECT - use external class
class MyHelper {
  getData() {
    return this.data;
  }
}
```

3. **❌ Forgetting to call callback**
```javascript
// WRONG - framework will hang
rendered: function(cb) {
  $container.find('.btn').on('click', () => {});
  // Missing cb();
}

// CORRECT - always call callback
rendered: function(cb) {
  $container.find('.btn').on('click', () => {});
  cb();
}
```

4. **❌ Component name mismatch**
```javascript
// File: my_component.js
W.component('myComponent', {...}); // WRONG

// File: my_component.html
// Template won't load!

// CORRECT
W.component('my_component', {...});
```

## Real-World Examples

### Example 1: Simple Component with AJAX Data Loading

From the boilerplate - loads data from JSON file and handles user interactions:

```javascript
// src/js/component/simple_app.js

// Helper: Map data to CSS classes
const statusCssMap = {
  'active': 'success',
  'pending': 'warning',
  'completed': 'secondary'
};

W.component('simple_app', {
  getData: function(cb) {
    // Load data via AJAX
    $.ajax({
      url: 'sample_data.json',
      dataType: 'json',
      success: (data) => {
        // Transform data before passing to template
        const items = data.items.map(item => ({
          ...item,
          badgeClass: statusCssMap[item.status] || 'secondary'
        }));

        cb({
          appName: data.appName,
          items: items,
          itemCount: items.length
        });
      },
      error: (xhr, status, error) => {
        console.error('Failed to load data:', error);
        cb({ appName: '', items: [], itemCount: 0 });
      }
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Click handler - MUST use arrow function
    $container.find('.item-row').on('click', (ev) => {
      const itemId = $(ev.currentTarget).data('item-id');
      console.log('Clicked item:', itemId);

      // Toggle highlight on clicked row
      $container.find('.item-row').removeClass('table-active');
      $(ev.currentTarget).addClass('table-active');
    });

    cb();
  }
});
```

### Example 2: Recursive Nested Components with Shared State

From dynamic-form example - demonstrates nested components and global state management:

```javascript
// src/js/component/dynamic_form.js

// Global shared state across all component instances
let globalFormData = {};

W.component('dynamic_form', {
  init: function() {
    // Get configuration from data attributes
    this.dataPath = this.el.getAttribute('data-path') || '';
    this.isRoot = this.dataPath === '';

    // Navigate to this component's data in the global state
    if (this.isRoot) {
      this.formData = globalFormData;
    } else {
      const keys = this.dataPath.split('/').slice(1);
      let current = globalFormData;
      for (const key of keys) {
        current = current[key];
      }
      this.formData = current;
    }
  },

  getData: function(cb) {
    cb({
      isRoot: this.isRoot,
      fields: Object.keys(this.formData).map(fieldName => {
        const value = this.formData[fieldName];
        const isObject = typeof value === 'object' && value !== null;

        return {
          name: fieldName,
          value: isObject ? '' : value,
          type: isObject ? 'object' : 'value',
          path: `${this.dataPath}/${fieldName}`,
        };
      }),
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Update JSON display helper
    const updateJsonDisplay = () => {
      this.app.ev.emit('data.formData.updated', globalFormData, this);
    };

    // Add new field button handler
    $container.find('#addFieldBtn').on('click', (e) => {
      const $row = $(e.target).closest('.row');
      const name = $row.find('input').val();
      const type = $row.find('select').val();

      if (!name || name in this.formData) return;

      // Add field based on type
      this.formData[name] = (type === 'object') ? {} : '';
      updateJsonDisplay();
      this.load(); // Reload to show new field
    });

    // Field value change handler
    $container.find('input[data-field]').on('input', (e) => {
      const fieldName = $(e.target).data('field');
      this.formData[fieldName] = e.target.value;
      updateJsonDisplay();
    });

    // Remove field button handler
    $container.find('button[data-remove]').on('click', (e) => {
      const fieldName = $(e.currentTarget).data('remove');
      delete this.formData[fieldName];
      updateJsonDisplay();
      this.load(); // Reload to remove field from UI
    });

    cb();
  }
});
```

**Template for nested component** (`dynamic_form.html`):
```html
{{#fields}}
<div class="mb-2">
  <div class="row align-items-start">
    <div class="col-sm-1">
      <b>{{name}}</b>
    </div>
    <div class="col-sm-10">
      {{#eq type "value"}}
      <input type="text" class="form-control" value="{{value}}"
             data-field="{{name}}" placeholder="Field value"/>
      {{/eq}}
      {{#eq type "object"}}
      <!-- Recursive nested component with data-path -->
      <div class="border rounded p-3 bg-light"
           data-component="dynamic_form" data-path="{{path}}"></div>
      {{/eq}}
    </div>
    <div class="col-sm-1">
      <button type="button" class="btn btn-danger"
              data-remove="{{name}}">x</button>
    </div>
  </div>
</div>
{{/fields}}
```

### Example 3: Event-Driven Communication Between Components

Preview component that listens to form data updates:

```javascript
// src/js/component/preview.js

W.component('preview', {
  init: function() {
    this.data = null;

    // Subscribe to events from dynamic_form component
    this.app.ev.on('data.formData.updated', (data) => {
      this.data = data;
      this.load(); // Reload to display updated data
    }, this);
  },

  getData: function(cb) {
    // Format data as JSON string for display
    cb(JSON.stringify(this.data, null, 2));
  }
});
```

**Template** (`preview.html`):
```html
<pre>{{.}}</pre>
```

**Key Patterns Demonstrated:**
1. **Shared State**: Global variable accessed by multiple component instances
2. **Recursive Components**: Component rendering itself for nested objects
3. **Event Communication**: Components communicate via publish/subscribe
4. **Dynamic Reloading**: `this.load()` called to refresh UI after state changes
5. **Data Attributes**: Passing configuration via `data-*` attributes

## Framework Architecture

### Component Lifecycle
1. **Instantiation**: Framework creates component instance
2. **Initialization**: `init()` called for setup
3. **Data Loading**: `getData()` called to get render data
4. **Template Rendering**: Handlebars renders template with data
5. **Post-Render**: `rendered()` called for DOM manipulation
6. **Child Loading**: Child components loaded recursively
7. **Update Cycle**: `load()` can be called to restart cycle
8. **Destruction**: `destroyed()` called when component removed

### Event System (EventBus)
- Global publish/subscribe system via `app.ev`
- Components can subscribe to any topic
- Events flow between components without tight coupling
- Event payloads carry relevant data for updates
- Automatic cleanup via `app.ev.remove(this)` when components are destroyed

### Switch Component - Client-Side Routing

Whirlpool doesn't provide a traditional router. Instead, it uses **Switch** components for routing purposes.

**How Switch Works:**

1. **Navigation Listening**: Switch subscribes to `app.nav.on()` for browser navigation events
2. **URL Parsing**: When URL changes, switch's `getComponentName()` parses `location.hash`
3. **Component Swapping**: Switch destroys the current component and loads the new one

**Basic Switch Usage:**

```html
<!-- HTML: Switch container -->
<div data-component="main_switch" data-default="home"></div>
```

```javascript
// Component registration
W.switch('main_switch', {
  knownComponents: {
    'home': 'home_page',
    'about': 'about_page',
    'users': 'user_list'
  }
});
```

**How It Works:**

- Navigate to `index.html#home` → switch loads `home_page` component
- Navigate to `index.html#about` → switch loads `about_page` component
- Navigate to `index.html#users` → switch loads `user_list` component
- Unknown hash → loads component specified in `data-default` attribute

**The Switch Mechanism:**

1. **URL Change Detection**: `app.nav` listens to browser `popstate` events
2. **Switch Notification**: Switch subscribes via `app.nav.on()` in its constructor
3. **Component Selection**: Switch's `getComponentName()` method parses `location.hash` using regex `/^#([^\/]+)/`
4. **Component Mapping**: Returns component name from `knownComponents` map or falls back to `data-default`
5. **Early Exit**: If `getComponentName()` returns `null`, switch does nothing (prevents unnecessary loads)
6. **Component Swap**: Old component destroyed via `destroyed()`, new component loaded into switch container

**Advanced: Custom getComponentName**

Override `getComponentName()` for complex routing logic:

```javascript
W.switch('user_switch', {
  knownComponents: {
    'info': 'user_info',
    'settings': 'user_settings'
  },

  getComponentName: function() {
    // Parse nested route: #user/123/info
    const match = /^#user\/\d+\/([^\/]+)/.exec(location.hash);

    // Return null to prevent switch from loading
    // (useful when hash doesn't match this switch's pattern)
    if (!match) return null;

    const subPage = match[1];
    return this.knownComponents[subPage] || this.defaultComponentName;
  }
});
```

**Nested Routing Example:**

```javascript
// Main switch handles top-level routes
W.switch('main_switch', {
  knownComponents: {
    'home': 'home_page',
    'user': 'user_page'  // user_page contains user_switch
  }
});

// User switch handles user sub-routes
W.switch('user_switch', {
  knownComponents: {
    'info': 'user_info',
    'settings': 'user_settings'
  },
  getComponentName: function() {
    const match = /^#user\/\d+\/([^\/]+)/.exec(location.hash);
    if (!match) return null;  // Not a user sub-route
    return this.knownComponents[match[1]] || this.defaultComponentName;
  }
});
```

**Navigation Flow:**
- `#home` → main_switch loads `home_page`
- `#user/123/info` → main_switch loads `user_page`, user_switch loads `user_info`
- `#user/123/settings` → user_switch swaps to `user_settings` (user_page stays)

**Key Points:**

- Switches manage a **single component container** that swaps components
- Only **one component is active** in a switch at a time
- Previous component is **destroyed** when switching via `destroyed()` lifecycle
- `data-default` attribute sets fallback component
- **Return `null`** from `getComponentName()` to prevent unnecessary loads
- Hash format: `#component-key` maps to component via `knownComponents`
- Multiple switches enable **nested routing** (parent + child switches)
- Switches automatically clean up via `app.ev.remove(this)` when destroyed

## Quick Reference

### Essential Component Methods

| Method | Purpose | When Called | Must Call cb() |
|--------|---------|-------------|----------------|
| `init()` | One-time setup, subscriptions | Component creation | No |
| `getData(cb)` | Provide data for template | Before each render | Yes |
| `rendered(cb)` | DOM manipulation, event handlers | After render | Yes |
| `load(cb, param)` | Trigger re-render cycle | Manual call | Optional |
| `cleanup()` | Custom cleanup logic | Called by `destroyed()` | No |
| `destroyed()` | Framework cleanup, calls `cleanup()` | Component removal | No |

### Component Properties

| Property | Description | Example |
|----------|-------------|---------|
| `this.el` | Component's DOM element | `$(this.el).find('.button')` |
| `this.app` | Reference to app instance | `this.app.name` |
| `this.parent` | Parent component | `this.parent.load()` |
| `this.children` | Array of child components | `this.children[0].load()` |

### App Instance API

```javascript
// EventBus (app.ev) - Component Communication
this.app.ev.emit('event.name', { key: 'value' }, this);
this.app.ev.on('event.name', (data, emitter) => { ... }, this);
this.app.ev.off('event.name', this);
this.app.ev.remove(this);

// Data Management (app.data)
this.app.data.register('dataKey', (cb) => { cb(data); });
this.app.data.fetch(['key1', 'key2'], (results) => { ... });
this.app.data.get('dataKey');
this.app.data.refresh('dataKey');
this.app.data.on('dataKey', (data, emitter) => { ... }, this);
this.app.data.emit('dataKey', data, this);

// Navigation (app.nav)
this.app.nav.on((event, emitter) => { ... }, this);
```

### Common jQuery Patterns in rendered()

```javascript
rendered: function(cb) {
  const $container = $(this.el);

  // Click handler
  $container.find('.btn').on('click', (ev) => {
    const id = $(ev.currentTarget).data('id');
    this.app.ev.emit('button.clicked', { id }, this);
  });

  // Input change
  $container.find('input').on('input', (ev) => {
    this.someValue = ev.target.value;
  });

  // Form submit
  $container.find('form').on('submit', (ev) => {
    ev.preventDefault();
    // Handle form
  });

  cb(); // Always call!
}
```

### Development Workflow

```bash
# Build framework bundles (outputs dist/whirlpool.*)
npm run build

# Rebuild example bundles after updating src/
npm run webpack

# Run the todo example dev server
cd examples/todo && npm install && npm start
```

### File Checklist for New Component

- [ ] Create `src/js/component/my_component.js`
- [ ] Create `src/js/template/my_component.html`
- [ ] Import in `src/js/index.js`
- [ ] Add `<div data-component="my_component"></div>` to HTML/template
- [ ] Implement `getData(cb)` - provide data
- [ ] Implement `rendered(cb)` - add event handlers with arrow functions
- [ ] Call `cb()` in both `getData` and `rendered`

---

This documentation provides a comprehensive foundation for building applications with the Whirlpool framework, emphasizing its component-based architecture, event-driven communication, and best practices learned from real-world usage.
