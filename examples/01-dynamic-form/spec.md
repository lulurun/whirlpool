# Dynamic Form Builder - Specification

## Description

**Start with the Whirlpool boilerplate.** Use the standard example shell (Bootstrap page shell, `W.app`, template loader) exactly as the other demos.


1. Create a small web app where people can edit and inspect a JSON object. Show a card titled "Dynamic Form Builder" with two stacked sections: the editable form up top and a read-only preview underneath.
2. The main component should list every field in the currefnt object. Each field shows the key as a label and the value inside a text box that can be edited in place. If the value is itself an object, show a nested copy of the same component so the user can drill down recursively.
3. After the list of fields, provide controls to add a brand-new key. Let the user type the field name, choose whether it stores a simple value or another object, and click a `+` button to insert it. Also include a `x` button on each existing row so fields can be removed.
4. Keep a submit button only on the outermost form. When it fires, prevent the page refresh and log the full JSON to the console so developers can see the end result.
5. A companion preview component should stay in sync and display the entire JSON object as nicely formatted text, updating every time something changes above it.

## Key Patterns

**Shared State**: Keep one in-memory object that every instance of the form reads and writes. The top-level component edits the root object; nested components receive a pointer to whichever branch they should manage.

**Data Path Convention**: Every component instance looks at the `data-path` attribute on its root element to decide which slice of the object it edits. When the attribute is missing (defaults to an empty string), the instance knows it is the root and should expose the top-level keys. Nested instances must be declared with a path like `/profile/address` so they focus on that sub-object and leave the rest untouched.

**Component Lifecycle**: Let `init` figure out which slice of the data it controls, `getData` shape the info needed for rendering (list of fields, whether this is the root), and `rendered` attach the button clicks and input handlers that mutate the object. Whenever something changes, ask the app to broadcast the latest JSON so the preview can refresh.

**Recursive Rendering**: The goal of the demo is to highlight that Whirlpool can mount the same component inside itself. As soon as a value is an object, hand off to another `dynamic_form` instance and let it repeat the pattern.

**Preview Sync**: The preview listens for change notifications and re-renders the pretty JSON string. It does not edit data; it simply mirrors whatever the form produced.
