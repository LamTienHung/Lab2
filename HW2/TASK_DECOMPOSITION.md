# Homework 2 - Task Decomposition

## Objective

Build a Concurrent FIFO Audio Visualizer Queue Engine using the Web Audio API, with asynchronous task processing, audio visualization, cancellation, and memory safety.

## Tasks

- [x] Task 2.1: Build the semantic HTML interface for the audio player.
- [x] Task 2.2: Design a responsive interface using CSS.
- [x] Task 2.3: Implement the Web Audio API and AudioContext.
- [x] Task 2.4: Implement a FIFO queue for audio loading and decoding.
- [x] Task 2.5: Handle asynchronous audio tasks and concurrency control.
- [x] Task 2.6: Implement AbortController for task cancellation.
- [x] Task 2.7: Implement AnalyserNode with FFT size 256 or 512.
- [x] Task 2.8: Build a real-time audio visualizer using Canvas.
- [x] Task 2.9: Optimize visualization using requestAnimationFrame.
- [x] Task 2.10: Implement audio resource cleanup and prevent memory leaks.
- [x] Task 2.11: Test FIFO processing, cancellation, and visualization.
- [ ] Task 2.12: Complete atomic Git commits and push to GitHub.

## Expected Results

- Audio tracks are processed in FIFO order.
- Concurrent requests are handled safely.
- Users can play and cancel audio tasks.
- Audio frequencies are visualized in real time.
- The visualizer updates smoothly using requestAnimationFrame.
- Audio resources are properly cleaned up.
- The interface works on desktop and mobile devices.