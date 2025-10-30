# Whirlpool Tutorial

An interactive tutorial demonstrating the core concepts of the Whirlpool framework.

## What You'll Learn

This tutorial guides you through the essential features of Whirlpool with 4 progressive steps:

### Step 1: Component Loading
- How components are loaded by the framework
- How data is passed to templates for rendering
- How components can be nested within each other

### Step 2: Counter
- Managing internal component state
- Defining and handling user interactions (click events)
- Updating component state reactively

### Step 3: Event Communication with app.ev
- Publishing events using `app.ev.emit()`
- Subscribing to events using `app.ev.on()`
- Understanding event-driven architecture
- Decoupled component communication
- Multiple components reacting to the same event

### Step 4: Shared Data with app.data
- Registering data sources with `app.data.register()`
- Fetching data with `app.data.fetch()`
- Getting cached data with `app.data.get()`
- Subscribing to data updates with `app.data.on()`
- Refreshing data with `app.data.refresh()`
- Understanding centralized state management
- Multiple components sharing the same data
- Reactive data updates

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

This will open the tutorial at http://localhost:8080

### Production Build

Build for production:

```bash
npm run build
```

The built files will be in the `public/` directory.

## Project Structure

```
tutorial/
├── src/
│   ├── html/
│   │   └── index.html              # Main HTML entry point
│   └── js/
│       ├── index.js                # App entry and data registration
│       ├── component/              # Component JavaScript files
│       │   ├── tutorial_nav.js     # Navigation component
│       │   ├── step1_parent.js     # Step 1 parent component
│       │   ├── step1/              # Step 1 components
│       │   ├── step2_parent.js     # Step 2 parent component
│       │   ├── step2/              # Step 2 components
│       │   ├── step3_parent.js     # Step 3 parent component
│       │   ├── step3/              # Step 3 components
│       │   ├── step4_parent.js     # Step 4 parent component
│       │   └── step4/              # Step 4 components
│       └── template/               # Handlebars templates
├── public/                         # Build output directory
├── package.json
├── webpack.common.js               # Webpack base config
├── webpack.dev.js                  # Development config
└── webpack.prod.js                 # Production config
```

## How It Works

The tutorial is itself a Whirlpool application! It demonstrates the framework's philosophy:

1. **Component-based architecture**: The tutorial is broken down into small, focused components
2. **Isolated components**: Each step's components work independently
3. **Framework orchestration**: Whirlpool handles component loading and rendering
4. **Client-side routing**: Uses Switch component for navigation between steps

Navigate through the steps using the sidebar menu to learn each concept interactively.

## Key Concepts Demonstrated

### Component Lifecycle
- `init()` - One-time setup and subscriptions
- `getData(cb)` - Provide data for template rendering
- `rendered(cb)` - DOM manipulation and event handlers

### Event-Driven Communication
- Components communicate without knowing about each other
- Publish-subscribe pattern using `app.ev`
- Decoupled architecture for maintainability

### Centralized Data Management
- Single source of truth using `app.data`
- Automatic synchronization across components
- Reactive updates when data changes

## Next Steps

After completing this tutorial, explore the example applications:

- **Shopping Cart** - Advanced app.data usage with multiple components
- **Workspace Console** - Complex user management interface
- **Trading Orderbook** - Real-time data updates
- **Dynamic Form** - Recursive components and nested data structures

## Learn More

- [Whirlpool Documentation](../../docs/reference.md)
- [Framework GitHub Repository](https://github.com/gree/whirlpool)
