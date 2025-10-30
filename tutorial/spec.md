# Tutorial Specification

## Overview

The tutorial itself should be a Whirlpool app, demonstrating the framework's capabilities through practical examples.

The tutorial consists of several steps, each presenting a small, independent demo that illustrates a core feature of Whirlpool. By working through these steps, developers will gain a clear understanding of the framework and its underlying philosophy:

- **Component-based architecture**: Break down an app into small, focused components
- **Isolated components**: Each component works with its own input and provides reactions without relying on other components
- **Shared data communication**: Components communicate through shared data
- **Framework orchestration**: The framework handles component placement and loading

## Layout

The home page should display:
- A list of tutorial steps in a sidebar or navigation area
- The current step's demo app in the main content area

## Implementation

Implement the entire tutorial webpage as a Whirlpool app, with component files (JavaScript and templates) organized in their respective step folders.

## Steps

Each step uses a reusable step component that serves as the parent container, loading the other components specific to that step (referred to as the "parent component" below).

### Step 1: Component Loading

**Components:**
- Component 1 and Component 2 are placed in the parent template
- Component 3 reuses Component 1's code but has Component 2 nested inside its template

**Purpose:**
This step demonstrates how components are loaded and how data is rendered with templates. Static data should be created for the components to render.

**Learning Objectives:**
- Understanding component loading mechanism
- Template-based rendering with data

### Step 2: Counter

**Components:**
- A single component displaying a counter value and an increment button
- The counter value is stored in the component's internal state (memory)

**Purpose:**
This step demonstrates how to define internal component state and how to define actions within the rendered method.

**Learning Objectives:**
- Managing internal component state
- Defining and handling user interactions (click events)
- Updating component state reactively

### Step 3: Event Communication with app.ev

**Components:**
- Component 1: A button component that emits events when clicked
- Component 2: A message display component that listens to events and displays messages
- Component 3: A counter component that also listens to the same events and increments

**Purpose:**
This step demonstrates how components communicate with each other using the event bus (`app.ev`). Components are decoupled and don't know about each other - they only publish and subscribe to events.

**Learning Objectives:**
- Publishing events using `app.ev.emit()`
- Subscribing to events using `app.ev.on()`
- Understanding event-driven architecture
- Decoupled component communication
- Multiple components reacting to the same event

**Example Flow:**
1. User clicks button in Component 1
2. Component 1 emits event: `app.ev.emit('button.clicked', { message: 'Hello' }, this)`
3. Component 2 receives event and displays the message
4. Component 3 receives the same event and increments its counter

### Step 4: Shared Data with app.data

**Components:**
- Component 1: An input form to add items to a shared list
- Component 2: A list display showing all items
- Component 3: A counter showing the total number of items

**Purpose:**
This step demonstrates centralized data management using `app.data`. Multiple components share the same data source and automatically update when the data changes. This is the recommended pattern for managing shared state across components.

**Learning Objectives:**
- Registering data sources with `app.data.register()`
- Fetching data with `app.data.fetch()`
- Getting cached data with `app.data.get()`
- Subscribing to data updates with `app.data.on()`
- Refreshing data with `app.data.refresh()`
- Understanding centralized state management
- Multiple components sharing the same data
- Reactive data updates

**Example Flow:**
1. On app initialization: Register data source with `app.data.register('items', fetchFunction)`
2. Components subscribe: `app.data.on('items', (data) => { this.load(); }, this)`
3. User adds item in Component 1
4. Component 1 calls `app.data.refresh('items')`
5. All subscribed components (1, 2, and 3) automatically receive the updated data and reload



