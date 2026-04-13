# Task Scheduling System - Core Algorithms

**Research Project**: A Task Scheduling System for Improving Cash-Flow Management in Small Businesses

## Overview

This directory contains the core algorithms for a novel task scheduling system that considers cash flow constraints in addition to task dependencies. Traditional project management tools (using topological sort) can schedule tasks in a dependency-valid order but may cause negative cash flow for small businesses with limited capital.

## Architecture

### Module Structure

```
core/
├── models.js         # Type definitions (JSDoc)
├── dag.js           # Graph algorithms (cycle detection, topological sort)
├── scheduler.js     # Baseline and cash-aware scheduling algorithms
├── simulate.js      # Task execution simulation
├── evaluation.js    # Algorithm comparison
└── demoData.js      # Test datasets
```

## Algorithms

### 1. Baseline Scheduler (`baselineSchedule`)

**Algorithm**: Topological Sort (Kahn's Algorithm)

**Complexity**: O(V + E) where V = tasks, E = dependencies

**Approach**:
- Build adjacency list and in-degree map
- Queue all tasks with in-degree 0 (no dependencies)
- Process tasks in topological order
- **Limitation**: Ignores cash constraints, may cause negative balance

**Use Case**: Traditional project management where cash flow is not a concern

### 2. Cash-Aware Scheduler (`cashAwareSchedule`)

**Algorithm**: Greedy with Cash Constraints

**Complexity**: O(V²) in worst case

**Approach**:
```
Initialize: cash = initialCash, completed = ∅, remaining = all tasks

While remaining tasks exist:
  1. Find available tasks (dependencies satisfied)
  2. Filter to feasible tasks (cost ≤ currentCash)
  3. If no feasible tasks → DEADLOCK
  4. Select task using heuristic:
     - min_cost: Choose cheapest task (preserves cash)
     - max_net_gain: Choose highest (revenue - cost)
  5. Execute: cash = cash - cost + revenue
  6. Mark task as completed
```

**Key Innovation**: Ensures positive cash flow by reordering tasks to build capital before expensive operations

**Heuristics**:
- `min_cost`: Conservative approach, minimizes risk
- `max_net_gain`: Aggressive approach, maximizes profit

### 3. Cycle Detection (`detectCycle`)

**Algorithm**: Depth-First Search (DFS) with Recursion Stack

**Complexity**: O(V + E)

**Approach**:
- Perform DFS traversal
- Maintain recursion stack
- Back edge detection indicates cycle
- Throws error if cycle found (invalid DAG)

### 4. Topological Sort (`topologicalSort`)

**Algorithm**: Kahn's Algorithm (BFS-based)

**Complexity**: O(V + E)

**Steps**:
1. Build graph and compute in-degrees
2. Queue nodes with in-degree 0
3. Process queue, reducing neighbor in-degrees
4. Add nodes to result as in-degree reaches 0
5. Verify all nodes processed (else cycle exists)

## Data Structures

### Task
```javascript
{
  id: string,        // Unique identifier
  cost: number,      // Upfront cost to execute
  revenue: number,   // Revenue upon completion
  deps: string[]     // Task IDs that must complete first
}
```

### Timeline Entry
```javascript
{
  taskId: string,
  cashBefore: number,
  cost: number,
  revenue: number,
  cashAfter: number
}
```

## Test Datasets

### 1. Feasible Case
- **Initial Cash**: $100
- **Outcome**: Both schedulers succeed
- **Purpose**: Baseline validation

### 2. Cash Problem
- **Initial Cash**: $100
- **Outcome**: Baseline goes negative, cash-aware succeeds
- **Purpose**: Demonstrates main research contribution

### 3. Deadlock Case
- **Initial Cash**: $30
- **Outcome**: Both schedulers fail (insufficient capital)
- **Purpose**: Shows detection of unsolvable scenarios

## Usage Example

```javascript
import { baselineSchedule, cashAwareSchedule } from '@/core/scheduler';
import { compareSchedules } from '@/core/evaluation';
import { feasibleCase } from '@/core/demoData';

// Run baseline
const baselineOrder = baselineSchedule(feasibleCase.tasks);

// Run cash-aware
const cashAwareResult = cashAwareSchedule(
  feasibleCase.tasks,
  feasibleCase.initialCash,
  'min_cost'
);

// Compare both
const comparison = compareSchedules(
  feasibleCase.tasks,
  feasibleCase.initialCash,
  'min_cost'
);
```

## Key Metrics

- **Min Cash Balance**: Lowest cash during execution (negative = problem)
- **Completion Status**: Whether all tasks were executed
- **Negative Events**: Number of times cash went negative
- **Executed Tasks**: Count of successfully scheduled tasks

## Research Contributions

1. **Novel Constraint**: First scheduler to combine DAG dependencies with cash flow
2. **Practical Application**: Addresses real small business problem
3. **Deadlock Detection**: Identifies unsolvable scenarios early
4. **Heuristic Comparison**: Provides multiple strategies (conservative vs aggressive)

## Future Work

- Dynamic programming for optimal solution (current is greedy)
- Machine learning for heuristic selection
- Multi-resource constraints (time, labor, materials)
- Integration with real accounting systems
- Stochastic revenue modeling

## Academic Notes

- All algorithms have clear complexity bounds
- Console logging provides execution trace
- Modular design supports extension
- Well-documented for paper inclusion
- Test cases demonstrate key scenarios

---

**Author**: CS Capstone Project  
**Date**: March 2026  
**License**: Academic Use
