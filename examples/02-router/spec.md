# Router Example - Specification

## Description

**Start with the Whirlpool boilerplate.** Reuse the standard example shell (Bootstrap layout, `W.app`, template loader) so the page boots exactly like the other demos.

Tell the story of the app so a teammate can rebuild it:

1. Show a top navbar titled "User Preferences Manager" with links to `#home`, `#about`, and `#user_list`. The first content section on load should be the home page.
2. Beneath the navbar, reserve a container for the `main_switch`. This switch swaps entire pages: a welcome card for Home, an overview card for About, the full user directory, or a specific user profile when the hash matches `#user/<id>/<section>`.
3. The Home view introduces the demo. Display a friendly heading, a short description, and a bullet list highlighting what the router example teaches (hash navigation, switch-driven rendering, etc.).
4. The About view continues the walkthrough with a brief explanation plus a list of switch behaviors. Include a small code snippet block that sketches how the main switch maps route names to components.
5. The Users view lists mock team members. Each row shows the name, role badge, and email, and links to `#user/{id}/info`. Clicking a person loads the user profile view without reloading the page.
6. The Profile view (hash starts with `#user/`) renders a card with a back link, two sub navigation tabs (`Info` and `Settings`), and a nested switch that loads the matching subcomponent. If the requested ID does not exist, show a friendly error with a button that returns to the directory.
7. The `Info` tab presents basic user fields in a table plus a short helper panel explaining what the tab shows. The `Settings` tab lists preference controls (checkboxes and selects), logs every change to the console, and exposes a "Save Settings" button that confirms via `alert()`.

## Key Patterns

**Hash Routing**: `main_switch` watches `location.hash` and maps route names (`home`, `about`, `user_list`, `user`) to components. Mark the hosting `<div>` with `data-default="home_page"` so the Home card renders first.

**Nested Switches**: `user_page` nests a `user_switch` container. That switch looks at hashes like `#user/3/settings` to decide whether to load `user_info` or `user_settings`, falling back to the default when the segment is missing or unknown.

**User Data Helpers**: Keep the mock directory in `users.js` and expose helpers (`getUsers`, `getUser`, `getUserId`) so multiple components can read the same data without duplicating parsing logic.

**Error Handling**: When `getUserId()` returns nothing or the ID is unknown, `user_page` serves an inline danger alert with a quick path back to the list instead of mounting the nested switch.

**Interaction Hooks**: The settings tab wires jQuery listeners in `rendered` to log checkbox/select changes and to raise an alert on save. Leave actual persistence out of scope—this example focuses on demonstrating Whirlpool lifecycle hooks during route changes.
