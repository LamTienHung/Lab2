
"use strict";

// Event date in UTC ISO 8601 format
// Example: December 31, 2026 at 12:00 UTC
const EVENT_DATE = "2026-12-31T12:00:00Z";
const targetTime = Date.parse(EVENT_DATE);

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownStatus = document.getElementById("countdown-status");

let countdownInterval = null;

function updateCountdown() {
    const remainingTime = Math.max(0, targetTime - Date.now());

    const days = Math.floor(remainingTime / 86400000);
    const hours = Math.floor((remainingTime % 86400000) / 3600000);
    const minutes = Math.floor((remainingTime % 3600000) / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    if (remainingTime === 0) {
        countdownStatus.textContent = "The event has started!";

        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }
}

// Update immediately, then every second
updateCountdown();

if (targetTime > Date.now()) {
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Release the timer when leaving the page
window.addEventListener("pagehide", () => {
    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
});


 // =========================================
 // SLICE 2: REGISTRATION FORM STATE MACHINE
 // =========================================

const registrationForm = document.getElementById("registration-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");

// Define possible states
const FORM_STATES = Object.freeze({
    IDLE: "idle",
    SUBMITTING: "submitting",
    SUCCESS: "success",
    ERROR: "error"
});

let formState = FORM_STATES.IDLE;

// Update the form interface based on its state
function setFormState(newState, message = "") {
    formState = newState;

    submitButton.disabled = newState === FORM_STATES.SUBMITTING;

    switch (newState) {
        case FORM_STATES.IDLE:
            submitButton.textContent = "Register Now";
            formStatus.textContent = message;
            break;

        case FORM_STATES.SUBMITTING:
            submitButton.textContent = "Submitting...";
            formStatus.textContent = "Processing your registration...";
            break;

        case FORM_STATES.SUCCESS:
            submitButton.textContent = "Register Now";
            formStatus.textContent = message;
            registrationForm.reset();
            break;

        case FORM_STATES.ERROR:
            submitButton.textContent = "Try Again";
            formStatus.textContent = message;
            break;
    }
}

// Simulate an asynchronous registration request

function simulateRegistration(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Test error state with this email
            if (email.toLowerCase() === "error@test.com") {
                reject(new Error("Registration failed. Please try again."));
                return;
            }

            resolve({
                success: true,
                message: "Registration completed successfully!"
            });
        }, 1500);
    });
}


// Handle form submission

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Prevent concurrent submissions
    if (formState === FORM_STATES.SUBMITTING) {
        return;
    }

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();

    // Validate input
    if (
        fullName.length < 2 ||
        fullName.length > 100 ||
        email.length > 254 ||
        !emailInput.validity.valid
    ) {
        setFormState(
            FORM_STATES.ERROR,
            "Please enter a valid name and email address."
        );
        return;
    }

    setFormState(FORM_STATES.SUBMITTING);

    try {
        const result = await simulateRegistration(email);

        if (!result.success) {
            throw new Error("Registration failed.");
        }

        // Use textContent to avoid interpreting HTML
        setFormState(FORM_STATES.SUCCESS, result.message);
    } catch (error) {
        setFormState(FORM_STATES.ERROR, error.message);
    }
});


// Initial state
setFormState(FORM_STATES.IDLE);
