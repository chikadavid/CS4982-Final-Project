/**
 * Scheduler Evaluation & Comparison
 * Compares baseline and cash-aware scheduling algorithms
 */

import { baselineSchedule, cashAwareSchedule } from "./scheduler.js";
import { simulateSchedule, analyzeTimeline } from "./simulate.js";

/**
 * Compares baseline and cash-aware schedulers
 * @param {import('./models').Task[]} tasks
 * @param {number} initialCash
 * @param {"min_cost" | "max_net_gain"} heuristic
 * @returns {import('./models').EvaluationResult}
 */
export function compareSchedules(tasks, initialCash, heuristic = "min_cost") {
  console.log("\n" + "=".repeat(80));
  console.log("SCHEDULER COMPARISON");
  console.log("=".repeat(80));
  console.log(`Dataset: ${tasks.length} tasks, Initial Cash: $${initialCash}`);
  console.log("=".repeat(80));

  // Run baseline scheduler
  console.log("\n### BASELINE SCHEDULER ###");
  let baselineOrder;
  try {
    baselineOrder = baselineSchedule(tasks);
  } catch (error) {
    console.error("❌ Baseline scheduler failed:", error.message);
    return {
      baseline: {
        minCash: 0,
        completed: false,
        executedTasks: 0,
        negativeEvents: 0,
      },
      cashAware: {
        minCash: 0,
        completed: false,
        executedTasks: 0,
        negativeEvents: 0,
      },
    };
  }

  const baselineTimeline = simulateSchedule(tasks, baselineOrder, initialCash);
  const baselineMetrics = analyzeTimeline(baselineTimeline, tasks.length);

  // Run cash-aware scheduler
  console.log("\n### CASH-AWARE SCHEDULER ###");
  const cashAwareResult = cashAwareSchedule(tasks, initialCash, heuristic);
  const cashAwareTimeline = simulateSchedule(
    tasks,
    cashAwareResult.order,
    initialCash,
  );
  const cashAwareMetrics = analyzeTimeline(cashAwareTimeline, tasks.length);

  // Override with actual deadlock status
  if (cashAwareResult.deadlock) {
    cashAwareMetrics.completed = false;
    cashAwareMetrics.executedTasks = cashAwareResult.order.length;
  }

  // Print comparison
  console.log("\n" + "=".repeat(80));
  console.log("RESULTS COMPARISON");
  console.log("=".repeat(80));
  console.log(
    "Metric".padEnd(25) +
      "Baseline".padEnd(20) +
      "Cash-Aware".padEnd(20) +
      "Winner",
  );
  console.log("-".repeat(80));

  // Completion status
  console.log(
    "Completed All Tasks".padEnd(25) +
      (baselineMetrics.completed ? "✓ Yes" : "✗ No").padEnd(20) +
      (cashAwareMetrics.completed ? "✓ Yes" : "✗ No").padEnd(20) +
      (cashAwareMetrics.completed && !baselineMetrics.completed
        ? "🏆 Cash-Aware"
        : !cashAwareMetrics.completed && baselineMetrics.completed
          ? "🏆 Baseline"
          : "—"),
  );

  // Executed tasks
  console.log(
    "Tasks Executed".padEnd(25) +
      `${baselineMetrics.executedTasks}/${tasks.length}`.padEnd(20) +
      `${cashAwareMetrics.executedTasks}/${tasks.length}`.padEnd(20) +
      (cashAwareMetrics.executedTasks > baselineMetrics.executedTasks
        ? "🏆 Cash-Aware"
        : baselineMetrics.executedTasks > cashAwareMetrics.executedTasks
          ? "🏆 Baseline"
          : "—"),
  );

  // Min cash balance
  console.log(
    "Min Cash Balance".padEnd(25) +
      `$${baselineMetrics.minCash.toFixed(2)}`.padEnd(20) +
      `$${cashAwareMetrics.minCash.toFixed(2)}`.padEnd(20) +
      (cashAwareMetrics.minCash > baselineMetrics.minCash
        ? "🏆 Cash-Aware"
        : baselineMetrics.minCash > cashAwareMetrics.minCash
          ? "🏆 Baseline"
          : "—"),
  );

  // Negative events
  console.log(
    "Negative Cash Events".padEnd(25) +
      baselineMetrics.negativeEvents.toString().padEnd(20) +
      cashAwareMetrics.negativeEvents.toString().padEnd(20) +
      (cashAwareMetrics.negativeEvents < baselineMetrics.negativeEvents
        ? "🏆 Cash-Aware"
        : baselineMetrics.negativeEvents < cashAwareMetrics.negativeEvents
          ? "🏆 Baseline"
          : "—"),
  );

  console.log("=".repeat(80));

  // Key insight
  if (cashAwareMetrics.minCash >= 0 && baselineMetrics.minCash < 0) {
    console.log(
      "💡 KEY INSIGHT: Cash-aware scheduler maintains positive cash flow!",
    );
  } else if (!baselineMetrics.completed && cashAwareMetrics.completed) {
    console.log(
      "💡 KEY INSIGHT: Only cash-aware scheduler completes all tasks!",
    );
  } else if (cashAwareResult.deadlock) {
    console.log(
      "⚠️  WARNING: Cash-aware scheduler encountered deadlock - insufficient initial capital!",
    );
  }

  console.log("=".repeat(80) + "\n");

  return {
    baseline: baselineMetrics,
    cashAware: cashAwareMetrics,
  };
}
