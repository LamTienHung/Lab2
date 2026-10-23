export class AudioQueue {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    // Add a new audio task to the end of the queue
    enqueue(url) {
        const task = {
            id: this.nextId++,
            url: url,
            status: "pending",
            controller: new AbortController()
        };

        this.tasks.push(task);
        return task;
    }

    // Remove and return the first task
    dequeue() {
        if (this.tasks.length === 0) {
            return null;
        }

        return this.tasks.shift();
    }

    // View the first task without removing it
    peek() {
        return this.tasks.length > 0
            ? this.tasks[0]
            : null;
    }

    // Cancel a pending task by ID
    cancelTask(taskId) {
        const index = this.tasks.findIndex(
            task => task.id === taskId
        );

        if (index === -1) {
            return false;
        }

        const task = this.tasks[index];
        task.controller.abort();
        task.status = "cancelled";

        this.tasks.splice(index, 1);
        return true;
    }

    // Return all pending tasks
    getTasks() {
        return [...this.tasks];
    }

    // Return the number of pending tasks
    get size() {
        return this.tasks.length;
    }

    // Check whether the queue is empty
    isEmpty() {
        return this.tasks.length === 0;
    }
}