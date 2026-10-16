
import {
    createInitialState,
    createLoadingState,
    createSuccessState,
    createErrorState,
    transitionState
} from "./state-machine.js";

let state = createInitialState();
let requestId = 0;

async function loadData(fetchFunction) {
    const currentRequest = ++requestId;

    state = transitionState(
        state,
        createLoadingState()
    );

    try {
        const data = await fetchFunction();

        if (currentRequest !== requestId) {
            return;
        }

        state = transitionState(
            state,
            createSuccessState(data)
        );
    } catch (error) {
        if (currentRequest !== requestId) {
            return;
        }

        state = transitionState(
            state,
            createErrorState(error.message)
        );
    }
}

async function test() {
    console.log("Initial:", state.status);

    await loadData(async () => ["Task 1", "Task 2"]);
    console.log("After success:", state.status);

    await loadData(async () => {
        throw new Error("Network failed");
    });
    console.log("After error:", state.status);

    const slowRequest = loadData(
        () => new Promise(resolve =>
            setTimeout(() => resolve(["Old data"]), 100)
        )
    );

    const fastRequest = loadData(
        async () => ["New data"]
    );

    await Promise.all([slowRequest, fastRequest]);

    console.log("Final data:", state.data);
}

test().catch(console.error);
