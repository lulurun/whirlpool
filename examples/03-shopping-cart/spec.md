# Shopping Cart Example - Specification

## Description

**Start with the Whirlpool boilerplate.** Use the usual example shell (Bootstrap page, `W.app`, template loader) so the demo boots like the others.

Tell the story in plain language so anyone on the team can rebuild it:

1. Render a page titled "Shopping Cart - Data Sharing Example". Explain that the goal is to show how `app.data` lets multiple components share state.
2. Split the content into two main columns. The left column hosts a product gallery; the right column stacks a cart summary card above a detailed cart list.
3. The product gallery should display every catalog item with price, stock, and an `Add to Cart` button. If an item already lives in the cart, show a badge that says how many units are there.
4. Tapping `Add to Cart` talks to the fake data interface. It should respect stock limits, alert when a limit is hit, and then refresh the shared `cart` data so every listening component updates.
5. The cart summary card mirrors the shared cart data. When there are items, show item count, total price, a checkout placeholder button, and a `Clear Cart` control (confirm first!). When empty, show muted copy instead of buttons.
6. Under the summary, list each cart line. Provide buttons to decrease, increase, or remove the item outright. Quantity changes call the data interface, respect stock, and emit alerts on invalid moves.
7. Add a full-width statistics card beneath the main row. It mixes the `products` and `cart` datasets to show total products, stock, items in cart, cart value, and average price.

## Key Patterns

**Shared Data Sources**: Register `products` and `cart` with `app.data`. Fetch both before starting the app so every component has initial state.

**Async Data Interface**: The mock `data.js` simulates network latency with `setTimeout`. After each mutation (add, remove, update, clear) it calls back with the new cart, and components follow up by calling `app.data.refresh('cart')`.

**Component Subscriptions**: Product cards, the summary, details list, and stats all subscribe to `cart` updates. Products and stats also subscribe to `products`, showcasing multiple data dependencies in one component.

**UI Feedback**: Buttons surface alerts when stock limits are hit or when clearing the cart. Disabled buttons and badge counts help users understand the cart state without inspecting the console.

**Separation of Concerns**: Rendering lives in templates, interaction wiring stays inside `rendered`, and business logic sits in `data.js`. This keeps components focused on presentation while `app.data` handles coordination.
