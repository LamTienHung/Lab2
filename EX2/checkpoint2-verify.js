import {
    registerAction,
    initEventDelegation,
    clearActions
} from "./event-delegation-hub.js";

const root = document.createElement("div");
document.body.appendChild(root);

let clickCount = 0;

registerAction("test", () => {
    clickCount++;
});

initEventDelegation(root);

root.innerHTML = `
    <button data-action="test">Test Button</button>
`;

root.querySelector("button").click();

console.assert(
    clickCount === 1,
    "Event delegation test failed"
);

console.log("Event delegation test:", clickCount === 1 ? "PASS" : "FAIL");

clearActions();
root.remove();
