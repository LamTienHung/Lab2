
import { createElement as h, renderToDOM } from "./mini-react.js";

import {
    ViewStatus,
    createInitialState,
    createLoadingState,
    createSuccessState,
    createErrorState,
    transitionState
} from "./state-machine.js";

const root = document.getElementById("app");

let state = createInitialState();
let requestId = 0;
let failNextRequest = false;

function SkeletonLoader() {
    return h("div", { role: "status", "aria-label": "Loading data" },
        h("p", {}, "Loading data..."),
        h("div", { className: "skeleton" }),
        h("div", { className: "skeleton" }),
        h("div", { className: "skeleton" })
    );
}

function DataList() {
    return h("div", {},
        h("h2", {}, "Loaded Data"),
        ...state.data.map(item =>
            h("div", { className: "data-item" }, item)
        ),
        h("button", { onClick: loadData }, "Reload Data")
    );
}

function Content() {
    switch (state.status) {
        case ViewStatus.IDLE:
            return h("div", {},
                h("h2", {}, "Ready to Load Data"),
                h("p", {}, "Click the button to fetch data."),
                h("button", { onClick: loadData }, "Load Data")
            );

        case ViewStatus.LOADING:
            return SkeletonLoader();

        case ViewStatus.SUCCESS:
            return DataList();

        case ViewStatus.ERROR:
            return h("div", {},
                h("h2", {}, "Connection Failed"),
                h("p", { className: "error" }, state.error),
                h("button", { onClick: loadData }, "Retry Connection")
            );
    }
}

function App() {
    return h("main", { className: "container" },
        h("header", {},
            h("h1", {}, "Resilient Data Loader"),
            h("p", {}, "EX3 - State Machine & Skeleton Loader")
        ),
        h("section", { className: "content" },
            Content()
        ),
        h("footer", {}, "Lab 02 - Exercise 3")
    );
}

function render() {
    root.replaceChildren(renderToDOM(App()));
}

function simulateFetch() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (failNextRequest) {
                failNextRequest = false;
                reject(new Error("Unable to connect to server."));
            } else {
                resolve([
                    "User Profile",
                    "Dashboard Statistics",
                    "Recent Activities",
                    "System Notifications"
                ]);
            }
        }, 2000);
    });
}

async function loadData() {
    const currentRequest = ++requestId;

    state = transitionState(state, createLoadingState());
    render();

    try {
        const data = await simulateFetch();

        if (currentRequest !== requestId) return;

        state = transitionState(state, createSuccessState(data));
    } catch (error) {
        if (currentRequest !== requestId) return;

        state = transitionState(state, createErrorState(error.message));
    }

    render();
}

// Test ERROR state from browser console
window.simulateError = function () {
    failNextRequest = true;
    loadData();
};

render();
