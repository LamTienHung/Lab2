
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
