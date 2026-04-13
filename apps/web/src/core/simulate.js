/**
 * Task Execution Simulator
 * Simulates task execution and tracks cash flow timeline
 */

/**
 * Simulates execution of a task schedule and produces detailed timeline
 * @param {import('./models').Task[]} tasks
 * @param {string[]} schedule - Ordered list of task IDs to execute
 * @param {number} initialCash
 * @returns {import('./models').TimelineEntry[]}
 */
export function simulateSchedule(tasks, schedule, initialCash) {
  // Build task lookup map
  const taskMap = new Map();
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  const timeline = [];
  let currentCash = initialCash;

  for (const taskId of schedule) {
    const task = taskMap.get(taskId);

    if (!task) {
      throw new Error(`Task "${taskId}" not found in task list`);
    }

    const cashBefore = currentCash;
    const cost = task.cost;
    const revenue = task.revenue;
    const cashAfter = currentCash - cost + revenue;

    timeline.push({
      taskId,
      cashBefore,
      cost,
      revenue,
      cashAfter,
    });

    currentCash = cashAfter;
  }

  return timeline;
}

/**
 * Analyzes a timeline to compute metrics
 * @param {import('./models').TimelineEntry[]} timeline
 * @param {number} totalTasks - Total number of tasks in the project
 * @returns {import('./models').SchedulerMetrics}
 */
export function analyzeTimeline(timeline, totalTasks) {
  let minCash = Infinity;
  let negativeEvents = 0;

  for (const entry of timeline) {
    // Track minimum cash during execution
    if (entry.cashAfter < minCash) {
      minCash = entry.cashAfter;
    }

    // Count times cash went negative
    if (entry.cashAfter < 0) {
      negativeEvents++;
    }
  }

  // If no timeline, min cash is initial (would need to pass separately)
  if (timeline.length === 0) {
    minCash = 0;
  }

  return {
    minCash,
    completed: timeline.length === totalTasks,
    executedTasks: timeline.length,
    negativeEvents,
  };
}

/**
 * Pretty prints a timeline to console
 * @param {import('./models').TimelineEntry[]} timeline
 */
export function printTimeline(timeline) {
  console.log("\n📊 Execution Timeline:");
  console.log("─".repeat(80));
  console.log(
    "Step".padEnd(6) +
      "Task".padEnd(10) +
      "Cash Before".padEnd(15) +
      "Cost".padEnd(10) +
      "Revenue".padEnd(12) +
      "Cash After",
  );
  console.log("─".repeat(80));

  timeline.forEach((entry, idx) => {
    console.log(
      `${(idx + 1).toString().padEnd(6)}` +
        `${entry.taskId.padEnd(10)}` +
        `$${entry.cashBefore.toFixed(2).padEnd(14)}` +
        `$${entry.cost.toFixed(2).padEnd(9)}` +
        `$${entry.revenue.toFixed(2).padEnd(11)}` +
        `$${entry.cashAfter.toFixed(2)}` +
        (entry.cashAfter < 0 ? " ⚠️" : ""),
    );
  });

  console.log("─".repeat(80));
}
