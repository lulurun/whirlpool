# Whirlpool Framework - Quick Start Guide

This boilerplate provides a complete starter template for building applications with the Whirlpool framework.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   This will start the webpack dev server at `http://localhost:3000` with hot reloading.

3. **Build for production:**
   ```bash
   npm run build
   ```
   This creates an optimized build in the `dist/` folder.

4. **Development mode with watch:**
   ```bash
   npm run dev
   ```
   Builds the project and watches for changes without starting a server.

## 📁 Project Structure

```
boilerplate/
├── public/
│   └── index.html              # Main HTML template
├── src/
│   ├── css/
│   │   └── styles.css          # Application styles
│   ├── js/
│   │   ├── index.js            # Main entry point
│   │   └── components/         # Whirlpool components
│   │       ├── app.js          # Main application component
│   │       ├── data_table.js   # Data table with sorting/filtering
│   │       ├── search_box.js   # Search input component
│   │       └── pagination.js   # Pagination component
│   └── templates/              # Handlebars templates
│       ├── app.hbs             # Main app template
│       ├── data_table.hbs      # Data table template
│       ├── search_box.hbs      # Search box template
│       └── pagination.hbs      # Pagination template
├── package.json                # Dependencies and scripts
├── webpack.config.js           # Webpack configuration
├── .babelrc                    # Babel configuration
└── QUICK_START.md             # This file
```

## 🧩 Understanding the Components

### 1. App Component (`src/js/components/app.js`)
- **Purpose**: Main application container and navigation
- **Template**: `src/templates/app.hbs`
- **Features**:
  - Page navigation
  - Layout management
  - Child component orchestration

### 2. Data Table Component (`src/js/components/data_table.js`)
- **Purpose**: Display tabular data with advanced features
- **Template**: `src/templates/data_table.hbs`
- **Features**:
  - Sortable columns (click headers)
  - Row selection with checkboxes
  - Row/column highlighting on click
  - Search filtering integration
  - Sample data generation
- **Data Access Pattern**: Uses `DataTableAccessor` class for data management

### 3. Search Box Component (`src/js/components/search_box.js`)
- **Purpose**: Provide search/filtering functionality
- **Template**: `src/templates/search_box.hbs`
- **Features**:
  - Debounced input (300ms)
  - Clear button when has value
  - Enter key submission
  - Publishes `search.changed` events

### 4. Pagination Component (`src/js/components/pagination.js`)
- **Purpose**: Handle data pagination and selection display
- **Template**: `src/templates/pagination.hbs`
- **Features**:
  - Page navigation
  - Items per page selection
  - Selection count display
  - Responsive design

## 🔄 Event-Driven Communication

Components communicate through Whirlpool's publish/subscribe system:

### Events Flow
```
Search Box → search.changed → Data Table (filters data)
Data Table → selection.changed → Pagination (shows selection count)
Pagination → page.changed → Data Table (changes page)
```

### Key Events
- `search.changed`: When search term changes
- `selection.changed`: When table row selection changes
- `page.changed`: When pagination changes
- `search.submitted`: When Enter is pressed in search

## 🎨 Templates & Handlebars

### Template Processing
- Templates are processed by **Handlebars** during webpack build
- Located in `src/templates/` with `.hbs` extension
- Automatically imported in component files

### Template Features
- **Conditional rendering**: `{{#if condition}}`
- **Loops**: `{{#each items}}`
- **Custom helpers**: `ifEqual`, `unless`
- **Bootstrap integration**: Responsive classes included

### Example Template Usage
```handlebars
{{#if hasItems}}
  <div class="table-responsive">
    <table class="table">
      {{#each items}}
        <tr>
          <td>{{name}}</td>
          <td>
            <span class="badge bg-{{#ifEqual status 'Active'}}success{{else}}secondary{{/ifEqual}}">
              {{status}}
            </span>
          </td>
        </tr>
      {{/each}}
    </table>
  </div>
{{else}}
  <p>No items found</p>
{{/if}}
```

## 📱 Responsive Design

