# Todo Example - Specification

## Description

**Start with the Whirlpool boilerplate.** Follow the shared example shell (Bootstrap layout, `W.app`, template loader) so the page loads like the others.

Describe the behavior plainly so a teammate can rebuild it:

1. Present a centered card titled "Todo List" with a short note explaining that it demonstrates shared data, filters, and derived stats.
2. Inside the card, show the todo form first: a text input for the task title, a priority dropdown, and an `Add` button. Default the priority to Medium.
3. When the user submits the form, create a new todo (id auto-increments, `completed: false`, priority from the select), call the async `addTodo`, then refresh the shared `todos` store. Empty or whitespace-only titles should be ignored.
4. Below the form, render filter controls: three pill buttons for All / Active / Completed plus a priority dropdown. Each button shows the count of matching todos and the active filter stays highlighted.
5. The todo list reflects both filters. Each row shows a checkbox, the task title, a priority badge, the status label, and a remove button. Checking toggles completion; remove deletes the item. Both actions update `todos` via the async data interface and refresh the store afterward.
6. If no todos match the current filters, show a friendly alert encouraging the user to add a task, instead of an empty list.
7. At the bottom, display a summary bar that lists total, active, completed, and high-priority counts. Include two actions: `Mark All Done/Mark All Active` (depending on current state) and `Clear Completed` (disabled unless there are completed todos). Both actions delegate to the async data methods and refresh `todos` on success.

## Key Patterns

**Shared Stores**: Register both `todos` and `todoFilter` with `app.data` and fetch them before starting the app.

**Two-Way Interaction**: Filter selections emit `todoFilter` updates so other components react without directly touching DOM state.

**Async Operations**: Every mutation (add, toggle, delete, clear, toggle-all) goes through `data.js`, which simulates latency with `setTimeout`. Components call `app.data.refresh('todos')` afterward to broadcast the change.

**Derived Data**: The summary component computes counts from the current todo array, while filters compute status tallies for the buttons—examples of lightweight view-model shaping in `getData`.

**User Feedback**: Buttons disable when actions aren’t applicable (e.g., no completed todos to clear). Priority badges and strikethrough text help users read the list at a glance.
