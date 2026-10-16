
export const ViewStatus = Object.freeze({
    IDLE: "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
});

export function createInitialState() {
    return {
        status: ViewStatus.IDLE
    };
}

export function createLoadingState() {
    return {
        status: ViewStatus.LOADING
    };
}

export function createSuccessState(data) {
    return {
        status: ViewStatus.SUCCESS,
        data: data
    };
}

export function createErrorState(error) {
    return {
        status: ViewStatus.ERROR,
        error: String(error)
    };
}

const allowedTransitions = {
    IDLE: ["LOADING"],
    LOADING: ["LOADING", "SUCCESS", "ERROR"],
    SUCCESS: ["LOADING"],
    ERROR: ["LOADING"]
};

export function transitionState(currentState, nextState) {
    const allowed = allowedTransitions[currentState.status];

    if (!allowed || !allowed.includes(nextState.status)) {
        throw new Error(
            `Invalid transition: ${currentState.status} -> ${nextState.status}`
        );
    }

    if (nextState.status === ViewStatus.SUCCESS &&
        !Array.isArray(nextState.data)) {
        throw new TypeError("SUCCESS requires array data");
    }

    if (nextState.status === ViewStatus.ERROR &&
        typeof nextState.error !== "string") {
        throw new TypeError("ERROR requires an error message");
    }

    return nextState;
}
