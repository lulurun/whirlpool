# Trading Example - Specification

## Description

**Start with the Whirlpool boilerplate.** Use the standard example shell (Bootstrap page chrome, `W.app`, template loader) so this demo lines up with the rest of the repo.

Build out the first feature of the trading workspace: a live order book.

1. Render the order book as a stacked card. The top half lists asks, the bottom half lists bids. Each row shows price and size; asks should be sorted from highest to lowest price, bids from highest to lowest (best prices nearest the center).
2. Display a midpoint chip between the two halves. Use the best bid and best ask to compute the mid price (`(bestBid + bestAsk) / 2`) and format it to two decimals. If either side is empty, show `—` instead.
3. Add actions:
   - Every bid row gets a `Buy` button on the left. Clicking it places a **limit** order at that bid price and size.
   - Every ask row gets a `Sell` button on the right. Clicking it places a **limit** order at that ask price and size.
   - Highlight the top of book: the lowest ask also gets a `Buy @ Market` button on the left that issues a **market** buy (use the ask price for reference). The highest bid gets a `Sell @ Market` button on the right that issues a **market** sell.
4. Record every click as an order object `{ id, side, type, price, size, source: 'orderbook', createdAt }` inside the shared `orders` store so other components can subscribe later.
5. Show a small orders tape beneath the book listing the most recent submissions (newest first) so users can see their actions reflected immediately.

## Key Patterns

**Shared Data Stores**: Register `orderbook` (seeded with snapshot bids/asks) and `orders` (initially empty). Fetch both before calling `app.start`.

**Async Interface**: Back the stores with `data.js` helpers that simulate latency via `setTimeout`. After mutations, call `app.data.refresh('orders')` so subscribers update.

**Component Lifecycle**: `orderbook` subscribes to both stores, shapes arrays in `getData`, and wires button handlers in `rendered`. Keep DOM updates minimal—only recompute on data events.

**User Feedback**: Distinguish market from limit orders visually (e.g., badge or copy on the buttons) and surface the running orders list so testers can verify interactions without opening the console.

Future components (depth charts, trade feed, etc.) can build on the same stores once the order book is in place.
