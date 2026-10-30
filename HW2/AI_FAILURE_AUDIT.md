# HW2 – AI Failure Audit

## Project: Concurrent FIFO Audio Visualizer Queue Engine

### Defect 1: Undefined Audio Source Variable

**Defect Description:**

During development, the audio engine encountered an error because `source` was referenced without being properly declared.

**Diagnostic Method:**

Inspect the browser Console and locate the `source is not defined` error. Review the `processNextTrack()` function to identify the incorrect variable reference.

**Refactored Solution:**

Create the audio source before assigning it to `currentSource`.

```javascript
const source = audioContext.createBufferSource();
source.buffer = audioBuffer;
source.connect(analyser);
currentSource = source;
```

**Verification:**

Play a valid audio file and confirm that playback starts without the undefined-variable error.

---

### Defect 2: Concurrent Audio Task Execution

**Defect Description:**

Without concurrency control, repeated clicks on the Play button may initiate overlapping audio-processing tasks.

**Diagnostic Method:**

Click Play repeatedly while an audio task is loading or playing. Observe whether multiple tasks execute simultaneously.

**Refactored Solution:**

Use an `isProcessing` flag to prevent concurrent execution.

```javascript
if (isProcessing) {
    playerStatus.textContent =
        "An audio task is already running.";
    return;
}
```

**Verification:**

Repeated Play clicks do not start additional audio tasks while the current task is running.

---

### Defect 3: Audio Resource Cleanup

**Defect Description:**

Audio sources and animation loops may continue consuming resources if they are not cleaned up when playback stops or the page closes.

**Diagnostic Method:**

Inspect the playback lifecycle and verify whether `AudioBufferSourceNode`, `requestAnimationFrame`, and `AudioContext` are properly managed.

**Refactored Solution:**

Stop and disconnect audio sources, cancel animation frames, and close the AudioContext when leaving the page.

```javascript
if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
}
```

**Verification:**

Stop playback and confirm that both the audio and visualizer stop. Refresh or close the page and verify that playback does not continue.

---

## Conclusion

This audit examines three important failure modes in the audio engine: undefined variables, concurrent task execution, and incomplete resource cleanup.

The implementation uses explicit audio source initialization, concurrency guards, and resource cleanup mechanisms.

Further profiling is required to establish that no memory leaks remain.