# Whirlpool Framework

A lightweight, component-based JavaScript framework for building modular web applications with event-driven architecture.

## Overview

Whirlpool is a minimalist framework designed for simplicity and ease of use. Key benefits:

### Framework Benefits
- **🪶 Lightweight**: Only 6.7KB minified - minimal overhead for your applications
- **🎯 Simple**: Clean, intuitive API with minimal concepts to learn
- **📚 Low Learning Curve**: Easy to understand patterns that developers can pick up quickly
- **🤖 AI-Friendly**: Clear documentation and patterns that AI can read and implement effectively
- **⚡ Fast Development**: Build modular web apps quickly with minimal boilerplate

### Core Features
- **Component-based architecture** with automatic lifecycle management
- **Event-driven communication** between components using publish/subscribe pattern
- **Template-based rendering** with Handlebars integration
- **Automatic DOM binding** and component instantiation
- **Hierarchical component structure** with parent-child relationships

## Quick Start

```bash
npm install
npm run build          # rebuilds dist/whirlpool.* bundles
npm run webpack        # rebuilds example assets (uses rollup output)
cd examples/todo && npm install && npm start
```

- Whirlpool expects a prebuilt bundle in `dist/`; run `npm run build` after modifying files in `src/`.
- Each example manages its own webpack toolchain—install dependencies inside that folder before running or building locally.

## Example Gallery

- `examples/dynamic-form/` – schema-driven fields and publish/subscribe coordination.
- `examples/router/` – nested switches demonstrating hash-based navigation.
- `examples/shopping-cart/` – shared `app.data` stores for multi-component aggregation.
- `examples/todo/` – new productivity demo with filters, counters, and shared data mutations.

## Component API Cheatsheet

| Concern | Use this | Notes |
| --- | --- | --- |
| Register component | `W.component(name, definition)` | Lifecycles: `init`, `getData`, `rendered`, optional `cleanup`/`destroyed`. |
| Trigger rerender | `this.load(next)` | Call after data mutation or when props change; optional callback when children finish. |
| Publish events | `this.app.ev.emit(event, payload, this)` | Subscribe with `this.app.ev.on(event, handler, this)` and clean via `this.app.ev.remove(this)`. |
| Shared state | `app.data.register(key, fetchFn)` / `app.data.emit(key, value, this)` | Fetch multiple keys with `app.data.fetch([...], cb)`; listeners respond via `app.data.on`. |
| Navigation | `this.app.nav.on(handler, this)` | Works with hash/popstate routing from switches. |

## Versioning & Releases

- Follow semantic versioning when publishing `dist/` outputs; bump `package.json` and regenerate bundles with `npm run build`.
- Regenerate `dist/whirlpool.min.js` before syncing example apps so they copy the latest runtime.
- Document notable changes in commit messages or a future `CHANGELOG.md` for discoverability.

## Documentation Map

- [Core Concepts & Deep Reference](docs/reference.md)
- [Contributor Guide](AGENTS.md)
- Example walkthroughs inside `examples/` (each folder has its own README).
