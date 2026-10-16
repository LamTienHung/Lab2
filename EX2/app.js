import { createElement, renderToDOM } from "./mini-react.js";
import {
    useState,
    resetCursor,
    setRenderer
} from "./reactive-engine.js";
import {
    registerAction,
    initEventDelegation
} from "./event-delegation-hub.js";

const h = createElement;
const root = document.getElementById("app");

let nextId = 3;
let currentTasks = [];
let currentFilter = "ALL";

let setTasks;
let setFilter;

function TaskApp() {
    const [tasks, updateTasks] = useState([
        { id: 1, text: "Complete Exercise 1", completed: true },
        { id: 2, text: "Build Reactive Task Manager", completed: false }
    ]);

    const [filter, updateFilter] = useState("ALL");

    currentTasks = tasks;
    currentFilter = filter;
    setTasks = updateTasks;
    setFilter = updateFilter;

    const visibleTasks = tasks.filter(task => {
        if (filter === "ACTIVE") return !task.completed;
        if (filter === "COMPLETED") return task.completed;
        return true;
    });

    return h("main", { className: "container" },
        h("header", { className: "header" },
            h("h1", {}, "Reactive Task Manager"),
            h("p", {}, "EX2 - State Machine & Event Delegation")
        ),

        h("section", { className: "content" },
            h("div", { className: "input-group" },
                h("input", {
                    id: "task-input",
                    type: "text",
                    placeholder: "Enter a new task..."
                }),
                h("button", {
                    "data-action": "add"
                }, "Add Task")
            ),

            h("div", { className: "filters" },
                ...["ALL", "ACTIVE", "COMPLETED"].map(value =>
                    h("button", {
                        "data-action": "filter",
                        "data-filter": value,
                        className: filter === value ? "active" : ""
                    }, value)
                )
            ),

            h("ul", { className: "task-list" },
                ...visibleTasks.map(task =>
                    h("li", {
                        className: task.completed ? "completed" : ""
                    },
                        h("span", {}, task.text),
                        h("button", {
                            "data-action": "toggle",
                            "data-id": String(task.id)
                        }, task.completed ? "Undo" : "Done")
                    )
                )
            ),

            h("p", { className: "summary" },
                `${tasks.filter(t => !t.completed).length} active task(s)`
            )
        ),

        h("footer", {}, "Lab 02 - Exercise 2")
    );
}


function render() {
    resetCursor();

    const virtualDOM = TaskApp();

    root.replaceChildren(renderToDOM(virtualDOM));
}


setRenderer(render);

registerAction("add", () => {
    const input = document.getElementById("task-input");
    const text = input.value.trim();

    if (!text) return;

    setTasks(previous => [
        ...previous,
        { id: nextId++, text, completed: false }
    ]);
});

registerAction("toggle", (event, element) => {
    const id = Number(element.dataset.id);

    setTasks(previous =>
        previous.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        )
    );
});

registerAction("filter", (event, element) => {
    setFilter(element.dataset.filter);
});

initEventDelegation(root);
render();
