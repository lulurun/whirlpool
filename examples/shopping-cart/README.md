# Shopping Cart Example - Data Sharing with app.data

This example demonstrates how multiple components can share data using the `app.data` API in Whirlpool framework.

## Key Concepts Demonstrated

### 1. Registering Shared Data Sources

In `index.js`, we register two shared data sources:

```javascript
// Products data - shared across multiple components
app.data.register('products', (cb) => {
  // Fetch function - simulates API call
  setTimeout(() => {
    const products = [...];
    cb(products);
  }, 100);
});

// Shopping cart data - shared across multiple components
app.data.register('cart', (cb) => {
  cb([]); // Initialize empty cart
});
```

### 2. Subscribing to Data Changes

Each component subscribes to the data it needs in its `init()` method:

```javascript
W.component('cart_summary', {
  init: function() {
    // Subscribe to cart changes
    this.app.data.on('cart', (data) => {
      console.log('cart_summary: cart updated', data);
      this.load(); // Reload component when cart changes
    }, this);
  }
});
```

### 3. Emitting Data Changes

When data changes, any component can emit the update using `app.data.emit()`:

```javascript
// In product_list component - add to cart
const newCart = [...cart, newItem];

// Emit cart change - all components listening to 'cart' will update
this.app.data.emit('cart', newCart, this);
```

### 4. Multiple Components Sharing Same Data

- **product_list** - Listens to both 'products' and 'cart' to show product availability and cart status
- **cart_summary** - Listens to 'cart' to display item count and total price
- **cart_details** - Listens to 'cart' to show cart items with quantity controls
- **stats** - Listens to BOTH 'products' and 'cart' to calculate combined statistics

## Data Flow

```
User clicks "Add to Cart" in product_list
  ↓
product_list.rendered() handles click
  ↓
Updates cart data and calls: app.data.emit('cart', newCart, this)
  ↓
Framework notifies ALL subscribers of 'cart' data change
  ↓
cart_summary, cart_details, and stats all reload automatically
  ↓
UI updates across all components simultaneously
```

## Components Overview

### product_list
- **Subscribes to:** 'products', 'cart'
- **Emits:** 'cart' (when adding items)
- **Purpose:** Display products and handle adding to cart

### cart_summary
- **Subscribes to:** 'cart'
- **Emits:** 'cart' (when clearing cart)
- **Purpose:** Show cart totals and item count

### cart_details
- **Subscribes to:** 'cart'
- **Emits:** 'cart' (when removing items or changing quantities)
- **Purpose:** Display cart items with quantity controls

### stats
- **Subscribes to:** 'products', 'cart'
- **Emits:** Nothing
- **Purpose:** Calculate and display statistics from multiple data sources

## Running the Example

```bash
cd examples/shopping-cart
npm install
npm start
```

Open browser to `http://localhost:8080` and watch the browser console to see data sharing in action!

## Key Takeaways

1. **Centralized State**: `app.data` provides a centralized way to manage shared state
2. **Reactive Updates**: Components automatically reload when subscribed data changes
3. **Decoupled Components**: Components don't need to know about each other - they only know about data keys
4. **Multiple Subscribers**: Any number of components can subscribe to the same data
5. **Multiple Data Sources**: Components can subscribe to multiple data sources (like 'stats' does)
6. **Simple API**: Just three methods needed: `register()`, `on()`, and `emit()`
