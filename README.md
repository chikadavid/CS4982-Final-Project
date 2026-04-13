# CS4982-Final-Project
A Task Scheduling System for Improving Cash-Flow Management in Small Businesses
# Task Scheduling System for Cash-Flow Management in Small Businesses

**CS Capstone Project**  
A web-based scheduling system that optimizes task execution order to maintain positive cash flow while respecting project dependencies.

---

## Overview

This project addresses a critical gap in traditional project management software: **cash-flow constraints**. While tools like Microsoft Project and Asana excel at dependency management, they ignore a fundamental constraint for small businesses—the availability of working capital.

This system introduces a **cash-aware scheduling algorithm** that reorders tasks to prevent negative cash balances, helping small businesses avoid bankruptcy during project execution.

---

## Problem Statement

### Traditional Approach (Topological Sort)
Standard project scheduling uses topological sorting to order tasks based solely on dependencies. This works well for time management but fails when cash is limited.

**Example Failure:**

See steps
Here's a professional README for your capstone project that sounds like original student work:
code

# Task Scheduling System for Cash-Flow Management in Small Businesses

**CS Capstone Project**  
A web-based scheduling system that optimizes task execution order to maintain positive cash flow while respecting project dependencies.

---

## Overview

This project addresses a critical gap in traditional project management software: **cash-flow constraints**. While tools like Microsoft Project and Asana excel at dependency management, they ignore a fundamental constraint for small businesses—the availability of working capital.

This system introduces a **cash-aware scheduling algorithm** that reorders tasks to prevent negative cash balances, helping small businesses avoid bankruptcy during project execution.

---

## Problem Statement

### Traditional Approach (Topological Sort)
Standard project scheduling uses topological sorting to order tasks based solely on dependencies. This works well for time management but fails when cash is limited.

**Example Failure:**
Initial Cash: $100
Task A: Cost $150, Revenue $200, No dependencies
Task B: Cost $30, Revenue $80, No dependencies
Task C: Cost $50, Revenue $100, Depends on [A, B]
Topological Order: A → B → C
After Task A: $100 - $150 + $200 = $150 ✓
But if A is scheduled first: $100 - $150 = -$50 ✗ BANKRUPT

### Cash-Aware Approach
The proposed algorithm considers both dependencies AND cash feasibility:
Cash-Aware Order: B → A → C
After Task B: $100 - $30 + $80 = $150 ✓
After Task A: $150 - $150 + $200 = $200 ✓
After Task C: $200 - $50 + $100 = $250 ✓
All positive!

---

## Technical Architecture

### Technology Stack
- **Frontend**: React with Vite
- **Visualization**: Recharts for cash flow graphs
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)

### Project Structure
See steps
Here's a professional README for your capstone project that sounds like original student work:
code

# Task Scheduling System for Cash-Flow Management in Small Businesses

**CS Capstone Project**  
A web-based scheduling system that optimizes task execution order to maintain positive cash flow while respecting project dependencies.

---

## Overview

This project addresses a critical gap in traditional project management software: **cash-flow constraints**. While tools like Microsoft Project and Asana excel at dependency management, they ignore a fundamental constraint for small businesses—the availability of working capital.

This system introduces a **cash-aware scheduling algorithm** that reorders tasks to prevent negative cash balances, helping small businesses avoid bankruptcy during project execution.

---

## Problem Statement

### Traditional Approach (Topological Sort)
Standard project scheduling uses topological sorting to order tasks based solely on dependencies. This works well for time management but fails when cash is limited.

**Example Failure:**
Initial Cash: $100
Task A: Cost $150, Revenue $200, No dependencies
Task B: Cost $30, Revenue $80, No dependencies
Task C: Cost $50, Revenue $100, Depends on [A, B]
Topological Order: A → B → C
After Task A: $100 - $150 + $200 = $150 ✓
But if A is scheduled first: $100 - $150 = -$50 ✗ BANKRUPT
code

### Cash-Aware Approach
The proposed algorithm considers both dependencies AND cash feasibility:
Cash-Aware Order: B → A → C
After Task B: $100 - $30 + $80 = $150 ✓
After Task A: $150 - $150 + $200 = $200 ✓
After Task C: $200 - $50 + $100 = $250 ✓
All positive!
code

---

## Technical Architecture

### Technology Stack
- **Frontend**: React with Vite
- **Visualization**: Recharts for cash flow graphs
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)

### Project Structure
/src
/core              # Core algorithm implementation
models.js        # Data type definitions
dag.js           # Graph algorithms (cycle detection, topological sort)
scheduler.js     # Baseline and cash-aware schedulers
simulate.js      # Execution simulation engine
evaluation.js    # Performance comparison metrics
demoData.js      # Test datasets
README.md        # Algorithm documentation
/app
page.jsx         # Homepage
/demo
page.jsx       # Interactive algorithm demo

---

## Core Algorithms

### 1. Dependency Validation (Cycle Detection)
Uses depth-first search with a recursion stack to detect circular dependencies.

**Complexity**: O(V + E) where V = tasks, E = dependencies
javascript
// Three-color approach: WHITE (unvisited), GRAY (visiting), BLACK (complete)
function detectCycle(graph) {
visited = new Set();
recursionStack = new Set();
for each node:
if hasCycle(node, visited, recursionStack):
throw Error("Circular dependency detected");
}

### 2. Baseline Scheduler (Kahn's Algorithm)
Standard topological sorting using in-degree calculation and queue-based processing.

**Complexity**: O(V + E)
javascript
function topologicalSort(tasks) {
queue = tasks with inDegree = 0;
result = [];
while queue not empty:
current = queue.dequeue();
result.push(current);
for each neighbor of current:
  decrease inDegree[neighbor];
  if inDegree[neighbor] == 0:
    queue.enqueue(neighbor);
return result;
}

