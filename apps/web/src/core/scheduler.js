/**
 * Baseline scheduler: simple topological sort
 * Ignores cash constraints - just respects dependencies
 * @param {import('./models').Task[]} tasks
 * @returns {string[]} Task IDs in execution order
 */
export function baselineSchedule(tasks) {
  console.log(`🔵 Running Baseline Scheduler (Topological Sort)`);
  console.log(`   - ${tasks.length} tasks total`);

  const taskMap = new Map();
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  const completed = new Set();
  const order = [];
  const remaining = new Set(tasks.map((t) => t.id));

  while (remaining.size > 0) {
    // Find tasks whose dependencies are satisfied
    const available = Array.from(remaining).filter((taskId) => {
      const task = taskMap.get(taskId);
      return task.deps.every((depId) => completed.has(depId));
    });

    if (available.length === 0) {
      console.log("   ⚠️ Cyclic dependency detected");
      break;
    }

    // Pick first available task (simple strategy)
    const chosenTaskId = available[0];
    order.push(chosenTaskId);
    completed.add(chosenTaskId);
    remaining.delete(chosenTaskId);
  }

  console.log(`   ✓ Completed: ${order.join(" → ")}`);
  return order;
}

export function cashAwareSchedule(tasks, initialCash, heuristic = "min_cost") {
  console.log(`🟢 Running Cash-Aware Scheduler (${heuristic})`);
  console.log(`   - Initial cash: $${initialCash}`);
  console.log(`   - Heuristic: ${heuristic}`);

  const taskMap = new Map();
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  const completed = new Set();
  const order = [];
  let currentCash = initialCash;
  let minCash = initialCash;
  const remaining = new Set(tasks.map((t) => t.id));

  let iteration = 0;
  while (remaining.size > 0) {
    iteration++;
    console.log(
      `\n   Iteration ${iteration}: Cash = $${currentCash.toFixed(
        2,
      )}, Remaining = ${remaining.size}`,
    );

    // Step 1: Find available tasks (dependencies satisfied)
    const available = Array.from(remaining).filter((taskId) => {
      const task = taskMap.get(taskId);
      return task.deps.every((depId) => completed.has(depId));
    });

    console.log(`      Available tasks: [${available.join(", ")}]`);

    if (available.length === 0) {
      console.log(
        "      ⚠️  No available tasks but tasks remain - dependency issue",
      );
      break;
    }

    // Step 2: Filter to affordable tasks
    const feasible = available.filter((taskId) => {
      const task = taskMap.get(taskId);
      return task.cost <= currentCash;
    });

    console.log(`      Affordable tasks: [${feasible.join(", ")}]`);

    // Step 3: Smart recovery — if nothing affordable, look for a revenue bridge
    if (feasible.length === 0) {
      console.log(
        "      ⚠️  No affordable tasks — searching for revenue bridge...",
      );

      // Look through ALL remaining tasks (not just available) for any that:
      // a) are affordable, and
      // b) generate enough revenue to unlock a currently blocked task
      const allRemaining = Array.from(remaining);

      // Find the cheapest blocked task we want to unlock
      const cheapestBlocked = available
        .map((id) => taskMap.get(id))
        .sort((a, b) => a.cost - b.cost)[0];

      console.log(
        `      🎯 Cheapest blocked task: ${cheapestBlocked.id} needs $${cheapestBlocked.cost}`,
      );

      // Find any remaining task that is affordable AND whose revenue
      // would push us over the cheapest blocked task's cost
      const bridge = allRemaining
        .map((id) => taskMap.get(id))
        .filter((task) => {
          const depsComplete = task.deps.every((depId) => completed.has(depId));
          const affordable = task.cost <= currentCash;
          const generatesEnough =
            currentCash - task.cost + task.revenue >= cheapestBlocked.cost;
          return depsComplete && affordable && generatesEnough;
        })
        .sort((a, b) => b.revenue - b.cost - (a.revenue - a.cost))[0]; // best net gain first

      if (bridge) {
        console.log(
          `      🌉 Bridge task found: ${bridge.id} (cost=$${bridge.cost}, revenue=$${bridge.revenue})`,
        );
        currentCash = currentCash - bridge.cost + bridge.revenue;
        minCash = Math.min(minCash, currentCash);
        order.push(bridge.id);
        completed.add(bridge.id);
        remaining.delete(bridge.id);
        console.log(
          `      → New cash after bridge: $${currentCash.toFixed(2)}`,
        );
        continue; // restart the loop with new cash
      }

      // No bridge found — true deadlock
      console.log(
        "      ❌ DEADLOCK: No bridge task found, insufficient capital",
      );
      return {
        order,
        deadlock: true,
        blockedTasks: Array.from(remaining),
        finalCash: currentCash,
        minCash,
      };
    }

    // Step 4: Score feasible tasks with smart heuristic
    let chosenTaskId;

    if (heuristic === "min_cost") {
      // Among affordable tasks, prefer ones that generate revenue
      // to build cash for expensive tasks ahead
      chosenTaskId = feasible.reduce((bestId, id) => {
        const best = taskMap.get(bestId);
        const current = taskMap.get(id);

        // If current generates revenue and best doesn't, prefer current
        if (current.revenue > 0 && best.revenue === 0) return id;
        if (best.revenue > 0 && current.revenue === 0) return bestId;

        // Both generate revenue or both don't — pick cheaper
        return current.cost < best.cost ? id : bestId;
      });
    } else {
      // max_net_gain: pick highest revenue - cost
      // but break ties by preferring tasks that unblock expensive dependents
      chosenTaskId = feasible.reduce((bestId, id) => {
        const best = taskMap.get(bestId);
        const current = taskMap.get(id);
        const bestGain = best.revenue - best.cost;
        const currentGain = current.revenue - current.cost;

        if (currentGain !== bestGain)
          return currentGain > bestGain ? id : bestId;

        // Tiebreak: whose dependents have higher total value?
        const bestDownstreamValue = tasks
          .filter((t) => t.deps.includes(best.id))
          .reduce((sum, t) => sum + t.revenue - t.cost, 0);
        const currentDownstreamValue = tasks
          .filter((t) => t.deps.includes(current.id))
          .reduce((sum, t) => sum + t.revenue - t.cost, 0);

        return currentDownstreamValue > bestDownstreamValue ? id : bestId;
      });
    }

    const chosenTask = taskMap.get(chosenTaskId);
    console.log(
      `      ✓ Selected: ${chosenTaskId} (cost=$${chosenTask.cost}, revenue=$${chosenTask.revenue})`,
    );

    // Step 5: Execute task
    currentCash = currentCash - chosenTask.cost + chosenTask.revenue;
    minCash = Math.min(minCash, currentCash);
    order.push(chosenTaskId);
    completed.add(chosenTaskId);
    remaining.delete(chosenTaskId);

    console.log(`      → New cash: $${currentCash.toFixed(2)}`);
  }

  const success = remaining.size === 0;
  console.log(`\n   ${success ? "✓" : "⚠️"} Completed: ${order.join(" → ")}`);
  console.log(
    `   Final cash: $${currentCash.toFixed(2)}, Min cash: $${minCash.toFixed(
      2,
    )}`,
  );

  return {
    order,
    deadlock: false,
    finalCash: currentCash,
    minCash,
  };
}
