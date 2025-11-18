# Router Example

This example demonstrates a user preferences manager with the following features:

- **Hash-based routing**: Navigate between pages without reloading
- **Nested routing**: Sub-routes within routes (e.g., user info and settings tabs)
- **URL parameters**: Extract and use user ID from the URL hash
- **Dynamic component loading**: Switch components based on URL patterns
- **User management**: List view and per-user detail pages with tabs

## Running the Example

1. Navigate to the example directory:
   ```bash
   cd examples/router
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
examples/router/
├── src/
│   ├── html/
│   │   └── index.html          # Main HTML template
│   └── js/
│       ├── switch/
│       │   ├── main_switch.js  # Main router switch
│       │   └── user_switch.js  # Nested user router switch
│       ├── component/
│       │   ├── home_page.js    # Home page component
│       │   ├── about_page.js   # About page component
│       │   ├── user_list.js    # User list component
│       │   ├── user_page.js    # User detail page component
│       │   ├── user_info.js    # User info tab component
│       │   └── user_settings.js # User settings tab component
│       ├── template/
│       │   ├── home_page.html
│       │   ├── about_page.html
│       │   ├── user_list.html
│       │   ├── user_page.html
│       │   ├── user_info.html
│       │   └── user_settings.html
│       └── index.js            # App entry point
├── public/                     # Built files (generated)
├── webpack.common.js           # Webpack common config
├── webpack.dev.js              # Webpack dev config
├── webpack.prod.js             # Webpack prod config
└── package.json                # Dependencies and scripts
```

## How Routing Works in Whirlpool

### 1. Application Entry Points

**index.html**: The main HTML file for your application
- Customize the `<body>` section based on your app's needs
- The `<head>` and `<script>` sections should be sufficient for most cases - they include `whirlpool.js`
- The app bundle JavaScript built by webpack will be automatically embedded by webpack

**index.js**: The application entry point
- Import all component JavaScript files here
- Import all switch JavaScript files here
- Import any utility JavaScript files defined by your app
- The rest of the `index.js` boilerplate should be sufficient for most cases

### 2. Switch Definition

A Switch is a special component that acts as a router. Define switches with `W.switch('switchName', {...})`:

- **`knownComponents`**: An object mapping hash fragments to component names. For example, `{'home': 'home_page'}` maps `#home` to the `home_page` component.

- **`getComponentName()`**: A function that determines which component to load based on the current URL hash. This is called whenever the hash changes. Return the name of the component to load, or use `this.defaultComponentName` for fallback.

- **`defaultComponentName`**: The component to load when no match is found. Defaults to the first component in `knownComponents`.

### 3. Switch Instantiation

To use a switch, place a `<div data-switch="switchName"></div>` element in your HTML:

- The Whirlpool framework automatically detects these elements and instantiates the switches
- When the URL hash changes, the switch evaluates `getComponentName()` to determine which component to load
- The framework destroys the previous component and loads the new one into the switch container
- Switches can be nested: a component loaded by one switch can contain another switch element for nested routing

### 4. Custom Route Matching

Use the `getComponentName()` method to implement custom routing logic:

```javascript
getComponentName: function() {
  const hash = location.hash;

  // Match patterns like #user/123
  const userMatch = /^#user\/(\d+)/.exec(hash);
  if (userMatch) {
    return 'user_page';
  }

  // Extract first segment: #about → 'about'
  const match = /^#([^\/]+)/.exec(hash);
  const key = (match && match[1]) || '';
  return this.knownComponents[key] || this.defaultComponentName;
}
```

### 5. Extracting URL Parameters

Components can extract parameters from the URL hash in their `init()` method:

```javascript
init: function() {
  const match = /^#user\/(\d+)/.exec(location.hash);
  this.userId = match ? parseInt(match[1]) : null;
}
```

### 6. Nested Routing Example

This example demonstrates two-level routing:

**Level 1** (main_switch): Routes like `#home`, `#about`, `#user_list`, `#user/123/...`
- Maps simple hashes to pages
- Detects user detail URLs and loads the `user_page` component

**Level 2** (user_switch): Routes like `#user/123/info`, `#user/123/settings`
- Nested inside the `user_page` component template
- Handles sub-navigation within a user's detail page
- Extracts the sub-page from the hash to determine which tab component to load