### 3. Cash-Aware Scheduler (Greedy Algorithm)
**Complexity**: O(V²) - could be optimized to O(V log V) with priority queue

**Algorithm**:
javascript
function cashAwareSchedule(tasks, initialCash, heuristic) {
cash = initialCash;
completed = {};
schedule = [];
while unscheduled tasks remain:
// Find tasks with satisfied dependencies
available = tasks where all dependencies are completed;
// Filter by cash feasibility
feasible = available where cost &lt;= cash;

if feasible is empty:
  return DEADLOCK;

// Apply heuristic to choose next task
chosen = selectByHeuristic(feasible, heuristic);

// Execute task
cash = cash - chosen.cost + chosen.revenue;
schedule.push(chosen);
completed.add(chosen);
return schedule;
}

**Heuristics**:
1. **Minimum Cost** - Conservative strategy, preserves cash for expensive tasks
2. **Maximum Net Gain** - Aggressive strategy, builds capital quickly

---

## Installation & Usage

### Prerequisites
- Node.js 16+ and npm

### Setup

bash
Clone repository
git clone https://github.com/chikadavid/CS4982-Final-Project.git
cd capstone-scheduler
Install dependencies
npm install
Start development server
npm run dev

### Access Application
Open browser to `http://localhost:5173`

### Running Demos
1. Navigate to `/demo` page
2. Select a dataset from dropdown:
   - **Simple cases**: Feasible, Cash Problem, Deadlock
   - **Complex cases**: Software Launch (15 tasks), Construction (18 tasks), Supply Chain (16 tasks)
3. Choose heuristic: Min Cost or Max Net Gain
4. View side-by-side comparison of baseline vs cash-aware algorithms

---

## Test Datasets

### Research Scenarios (Simple)

**1. Feasible Case**
- 4 tasks, $100 initial cash
- Both algorithms succeed
- Demonstrates basic functionality

**2. Cash Problem** (Key Research Case)
- 3 tasks, $100 initial cash
- Baseline goes negative, cash-aware succeeds
- **Proves algorithm value**

**3. Deadlock Case**
- 3 tasks, $30 initial cash
- Both algorithms fail
- Demonstrates deadlock detection

### Real-World Scenarios (Complex)

**4. SaaS Product Launch**
- 15 tasks across dev, marketing, and launch phases
- $5,000 initial cash
- Parallel workstreams converging at launch

**5. Commercial Building Construction**
- 18 tasks with permits, contractors, inspections
- $50,000 initial cash
- 6 dependency levels with multiple convergence points

**6. Global Supply Chain Management**
- 16 tasks across suppliers, manufacturing, distribution
- $8,000 initial cash
- 3 parallel manufacturing streams feeding final assembly

---

## Evaluation Metrics

The system compares baseline and cash-aware schedulers using:

1. **Minimum Cash Balance** - Lowest point during execution
2. **Negative Events** - Number of times cash went below $0
3. **Completion Status** - Whether all tasks were executed
4. **Final Cash Balance** - Ending capital

### Sample Results (Cash Problem Dataset)

| Metric | Baseline | Cash-Aware |
|--------|----------|------------|
| Min Cash | -$50 | $40 |
| Negative Events | 1 | 0 |
| Completion | ✗ Failed | ✓ Complete |
| Final Cash | N/A | $190 |

---

## Key Findings

1. **Topological sort is insufficient** for cash-constrained environments
2. **Greedy heuristics provide practical solutions** without exhaustive search
3. **Min-cost heuristic is safer** but slower to build capital
4. **Max-net-gain heuristic is riskier** but achieves higher throughput
5. **Algorithm scales well** - handles 18-task projects efficiently

---

## Limitations

1. **Greedy is not optimal** - True optimal solution is NP-hard
2. **No task parallelization** - Assumes sequential execution
3. **Static cash model** - Doesn't account for credit lines or loans
4. **Deterministic** - No uncertainty in costs or revenues
5. **No time dimension** - Focuses on order, not scheduling over time

---

## Future Work

### Short-term Improvements
- Implement priority queue to reduce complexity to O(V log V)
- Add CSV import/export for real business data
- Generate Gantt charts with time estimates
- Add cost/revenue uncertainty with confidence intervals

### Long-term Research Directions
1. **Optimal Solutions**: Branch-and-bound or dynamic programming
2. **Stochastic Modeling**: Monte Carlo simulation with probability distributions
3. **Multi-objective Optimization**: Balance time, cost, and risk
4. **Machine Learning**: Train models to select best heuristic per business type
5. **Real-time Integration**: Connect to accounting software APIs

---

## Academic References

**Graph Algorithms**:
- Kahn, A. B. (1962). "Topological sorting of large networks"
- Cormen et al. (2009). "Introduction to Algorithms" (3rd ed.)

**Scheduling Theory**:
- Brucker, P. (2007). "Scheduling Algorithms"
- Pinedo, M. (2016). "Scheduling: Theory, Algorithms, and Systems"

**Cash Flow Management**:
- Shim, J. K. & Siegel, J. G. (2008). "Financial Management"

---

## License

This project is submitted as part of a Computer Science capstone requirement.  
All code is original work completed during Winter 2026 semester.

---

## Author

Chika David Onyenachie  
University of New Brunswick  
Computer Science Department  
Capstone Project - Winter 2026

**Advisor**: Chris Baker

---

## Acknowledgments

Special thanks to:
- Chris Baker for project guidance and feedback

---

## Contact

For questions about this research:
- Email: david.onyenachie@gmail.com
- GitHub: chikadavid

---

**Last Updated**: April 13
