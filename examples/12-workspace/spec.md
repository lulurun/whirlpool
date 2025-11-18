# Workspace Example - Specification

## Description

**Start with the Whirlpool boilerplate.** Use the standard example shell (Bootstrap layout, `W.app`, template loader) so this demo boots like the others.

Lay out the experience so a teammate can rebuild it:

1. Render a top navbar titled "Workspace Console" with links to `#overview`, `#users`, and `#settings`. Under the nav, mount a container for a `main_switch` whose default component is the overview page.
2. The overview page acts as a dashboard. Show a row of summary cards (total users, active users, pending invites, open incidents) and a recent activity list. All numbers come from shared data stores so they update automatically when other pages mutate state.
3. The users page splits the layout. On the left, list every user with status badges and buttons to view their profile. Clicking a user updates the hash to `#users/<id>/profile` (or `/permissions`) and highlights the active card.
4. On the right, render a card that hosts a nested `user_switch`. When no user is selected, display a friendly placeholder. When the hash contains an id, load either the profile tab or the permissions tab based on the trailing segment. Tabs should render nav pills that update the hash (e.g., `#users/3/profile`, `#users/3/permissions`) and visually mark the active pill.
5. The profile tab shows user metadata (name, email, role, join date) and a timeline list of recent audit events pulled from shared data. The permissions tab renders a toggle list for feature flags plus a save button; flips update the shared permissions store and append an audit entry.
6. The settings page demonstrates recursive forms. Present a two-column layout where the left side embeds a dynamic configuration form that edits a nested `workspaceSettings` object (regions, alerts, feature flags, etc.). The right side shows a live JSON preview. Form changes should emit updates through `app.data` so the preview and overview metrics stay in sync.

## Key Patterns

**Hash Routing**: `main_switch` inspects the first hash segment and maps it to `overview_page`, `users_page`, or `settings_page`. The users page registers a `user_switch` that parses hashes like `#users/5/permissions` to load nested tabs.

**Shared Data Stores**: Register stores for `users`, `permissions`, `auditLog`, and `workspaceSettings`. Fetch them before starting the app. Components should read from `app.data.get(...)` in `getData` and call `app.data.refresh(...)` or `app.data.emit(...)` when mutations finish.

**Async Interface**: Back the stores with a `data.js` module that simulates latency (e.g., `setTimeout`). Provide methods to invite users, toggle statuses, update permissions, append audit entries, and persist settings. Each method resolves with the updated snapshot.

**Dynamic Form Recursion**: Reuse the existing dynamic form pattern to walk the settings object. The component should accept a `data-path`, render nested forms for child objects, and emit the updated configuration through `app.data.emit('workspaceSettings', ...)`.

**Nested Switch UI**: Tabs inside the user detail card keep the hash and visual state aligned. Use data attributes (`data-route`) so the component can toggle the active class after each render, just like the router example.

**Cross-Page Reactions**: Overview metrics and the audit feed should react instantly when the users or settings pages make changes, illustrating how Whirlpool’s shared data layer keeps separate views in sync without global variables.
