# Example 14: Data Table

A sophisticated data table component that displays nested JSON objects in a flattened, sortable, and customizable table format with column visibility management.

## Features

- **JSON Flattening**: Automatically flattens nested objects (e.g., `{a: {b: 1}}` → `"a.b": 1`)
- **Sortable Columns**: Click any column header to sort (toggles between ascending/descending), including ID column
- **Cell Selection**: Click cells to select, highlights entire row and column
- **Column Visibility**: Hide/show columns with x/+ buttons
- **LocalStorage Persistence**: Hidden column preferences are saved across sessions
- **ID Column**: Specified ID column always displayed first and cannot be hidden
- **Alphabetical Ordering**: Non-ID columns displayed in alphabetical order
- **Formatted Names**: Dotted keys displayed with spaces (e.g., "contact email" instead of "contact.email")

## Running the Example

```bash
cd examples/14-data-table
npm install
npm start
```

The application will open at `http://localhost:8080`

## Building for Production

```bash
npm run build
```

Output will be in the `public/` directory.

## Project Structure

```
14-data-table/
├── src/
│   ├── html/
│   │   └── index.html                 # Main HTML
│   └── js/
│       ├── index.js                   # App entry point with app.data registration
│       ├── component/
│       │   ├── data_table.js          # Main table component
│       │   └── hidden_columns.js      # Hidden columns manager
│       ├── template/
│       │   ├── data_table.html        # Table template
│       │   └── hidden_columns.html    # Hidden columns template
│       └── util/
│           ├── api.js                 # API module (simulates fetching)
│           ├── mockData.js            # Mock table data
│           ├── dataFlattener.js       # JSON flattening utility
│           └── hiddenColumnsStorage.js # localStorage utility
├── public/
│   └── whirlpool.min.js              # Whirlpool framework
└── spec.md                            # Detailed specification

## Usage

### Data Format

The table accepts an array of nested JSON objects:

```javascript
const data = [
  {
    id: 1,
    name: "John Doe",
    contact: {
      email: "john@example.com",
      phone: "123-456-7890"
    },
    address: {
      city: "Tokyo",
      country: "Japan"
    }
  }
];
```

### Configuration

Configure the table in `util/mockData.js`:

```javascript
export const tableConfig = {
  idColumn: 'id',           // Column to use as ID
  tableId: 'user-table'     // Unique ID for localStorage
};
```

### Architecture

The example uses Whirlpool's `app.data` pattern for data management:

**Data Sources Registered in `index.js`:**
- `tableData`: Fetches table data from API (currently mock with simulated delay)
- `hiddenColumns`: Fetches hidden columns from localStorage

**Data Flow:**
1. **Initial Load**: Components call `app.data.fetch(['tableData', 'hiddenColumns'])`
2. **Subscribe**: Components listen via `app.data.on('dataKey', callback)`
3. **Hide Column**: `hiddenColumnsStorage.addHiddenColumn()` → `app.data.fetch(['hiddenColumns'])` → all subscribers notified
4. **Show Column**: `hiddenColumnsStorage.removeHiddenColumn()` → `app.data.fetch(['hiddenColumns'])` → all subscribers notified

## Components

### data_table
- Flattens and displays data in a sortable table
- Manages column visibility and sorting state
- Handles cell selection with row/column highlighting
- Persists hidden columns to localStorage

### hidden_columns
- Displays list of currently hidden columns
- Provides buttons to restore columns
- Syncs with data_table via events

## Implementation Details

### JSON Flattening
The `dataFlattener` utility recursively converts nested objects:
- Objects: Flattened with dot notation
- Arrays: Converted to JSON strings
- Primitives: Used as-is
- Null/undefined: Preserved

### Column Ordering
1. ID column always first
2. Remaining columns sorted alphabetically
3. Hidden columns excluded from display

### LocalStorage
Hidden columns stored at: `data-table-hidden-columns-{tableId}`
Format: JSON array of column keys

### Event Communication
- `column.hidden`: Emitted when column is hidden
- `column.shown`: Emitted when column is restored

## Customization

### Styling
Modify the `<style>` section in `index.html` to customize:
- Cell/row/column highlighting colors
- Sort indicator appearance
- Button styles
- Table borders and spacing

### Data Source
To integrate with a real API:
1. Modify `util/api.js` to fetch from your API endpoint
2. Update `util/mockData.js` with your data structure
3. The `app.data` system will handle the rest automatically

### Column Display
Modify `dataFlattener.formatColumnName()` to change how column names are formatted.
