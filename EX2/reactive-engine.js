
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
