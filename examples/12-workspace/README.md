# Workspace Console Example

This demo showcases multiple Whirlpool capabilities in one place: hash routing, nested switches, shared data stores, recursive dynamic forms, and cross-component updates.

## Getting Started

```bash
cd examples/workspace
npm install
npm start
```

The dev server opens at http://localhost:8080.

## Production Build

```bash
npm run build
```

Bundles are output to `public/` with `whirlpool.min.js` copied from the framework build.

## Structure

```
examples/workspace/
├── src/
│   ├── html/
│   │   └── index.html
│   └── js/
│       ├── component/
│       ├── switch/
│       ├── template/
│       ├── helpers/
│       ├── shared/
│       ├── data.js
│       └── index.js
```

Run the overview, users, and settings pages from the navbar to see how routing, shared state, and dynamic forms work together.
