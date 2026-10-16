const handlers = new Map();

let rootElement = null;

function handleEvent(event) {
    let target = event.target;

    if (target instanceof Node && target.nodeType !== Node.ELEMENT_NODE) {
        target = target.parentElement;
    }

    if (!(target instanceof Element)) return;

    const element = target.closest("[data-action]");

    if (!element || !rootElement.contains(element)) {
        return;
    }

    const action = element.dataset.action;

    if (handlers.has(action)) {
        handlers.get(action)(event, element);
    }
}

// Register an action handler
export function registerAction(action, callback) {
    handlers.set(action, callback);
}

// Initialize event delegation
export function initEventDelegation(root) {
    if (rootElement) {
        rootElement.removeEventListener("click", handleEvent);
    }

    rootElement = root;
    rootElement.addEventListener("click", handleEvent);
}

// Remove all registered handlers
export function clearActions() {
    handlers.clear();
}
