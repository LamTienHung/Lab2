import { AudioQueue } from "./audio-queue.js";

// Initialize FIFO queue
const audioQueue = new AudioQueue();

// Get HTML elements
const trackInput = document.getElementById("track-url");
const addTrackButton = document.getElementById("add-track");
const queueList = document.getElementById("queue-list");
const queueCount = document.getElementById("queue-count");
const playerStatus = document.getElementById("player-status");

// Display all pending audio tasks
function renderQueue() {
    queueList.replaceChildren();

    const tasks = audioQueue.getTasks();

    tasks.forEach((task) => {
        const listItem = document.createElement("li");

        listItem.textContent = `Task ${task.id}: ${task.url} (${task.status})`;

        queueList.appendChild(listItem);
    });

    queueCount.textContent = `Queue: ${audioQueue.size} tracks`;
}

// Add audio URL to FIFO queue
function addTrack() {
    const url = trackInput.value.trim();

    if (!url) {
        playerStatus.textContent = "Please enter an audio URL.";
        trackInput.focus();
        return;
    }

    try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Unsupported URL protocol");
        }
    } catch {
        playerStatus.textContent = "Please enter a valid HTTP or HTTPS URL.";
        trackInput.focus();
        return;
    }

    const task = audioQueue.enqueue(url);

    playerStatus.textContent = `Task ${task.id} added to queue.`;

    trackInput.value = "";

    renderQueue();
}

// Handle Add to Queue button
addTrackButton.addEventListener("click", addTrack);

// Allow Enter key to add a track
trackInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTrack();
    }
});

// Initial queue display
renderQueue();

// Web Audio API
let audioContext = null;
let currentSource = null;
let isProcessing = false;
let currentTask = null;
let processingToken = 0;
let analyser = null;
let frequencyData = null;
const canvas = document.getElementById("audio-canvas");
const canvasContext = canvas.getContext("2d");
const visualizerStatus = document.getElementById("visualizer-status");

let animationFrameId = null;
// Initialize AudioContext when needed
async function initializeAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();

        // Create analyser for audio visualization
        analyser = audioContext.createAnalyser();

        // Configure Fast Fourier Transform
        analyser.fftSize = 256;

        // Smooth frequency changes
        analyser.smoothingTimeConstant = 0.8;

        // Store frequency data
        frequencyData = new Uint8Array(
            analyser.frequencyBinCount
        );

        // Connect analyser to speakers
        analyser.connect(audioContext.destination);
    }

    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
}

// Process audio tasks in FIFO order
async function processNextTrack() {
    if (isProcessing) {
        playerStatus.textContent = "An audio task is already running.";
        return;
    }

    if (audioQueue.isEmpty()) {
        playerStatus.textContent = "The audio queue is empty.";
        return;
    }

    isProcessing = true;

    const token = ++processingToken;
    const task = audioQueue.dequeue();

    currentTask = task;
    task.status = "loading";

    renderQueue();
    playerStatus.textContent = `Loading Task ${task.id}...`;

    try {
        await initializeAudio();

        if (token !== processingToken) return;

        const response = await fetch(task.url, {
            signal: task.controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (token !== processingToken) return;

        task.status = "decoding";
        playerStatus.textContent = `Decoding Task ${task.id}...`;

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (token !== processingToken) return;

        // Create audio source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Connect audio source to analyser
        source.connect(analyser);

        currentSource = source;
        task.status = "playing";

        playerStatus.textContent = `Playing Task ${task.id}`;

        source.onended = () => {
            source.disconnect();

            if (token !== processingToken) return;

            currentSource = null;
            currentTask = null;
            isProcessing = false;
            

            playerStatus.textContent = `Task ${task.id} completed.`;

            // Automatically play the next queued track
            if (!audioQueue.isEmpty()) {
                processNextTrack();
            }
        };

        source.start();
        startVisualizer();

    } catch (error) {
        if (token !== processingToken) return;

        currentTask = null;
        currentSource = null;
        isProcessing = false;

        stopVisualizer();

        if (error.name === "AbortError") {
            playerStatus.textContent = `Task ${task.id} cancelled.`;
        } else {
            playerStatus.textContent =
                `Task ${task.id} failed: ${error.message}`;
        }

        if (!audioQueue.isEmpty()) {
            processNextTrack();
        }
    }
}

// Play button
document.getElementById("play-audio").addEventListener("click", () => {
    processNextTrack();
});

// Stop or cancel the active task
function stopCurrentTask(action) {
    if (!currentTask) {
        playerStatus.textContent = "No active audio task.";
        return;
    }

    const taskId = currentTask.id;

    // Invalidate asynchronous operations
    processingToken++;

    // Abort audio download if it is still running
    currentTask.controller.abort();

    // Stop currently playing audio
    if (currentSource) {
        const source = currentSource;

        currentSource = null;
        source.onended = null;

        try {
            source.stop();
        } catch (error) {
            console.warn("Audio source already stopped:", error);
        }

        source.disconnect();
    }

    currentTask = null;
    isProcessing = false;

    stopVisualizer();

    playerStatus.textContent = `Task ${taskId} ${action}.`;

    renderQueue();
}

// Stop button
document.getElementById("stop-audio").addEventListener("click", () => {
    stopCurrentTask("stopped");
});

// Cancel Task button
document.getElementById("cancel-task").addEventListener("click", () => {
    stopCurrentTask("cancelled");
});

// Draw real-time audio frequency bars
function drawVisualizer() {
    if (!analyser || !frequencyData || !currentSource) {
        return;
    }

    analyser.getByteFrequencyData(frequencyData);

    const width = canvas.width;
    const height = canvas.height;

    canvasContext.clearRect(0, 0, width, height);

    canvasContext.fillStyle = "#101827";
    canvasContext.fillRect(0, 0, width, height);

    const barCount = frequencyData.length;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
        const value = frequencyData[i];
        const barHeight = (value / 255) * height;

        const x = i * barWidth;
        const y = height - barHeight;

        canvasContext.fillStyle = `hsl(${200 + value / 8}, 85%, 55%)`;

        canvasContext.fillRect(
            x,
            y,
            Math.max(1, barWidth - 2),
            barHeight
        );
    }

    animationFrameId = requestAnimationFrame(drawVisualizer);
}

// Start visualization
function startVisualizer() {
    stopVisualizer();

    visualizerStatus.textContent = "Visualizer is active.";

    drawVisualizer();
}

// Stop visualization and clear canvas
function stopVisualizer() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    canvasContext.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    visualizerStatus.textContent = "Visualizer is inactive.";
}

// Clean up audio resources when leaving the page
window.addEventListener("pagehide", () => {
    // Invalidate unfinished asynchronous tasks
    processingToken++;

    // Cancel the active download
    if (currentTask) {
        currentTask.controller.abort();
    }

    // Cancel all pending tasks
    audioQueue.getTasks().forEach((task) => {
        task.controller.abort();
    });

    // Stop and disconnect the active source
    if (currentSource) {
        const source = currentSource;
        currentSource = null;
        source.onended = null;

        try {
            source.stop();
        } catch {
            // Source may already have stopped
        }

        source.disconnect();
    }

    // Stop the animation loop
    stopVisualizer();

    currentTask = null;
    isProcessing = false;

    // Release Web Audio resources
    if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch(console.error);
    }
});