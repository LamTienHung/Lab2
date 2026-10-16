const stateStore = [];

let cursor = 0;
let triggerRender = () => {};

// Register the render function
export function setRenderer(renderFn) {
    triggerRender = renderFn;
}

// Reset cursor before each render
export function resetCursor() {
    cursor = 0;
}

// Get the current state store
export function getStateStore() {
    return [...stateStore];
}

export function useState(initialValue) {
    const currentIndex = cursor;

    // Initialize state only on the first render
    if (!(currentIndex in stateStore)) {
        stateStore[currentIndex] = initialValue;
    }

    // Setter function
    function setState(newValue) {
        const oldValue = stateStore[currentIndex];

        // Support functional updater
        const nextValue =
            typeof newValue === "function"
                ? newValue(oldValue)
                : newValue;

        // Skip rendering if the value has not changed
        if (Object.is(oldValue, nextValue)) {
            return;
        }

        // Update state
        stateStore[currentIndex] = nextValue;

        // Trigger re-render
        triggerRender();
    }

    // Move cursor to the next state
    cursor++;

    return [stateStore[currentIndex], setState];
}
