# HW1 – AI Failure Audit

## Project: Virtual DOM Renderer

### Defect 1: Invalid VNode Type

**Defect Description:**

The Virtual DOM renderer may encounter an invalid VNode type when processing an element that does not follow the expected VNode structure.

**Diagnostic Method:**

Inspect the browser Console for errors such as `Invalid VNode/element type`. Use Chrome DevTools to identify the function responsible for creating or rendering the invalid VNode.

**Refactored Solution:**

Validate the VNode structure before creating DOM elements. Ensure that text nodes are handled correctly using `TEXT_ELEMENT`.

**Verification:**

Render both normal HTML elements and text nodes. Confirm that the browser displays them without JavaScript errors.

---

### Defect 2: Incorrect Event Handler Mapping

**Defect Description:**

Event handlers may fail if Virtual DOM properties such as `onClick` are assigned as ordinary HTML attributes rather than registered as event listeners.

**Diagnostic Method:**

Inspect the event-handling logic and use Chrome DevTools to verify whether the expected event listener is attached.

**Refactored Solution:**

Identify event properties and register them using `addEventListener()` instead of treating them as standard HTML attributes.

**Verification:**

Trigger the event and confirm that the correct handler executes.

---

### Defect 3: Incorrect Property Assignment

**Defect Description:**

The renderer may incorrectly process properties such as `children`, event handlers, or null values, resulting in unexpected DOM behavior.

**Diagnostic Method:**

Review the property-processing logic and inspect the rendered elements in Chrome DevTools.

**Refactored Solution:**

Separate children, event handlers, and regular DOM properties. Process each category using the appropriate DOM API.

**Verification:**

Render elements with different properties and confirm that their attributes and event handlers behave correctly.

---

## Conclusion

This audit identifies three potential failure modes in the Virtual DOM implementation: invalid VNode structures, incorrect event handling, and improper property processing.

The proposed solutions improve the correctness and maintainability of the renderer. Actual AI-induced defects must be supported by code review or Git history before being reported as confirmed findings.