/**
 * Core data models for the Task Scheduling System
 * Research Project: Cash-Flow Management in Small Businesses
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {number} cost - Upfront cost required to execute this task
 * @property {number} revenue - Revenue generated upon task completion
 * @property {string[]} deps - List of task IDs that must complete before this task can start
 */

/**
 * @typedef {Object} CashAwareResult
 * @property {string[]} order - Execution order of task IDs
 * @property {boolean} deadlock - Whether the scheduler encountered a deadlock
 * @property {string[]} [blockedTasks] - Tasks that could not be scheduled
 * @property {number} finalCash - Final cash balance after all scheduled tasks
 * @property {number} minCash - Minimum cash balance encountered during execution
 */

/**
 * @typedef {Object} TimelineEntry
 * @property {string} taskId - Task that was executed
 * @property {number} cashBefore - Cash balance before task execution
 * @property {number} cost - Cost paid to execute the task
 * @property {number} revenue - Revenue received from task completion
 * @property {number} cashAfter - Cash balance after task execution
 */

/**
 * @typedef {Object} SchedulerMetrics
 * @property {number} minCash - Minimum cash balance
 * @property {boolean} completed - Whether all tasks were completed
 * @property {number} executedTasks - Number of tasks executed
 * @property {number} negativeEvents - Number of times cash went negative
 */

/**
 * @typedef {Object} EvaluationResult
 * @property {SchedulerMetrics} baseline - Baseline scheduler metrics
 * @property {SchedulerMetrics} cashAware - Cash-aware scheduler metrics
 */

export {};
