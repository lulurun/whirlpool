# Shopping Cart Example

This example demonstrates a shopping cart application with shared data management featuring:

- **Centralized data management**: Multiple components share data using `app.data`
- **Reactive updates**: Components automatically reload when data changes
- **Add to cart**: Click product buttons to add items to the cart
- **Cart management**: View cart summary, adjust quantities, and remove items
- **Real-time statistics**: Stats update automatically based on products and cart data

## Running the Example

1. Navigate to the example directory:
   ```bash
   cd examples/shopping-cart
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
examples/shopping-cart/
├── src/
│   ├── html/
│   │   └── index.html          # Main HTML template
│   └── js/
│       ├── component/
│       │   ├── product_list.js # Product listing component
│       │   ├── cart_summary.js # Cart summary component
│       │   ├── cart_details.js # Cart details component
│       │   └── stats.js        # Statistics component
│       ├── template/
│       │   ├── product_list.html
│       │   ├── cart_summary.html
│       │   ├── cart_details.html
│       │   └── stats.html
│       ├── data.js             # Shared data sources
│       └── index.js            # App entry point
├── public/                     # Built files (generated)
├── webpack.common.js           # Webpack common config
├── webpack.dev.js              # Webpack dev config
├── webpack.prod.js             # Webpack prod config
└── package.json                # Dependencies and scripts
```

## How Data Sharing Works in Whirlpool

### 1. Registering Shared Data Sources

The `app.data` API allows you to register centralized data sources that multiple components can access. In `data.js`, register data sources using `app.data.register()`:

```javascript
// Products data - shared across multiple components
app.data.register('products', (cb) => {
  // Fetch function - can be async, API call, etc.
  setTimeout(() => {
    const products = [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Mouse', price: 25 }
    ];
    cb(products);
  }, 100);
});

// Shopping cart data - shared across multiple components
app.data.register('cart', (cb) => {
  cb([]); // Initialize with empty cart
});
```

The first parameter is the data source name (key), and the second is a fetch function that provides the data via callback.

### 2. Subscribing to Data Changes

Components subscribe to data sources in their `init()` method using `app.data.on()`:

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

- **First parameter**: The data source key to subscribe to
- **Second parameter**: Callback function that receives updated data
- **Third parameter**: The listener (typically `this`) for cleanup purposes

When subscribed data changes, the callback is automatically invoked, allowing the component to react (often by calling `this.load()` to re-render).

### 3. Emitting Data Changes

When any component modifies shared data, it should emit the change using `app.data.emit()`:

```javascript
// In product_list component - add item to cart
const newCart = [...cart, newItem];

// Emit cart change - all components listening to 'cart' will be notified
this.app.data.emit('cart', newCart, this);
```

- **First parameter**: The data source key
- **Second parameter**: The updated data
- **Third parameter**: The emitter (typically `this`) to identify which component triggered the change

All components subscribed to that data source will receive the update and can react accordingly.

### 4. Multiple Components Sharing Data

Multiple components can subscribe to the same data source, enabling synchronized UI updates:

- **product_list**: Subscribes to `'products'` and `'cart'` to display products and show which items are in the cart
- **cart_summary**: Subscribes to `'cart'` to display total items and price
- **cart_details**: Subscribes to `'cart'` to show detailed cart items with controls
- **stats**: Subscribes to both `'products'` and `'cart'` to calculate combined statistics

When one component emits a data change, all subscribed components automatically receive the update.

### 5. Component Lifecycle and Cleanup

The framework automatically cleans up data subscriptions when components are destroyed. This is why you pass `this` as the third parameter to `app.data.on()` - it allows the framework to track and remove subscriptions during component cleanup.

### 6. Data Flow Example

Here's how data flows when a user adds a product to the cart:

1. User clicks "Add to Cart" button in `product_list` component
2. Click handler in `product_list.rendered()` executes
3. Handler updates cart data and calls `app.data.emit('cart', newCart, this)`
4. Framework notifies all subscribers of the `'cart'` data change
5. `cart_summary`, `cart_details`, and `stats` all receive the update
6. Each subscribed component reloads automatically
7. UI updates across all components simultaneously
