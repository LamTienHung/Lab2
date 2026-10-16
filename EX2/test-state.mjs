import {
    useState,
    resetCursor,
    setRenderer
} from "./reactive-engine.js";

let renderCount = 0;

setRenderer(() => {
    renderCount++;
});

resetCursor();

const [count, setCount] = useState(0);

console.log("Initial count:", count);

setCount(5);

console.log("Render count:", renderCount);

setCount(prev => prev + 1);

console.log("Render count after updater:", renderCount);
