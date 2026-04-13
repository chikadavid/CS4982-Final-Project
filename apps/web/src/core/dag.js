/**
 * DAG (Directed Acyclic Graph) utilities
 * Implements cycle detection and topological sorting for task dependencies
 */

/**
 * Builds adjacency list and in-degree map from tasks
 * @param {import('./models').Task[]} tasks
 * @returns {{ adjList: Map<string, string[]>, inDegree: Map<string, number>, taskMap: Map<string, import('./models').Task> }}
 */
export function buildGraph(tasks) {
  const adjList = new Map();
  const inDegree = new Map();
  const taskMap = new Map();

  // Initialize all nodes
  for (const task of tasks) {
    taskMap.set(task.id, task);
    adjList.set(task.id, []);
    inDegree.set(task.id, 0);
  }

  // Build edges
  for (const task of tasks) {
    for (const depId of task.deps) {
      if (!taskMap.has(depId)) {
        throw new Error(
          `Task "${task.id}" depends on non-existent task "${depId}"`,
        );
      }
      // Edge from dependency to dependent task
      adjList.get(depId).push(task.id);
      inDegree.set(task.id, inDegree.get(task.id) + 1);
    }
  }

  return { adjList, inDegree, taskMap };
}

/**
 * Detects cycles in the task dependency graph using DFS
 * @param {import('./models').Task[]} tasks
 * @throws {Error} If a cycle is detected
 */
export function detectCycle(tasks) {
  const { adjList, taskMap } = buildGraph(tasks);
  const visited = new Set();
  const recStack = new Set(); // Recursion stack for DFS

  /**
   * DFS helper to detect cycles
   * @param {string} nodeId
   * @returns {boolean} True if cycle detected
   */
  function dfs(nodeId) {
    visited.add(nodeId);
    recStack.add(nodeId);

    // Visit all neighbors
    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true; // Cycle found in subtree
        }
      } else if (recStack.has(neighbor)) {
        // Back edge detected - cycle exists
        return true;
      }
    }

    recStack.delete(nodeId); // Remove from recursion stack
    return false;
  }

  // Check all nodes (handles disconnected components)
  for (const taskId of taskMap.keys()) {
    if (!visited.has(taskId)) {
      if (dfs(taskId)) {
        throw new Error(
          `Cycle detected in task dependencies! Cannot schedule tasks with circular dependencies.`,
        );
      }
    }
  }
}

/**
 * Performs topological sort using Kahn's algorithm (BFS-based)
 * @param {import('./models').Task[]} tasks
 * @returns {string[]} Topologically sorted task IDs
 * @throws {Error} If cycle is detected
 */
export function topologicalSort(tasks) {
  // First validate no cycles exist
  detectCycle(tasks);

  const { adjList, inDegree } = buildGraph(tasks);
  const result = [];
  const queue = [];

  // Find all nodes with in-degree 0 (no dependencies)
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // Kahn's algorithm: process nodes in topological order
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    // Reduce in-degree of neighbors
    const neighbors = adjList.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = inDegree.get(neighbor) - 1;
      inDegree.set(neighbor, newDegree);

      // If in-degree becomes 0, add to queue
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If not all nodes processed, there's a cycle (shouldn't happen due to detectCycle)
  if (result.length !== tasks.length) {
    throw new Error(
      `Topological sort failed: expected ${tasks.length} tasks, got ${result.length}. Cycle may exist.`,
    );
  }

  return result;
}
