# Trading Order Book Example

This example renders a simple order book using the Whirlpool framework. You can place synthetic market and limit orders to see how shared data stores update in real time.

## Getting Started

```bash
cd examples/trading
npm install
npm start
```

The dev server opens at http://localhost:8080.

## Production Build

```bash
npm run build
```

The optimized bundle will be generated in `public/` alongside `whirlpool.min.js`.
