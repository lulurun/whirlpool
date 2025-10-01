# Whirlpool Framework

A lightweight, component-based JavaScript framework for building modular web applications with event-driven architecture.

## Overview

Whirlpool is a minimalist framework that provides:
- **Component-based architecture** with automatic lifecycle management
- **Event-driven communication** between components using publish/subscribe pattern
- **Template-based rendering** with Handlebars integration
- **Automatic DOM binding** and component instantiation
- **Hierarchical component structure** with parent-child relationships

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

#### Event Communication
- `subscribe(topic, handler)` - Subscribe to events from other components
- `publish(topic, data)` - Publish events to other components

#### Framework Properties
- `this.el` - DOM element of the component
- `this.app` - Reference to the main application
- `this.parent` - Reference to parent component
- `this.children` - Array of child components

## Component Definition Pattern

```javascript
W.component('component-name', {
  init: function() {
    // Initialization logic - called once
    // Set up subscriptions, initialize data accessors
    this.data_accessor = new DataAccessor();

    // Subscribe to events
    this.subscribe('data.updated', (data) => {
      this.load(); // Reload component when data changes
    });
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

    // Event handlers
    $container.find('.button').on('click', () => {
      this.handleClick();
    });

    cb(); // Always call callback when done
  },

  // Custom methods (NOT bound to component object)
  handleClick: function() {
    // Custom component methods
    this.publish('button.clicked', { id: 'example' });
  }
});
```

## Framework Limitations

**Important:** Only framework-reserved methods are bound to the component object. Custom methods like `this.fetchData()` will cause "no such method" errors.

**Solution:** Use external classes for complex logic:

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

## Event-Driven Communication

### Publishing Events
```javascript
// In component method
this.publish('action.completed', {
  type: 'delete',
  items: ['item1', 'item2']
});
```

### Subscribing to Events
```javascript
// In component init
this.subscribe('action.completed', (data) => {
  if (data.type === 'delete') {
    this.load(); // Reload component
  }
});
```

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

## DOM Integration

### Component Declaration
```html
<!-- HTML markup -->
<div data-component="my-component"></div>
<div data-component="child-component"></div>
```

### Automatic Instantiation
Whirlpool automatically:
1. Scans for `data-component` attributes
2. Creates component instances
3. Calls component lifecycle methods
4. Manages parent-child relationships

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

## Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Event Communication**: Use events for component communication, not direct method calls
3. **State Management**: Keep UI state in components, data state in data accessors
4. **Lifecycle Management**: Use `init()` for setup, `rendered()` for DOM manipulation

### Data Management
1. **Separation of Concerns**: Use external classes for data access and processing
2. **Caching**: Cache processed data and only re-process when necessary
3. **Smart Updates**: Use events to trigger selective updates rather than full page reloads

### Event Patterns
1. **Descriptive Names**: Use clear event names like `data.updated`, `action.hide`
2. **Data Payloads**: Include relevant data in event payloads
3. **Type Discrimination**: Use type fields in events for different update types

## Real-World Example: Results Component

```javascript
// Data accessor for external data handling
class ResultsDataAccessor {
  constructor() {
    this.rawData = null;
    this.flattenedData = null;
  }

  fetchData(callback) {
    $.get('/api/results')
      .done(data => {
        this.rawData = data;
        this.flattenedData = this.flattenData(data);
        if (callback) callback();
      });
  }

  flattenData(data) {
    // Process and flatten data
    return { run_logs: [], columns: [] };
  }

  getFlattenedData() {
    return this.flattenedData || { run_logs: [], columns: [] };
  }
}

W.component('results', {
  init: function() {
    this.data_accessor = new ResultsDataAccessor();
    this.sortColumn = null;
    this.sortDirection = 'asc';

    // Subscribe to updates from other components
    this.subscribe('data.updated', (data) => {
      if (data.type === 'results') {
        this.data_accessor.fetchData(() => {
          this.load();
        });
      } else {
        this.load(); // Reload with existing data
      }
    });

    // Initial data fetch
    this.data_accessor.fetchData(() => {
      this.load();
    });
  },

  getData: function(cb) {
    const flattenedData = this.data_accessor.getFlattenedData();

    // Apply sorting and filtering at component level
    let processedData = this.applySorting(flattenedData);
    processedData = this.applyFiltering(processedData);

    cb(processedData);
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Sort handler
    $container.find('.sortable-header').on('click', (ev) => {
      const column = $(ev.currentTarget).data('column');
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      this.load();
    });

    // Selection handler
    $container.find('.row-select').on('change', () => {
      const selectedItems = [];
      $container.find('.row-select:checked').each(function() {
        selectedItems.push($(this).data('id'));
      });

      // Publish selection to other components
      this.publish('results.selected', { items: selectedItems });
    });

    cb();
  }
});
```

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

### Event System
- Global publish/subscribe system
- Components can subscribe to any topic
- Events flow between components without tight coupling
- Event payloads carry relevant data for updates

This documentation provides a foundation for building applications with the Whirlpool framework, emphasizing its component-based architecture, event-driven communication, and best practices learned from real-world usage.