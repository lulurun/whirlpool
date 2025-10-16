# Building Whirlpool Apps With Codex

This repository pairs human-readable specs with Codex so new demos can be generated quickly. Follow the steps below whenever you want Codex to scaffold a fresh Whirlpool app.

1. Draft a plain-language spec alongside the other examples (see `examples/*/spec.md` for tone and structure). Describe the experience, expected routes, data, and UI behavior—no implementation details required.
2. Open a Codex session and point it at this repository. Mention the spec you want to realize (for example, “Please implement `examples/workspace/spec.md`).
3. Tell Codex that it can use Whirlpool primitives (`W.app`, `app.data`, `W.switch`, recursive components) and that it should mirror the conventions already used in the repo (ES modules, two-space indentation, Bootstrap styling, Handlebars templates).
4. Codex will create a new example folder, wire up Rollup/Webpack scaffolding, and implement components that satisfy the spec. It will also register data stores, add templates, and update docs as needed.
5. Once Codex finishes, run the usual local checks:
   - `npm install` inside the example directory.
   - `npm start` (or `npm run build`) to confirm the new app bundles and runs.
   - Inspect the generated spec and README to ensure future contributors can maintain the example.

If adjustments are needed, update the spec or describe the delta in plain language—Codex can iterate just as quickly.
