# Example 14: Data Table

## Overview
A sophisticated data table component that displays nested JSON objects in a flattened, sortable, and customizable table format with column visibility management.

## Features

### 1. JSON Flattening
- Converts nested JSON objects into flat structure
- Example: `{a: {b: 1}}` → `{"a.b": 1}`
- Handles multiple levels of nesting
- Arrays are converted to JSON strings for display

### 2. Column Display
- **ID Column**: Always displayed on the left (first column)
  - ID column is specified via configuration
  - Cannot be hidden
  - Can be sorted (like other columns)
- **Alphabetical Order**: All other columns displayed in alphabetical order
- **Column Name Formatting**: Flattened keys like `a.b` displayed as `a b` (dot replaced with space)

### 3. Sorting
- Click column header to sort by that column
- Visual indicator for current sort column and direction (ascending/descending)
- Toggle between ascending and descending on repeated clicks
- Sorts work with flattened values

### 4. Cell Selection
- Click any cell to select it
- **Row Highlighting**: Selected cell's entire row is highlighted
- **Column Highlighting**: Selected cell's entire column is highlighted
- Visual distinction for the selected cell itself

### 5. Column Visibility Management
- **Hide Column**: 'x' button next to each column name (except ID column)
  - Click 'x' to hide the column
  - Hidden state persists in localStorage
- **Show Hidden Columns**: Separate component displays list of hidden columns
  - '+' button next to each hidden column name
  - Click '+' to show the column again
- **Persistence**: Hidden column preferences saved to localStorage per table

### 6. LocalStorage Key
- Format: `data-table-hidden-columns-{tableId}`
- Stores array of hidden column names

## Components

### `data_table`
Main table component that:
- Flattens input JSON data
- Renders sortable table with selectable cells
- Manages column visibility
- Handles sorting state
- Persists hidden columns to localStorage

### `hidden_columns`
Column visibility management component that:
- Displays list of currently hidden columns
- Provides '+' buttons to restore columns
- Syncs with data_table component via app.ev events

## Data Structure

### Input Data
```javascript
const sampleData = [
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
    },
    active: true
  },
  {
    id: 2,
    name: "Jane Smith",
    contact: {
      email: "jane@example.com",
      phone: "098-765-4321"
    },
    address: {
      city: "Osaka",
      country: "Japan"
    },
    active: false
  }
]
```

### Flattened Structure
```javascript
{
  "id": 1,
  "name": "John Doe",
  "contact.email": "john@example.com",
  "contact.phone": "123-456-7890",
  "address.city": "Tokyo",
  "address.country": "Japan",
  "active": true
}
```

### Column Display Order
1. `id` (always first)
2. `active`
3. `address.city` → displayed as "address city"
4. `address.country` → displayed as "address country"
5. `contact.email` → displayed as "contact email"
6. `contact.phone` → displayed as "contact phone"
7. `name`

## Configuration

### Table Configuration
```javascript
{
  idColumn: 'id',           // Column name to use as ID (always shown first)
  tableId: 'user-table',    // Unique ID for localStorage key
  data: [ /* array of objects */ ]
}
```

## User Interactions

### Sorting Flow
1. User clicks column header
2. If clicking same column: toggle sort direction (asc ↔ desc)
3. If clicking different column: sort by new column (ascending)
4. Visual indicator shows current sort column and direction
5. Table re-renders with sorted data

### Column Hiding Flow
1. User clicks 'x' button next to column name
2. Column is removed from table
3. Column name added to localStorage hidden list
4. Event emitted to hidden_columns component
5. hidden_columns component updates to show the new hidden column

### Column Showing Flow
1. User clicks '+' button in hidden_columns component
2. Column name removed from localStorage hidden list
3. Event emitted to data_table component
4. data_table component re-renders with restored column

### Cell Selection Flow
1. User clicks on a cell
2. Previously selected cell/row/column unhighlighted
3. New cell's row gets row-highlight class
4. New cell's column gets column-highlight class
5. Cell itself gets cell-selected class

## Technical Details

### Event Communication
- `column.hidden` - Emitted when column is hidden (payload: `{tableId, column}`)
- `column.shown` - Emitted when column is shown (payload: `{tableId, column}`)

### CSS Classes
- `.column-header-id` - ID column header (sortable, no hide button)
- `.column-header-sortable` - Regular column header (sortable)
- `.sorted-asc` - Column sorted ascending
- `.sorted-desc` - Column sorted descending
- `.row-highlight` - Entire row highlighted
- `.column-highlight` - Entire column highlighted
- `.cell-selected` - Selected cell

### LocalStorage Structure
```javascript
localStorage.getItem('data-table-hidden-columns-user-table')
// Returns: ["contact.email", "address.country"]
```

## Implementation Notes

1. **Flattening Function**: Recursive function that handles nested objects
2. **Column Ordering**: Sort columns alphabetically, but always put ID column first
3. **Sorting**: Implement stable sort with type-aware comparison (numbers vs strings)
4. **Selection Tracking**: Store selected cell position (row index, column key)
5. **LocalStorage Sync**: Read on init, write on every hide/show operation

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│                    Data Table Example                    │
├─────────────────────────────────────────────────────────┤
│ Hidden Columns: [contact email +] [address country +]   │
├─────────────────────────────────────────────────────────┤
│ id ↑│ active x │ address city x │ name x │ ...          │
├─────┼──────────┼────────────────┼────────┼──────────────┤
│  1  │   true   │     Tokyo      │John Doe│              │
│  2  │  false   │     Osaka      │Jane... │              │
└─────────────────────────────────────────────────────────┘
```

## Bootstrap Styling
- Use Bootstrap table classes: `table`, `table-striped`, `table-hover`, `table-bordered`
- Use Bootstrap button classes for x/+ buttons: `btn`, `btn-sm`, `btn-outline-danger`, `btn-outline-success`
- Use Bootstrap badge classes for hidden column list
- Custom CSS for cell/row/column highlighting

## Sample Data Features
Include sample data that demonstrates:
- Various data types (string, number, boolean)
- Nested objects (2-3 levels deep)
- Multiple rows (10-15 entries)
- Different value patterns for testing sort
