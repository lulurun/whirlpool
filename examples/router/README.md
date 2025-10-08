# Whirlpool Router Example - User Preferences Manager

This example demonstrates how to use Whirlpool's **Switch** component for client-side routing, including **nested routing** with multiple switch levels.

## Features

- **Hash-based routing** using Switch components
- **Nested routing** - switches within switches
- **Custom getComponentName()** logic for dynamic routes
- **URL parameter extraction** from hash (e.g., user ID)
- User management with list and detail views
- Per-user settings and info pages
- No page reloads - smooth SPA navigation

## How It Works

### Switch Component

The Switch component acts as a router:

1. **URL Hash Detection**: Listens to `popstate` events for hash changes
2. **Component Mapping**: Maps hash values to component names via `knownComponents`
3. **Component Loading**: Loads the appropriate component into the switch container
4. **Component Destruction**: Destroys the previous component when switching

## Routing Architecture

This example uses **two levels of routing**:

### Level 1: Main Switch (Top-level routes)

```javascript
W.switch('main_switch', {
  knownComponents: {
    'home': 'home_page',
    'about': 'about_page',
    'user_list': 'user_list'
  },

  getComponentName: function() {
    const hash = location.hash;

    // Check if it's a user detail page: #user/123/...
    const userMatch = /^#user\/(\d+)/.exec(hash);
    if (userMatch) {
      return 'user_page';
    }

    // Default: extract first segment
    const match = /^#([^\/]+)/.exec(hash);
    const key = (match && match[1]) || '';
    return this.knownComponents[key] || this.defaultComponentName;
  }
});
```

**Routes:**
- `#home` → `home_page` component
- `#about` → `about_page` component
- `#user_list` → `user_list` component (shows all users)
- `#user/123/...` → `user_page` component (user detail page)

### Level 2: User Switch (Nested routes)

The `user_page` component contains a **nested switch** for sub-pages:

```javascript
W.switch('user_switch', {
  knownComponents: {
    'info': 'user_info',
    'settings': 'user_settings'
  },

  getComponentName: function() {
    const hash = location.hash;

    // Parse: #user/123/info -> extract "info"
    const match = /^#user\/\d+\/([^\/]+)/.exec(hash);

    if (match) {
      const subPage = match[1];
      return this.knownComponents[subPage] || this.defaultComponentName;
    }

    return this.defaultComponentName;
  }
});
```

**Nested Routes:**
- `#user/1/info` → `user_info` component
- `#user/1/settings` → `user_settings` component
- `#user/2/info` → `user_info` component (different user)
- `#user/2/settings` → `user_settings` component (different user)

## URL Structure

```
#user_list                  → User list page
#user/1/info               → User 1 - Info tab
#user/1/settings           → User 1 - Settings tab
#user/2/info               → User 2 - Info tab
#user/2/settings           → User 2 - Settings tab
```

### How Parameters Are Extracted

Components extract the user ID from the hash in their `init()` method:

```javascript
init: function() {
  const match = /^#user\/(\d+)/.exec(location.hash);
  this.userId = match ? parseInt(match[1]) : null;
}
```

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

4. The app will open at http://localhost:8080

## Building for Production

```bash
npm run build
```

Output files will be in the `public/` directory.

## Project Structure

```
examples/router/
├── src/
│   ├── html/
│   │   └── index.html                   # Main HTML with navigation
│   └── js/
│       ├── switch/
│       │   ├── main_switch.js           # Level 1: Main router
│       │   └── user_switch.js           # Level 2: User sub-router
│       ├── component/
│       │   ├── home_page.js             # Home page
│       │   ├── about_page.js            # About page
│       │   ├── user_list.js             # User list page
│       │   ├── user_page.js             # User detail page (container)
│       │   ├── user_info.js             # User info sub-page
│       │   └── user_settings.js         # User settings sub-page
│       ├── template/
│       │   ├── home_page.html
│       │   ├── about_page.html
│       │   ├── user_list.html
│       │   ├── user_page.html           # Contains user_switch
│       │   ├── user_info.html
│       │   └── user_settings.html
│       └── index.js                     # App entry point
├── public/
│   └── whirlpool.min.js                # Whirlpool framework
├── package.json
└── webpack configs
```

## Key Concepts Demonstrated

1. **Nested Routing**: Two-level switch hierarchy (main → user)
2. **Custom getComponentName()**: Dynamic route parsing with regex
3. **URL Parameters**: Extracting user ID from hash
4. **Component Communication**: Passing context via hash parameters
5. **Switch Registration**: Multiple switches in one app
6. **Component Lifecycle**: Components destroyed on route change
7. **Default Routes**: Fallback components for invalid URLs

## Navigation Flow

```
User clicks "Users" nav link
  → #user_list
  → main_switch loads user_list component
  → Shows list of users

User clicks on "Alice Johnson"
  → #user/1/info
  → main_switch detects /user/\d+/ pattern
  → main_switch loads user_page component
  → user_page contains user_switch
  → user_switch detects /info pattern
  → user_switch loads user_info component
  → Shows Alice's info

User clicks "Settings" tab
  → #user/1/settings
  → main_switch still shows user_page (no change)
  → user_switch detects /settings pattern
  → user_switch swaps user_info → user_settings
  → Shows Alice's settings
```

## Try It

1. **User List**: Click "Users" to see all users
2. **User Details**: Click on a user to view their profile
3. **Sub-navigation**: Switch between Info and Settings tabs
4. **Different Users**: Navigate to different users and see data updates
5. **Browser Navigation**: Use back/forward buttons - routing works!
6. **Page Refresh**: Refresh on any URL - current route is preserved
7. **Console Logging**: Check console when changing settings
