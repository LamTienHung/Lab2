# HW3 – AI Failure Mode Audit

## Project: Resilient Event Hub

### 1. Countdown Timer Drift

**Defect Description:**

A countdown implementation that decreases a counter by one every second may accumulate timing errors because JavaScript timers are not guaranteed to execute at exact intervals.

**Diagnostic Method:**

Review the countdown implementation and inspect the timer behavior using Chrome DevTools. Compare the displayed remaining time against the difference between the target UTC timestamp and `Date.now()`.

**Refactored Solution:**

Calculate the remaining time from the target UTC timestamp on every update instead of subtracting one second from a stored counter.

```javascript
const remainingTime = Math.max(0, targetTime - Date.now());
```

**Verification Result:**

To be completed after comparing the displayed countdown with the actual timestamp difference.

---

### 2. Duplicate Form Submission

**Defect Description:**

An asynchronous registration form without submission-state protection may process multiple requests if the user submits repeatedly before the first request finishes.

**Diagnostic Method:**

Use Chrome DevTools to inspect the form state and attempt repeated submissions while the registration is being processed.

**Refactored Solution:**

Use a state guard and disable the submit button during the `Submitting` state.

```javascript
if (formState === FORM_STATES.SUBMITTING) {
    return;
}
```

```javascript
submitButton.disabled = newState === FORM_STATES.SUBMITTING;
```

**Verification Result:**

During testing, the submit button became disabled while the form was processing. Repeated clicks were prevented.

---

### 3. Cross-Site Scripting (XSS)

**Defect Description:**

Displaying untrusted input using `innerHTML` may allow injected HTML or JavaScript to execute.

**Diagnostic Method:**

Review DOM updates for unsafe `innerHTML` assignments and test the Full Name field with an HTML injection payload.

**Refactored Solution:**

Use `textContent` to display untrusted text safely rather than interpreting it as HTML.

```javascript
formStatus.textContent = message;
```

**Verification Result:**

The test input was accepted by the registration form. No JavaScript alert appeared. This confirms the tested input did not execute in the current interface, but it does not establish that every possible XSS vulnerability has been eliminated.

---

## Conclusion

The audit identified three important failure modes to consider when developing an event registration application: timer drift, duplicate submissions, and unsafe HTML rendering.

The implementation uses timestamp-based countdown calculations, form state protection, and safe text rendering. These techniques improve reliability and security.

Further verification and review of earlier AI-generated code are required before claiming that all three defects were introduced by AI and subsequently corrected.