The boilerplate includes:
- **Bootstrap 5** for responsive grid and components
- **Mobile-first** approach
- **Responsive tables** with horizontal scrolling
- **Flexible component layout**

## 🛠 Development Workflow

### Adding New Components

1. **Create component file**: `src/js/components/my_component.js`
   ```javascript
   import myTemplate from '../../templates/my_component.hbs';

   W.component('my-component', {
     init: function() {
       // Initialization
     },

     getData: function(cb) {
       cb({ message: 'Hello World' });
     },

     getTemplate: function(cb) {
       cb(myTemplate);
     },

     rendered: function(cb) {
       // DOM manipulation
       cb();
     }
   });
   ```

2. **Create template**: `src/templates/my_component.hbs`
   ```handlebars
   <div class="my-component">
     <h3>{{message}}</h3>
   </div>
   ```

3. **Import in index.js**: Add `import './components/my_component.js';`

4. **Use in parent template**: `<div data-component="my-component"></div>`

### Data Management Pattern

For components with complex data needs:

```javascript
// External data accessor class
class MyDataAccessor {
  constructor() {
    this.data = null;
  }

  fetchData(callback) {
    // API calls, data processing
    callback();
  }

  getData() {
    return this.data;
  }
}

W.component('my-component', {
  init: function() {
    this.data_accessor = new MyDataAccessor();
    this.data_accessor.fetchData(() => {
      this.load();
    });
  }
});
```

### Event Communication

```javascript
// Publishing events
this.publish('event.name', { data: 'value' });

// Subscribing to events (in init method)
this.subscribe('event.name', (data) => {
  // Handle event
  this.load(); // Reload component if needed
});
```

## 🎯 Best Practices

### Component Design
1. **Single Responsibility**: Each component has one clear purpose
2. **Event Communication**: Use events instead of direct method calls
3. **External Data Classes**: Use DataAccessor pattern for complex data
4. **Arrow Functions**: Always use `() => {}` in event handlers to preserve `this`

### Performance
1. **Debounced Input**: Search input uses 300ms debounce
2. **Data Caching**: DataAccessor classes cache processed data
3. **Smart Reloading**: Only reload components when necessary

### Code Organization
1. **Consistent Structure**: Follow the established folder structure
2. **Clear Naming**: Use descriptive component and event names
3. **Template Separation**: Keep templates in separate `.hbs` files
4. **CSS Organization**: Group related styles together

## 🔧 Configuration

### Webpack
- **Entry point**: `src/js/index.js`
- **Output**: `dist/bundle.js`
- **Dev server**: Port 3000 with hot reloading
- **Loaders**: Babel, CSS, Handlebars

### Dependencies
- **Whirlpool**: Framework core (from `../dist/whirlpool.js`)
- **jQuery**: Required for Whirlpool
- **Handlebars**: Template processing
- **Bootstrap**: UI framework (CDN)

## 🚀 Production Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your web server

3. **Server requirements**:
   - Static file serving
   - Single Page Application routing (optional)

## 🆘 Troubleshooting

### Common Issues

1. **Component not loading**:
   - Check import in `index.js`
   - Verify component name matches `data-component` attribute
   - Check console for JavaScript errors

2. **Template not rendering**:
   - Verify `.hbs` file exists
   - Check Handlebars syntax
   - Ensure template is imported in component

3. **Events not working**:
   - Use arrow functions in event handlers: `() => {}`
   - Subscribe to events in `init()` method
   - Check event names match between publish/subscribe

4. **Build errors**:
   - Run `npm install` to ensure dependencies
   - Check webpack.config.js for path issues
   - Verify all imports have correct file paths

### Debug Tips
- Use browser developer tools console
- Add `console.log()` in component methods
- Check Network tab for failed resource loads
- Use Vue/React dev tools are NOT applicable (this is Whirlpool)

## 📚 Next Steps

1. **Explore the demo**: Run `npm start` and interact with the data table
2. **Modify components**: Change templates and see live updates
3. **Add new features**: Try adding filters, export functionality
4. **Read the main README**: Check `../README.md` for complete framework documentation
5. **Build your app**: Replace demo components with your own business logic

---

Happy coding with Whirlpool! 🌊