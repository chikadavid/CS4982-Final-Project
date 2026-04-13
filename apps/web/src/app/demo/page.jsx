"use client";

import { useEffect, useState } from "react";
import { allDatasets, getDataset } from "@/core/demoData";
import { compareSchedules } from "@/core/evaluation";
import { baselineSchedule, cashAwareSchedule } from "@/core/scheduler";
import { simulateSchedule } from "@/core/simulate";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export default function AlgorithmDemo() {
  const [results, setResults] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState("feasible");
  const [heuristic, setHeuristic] = useState("min_cost");

  useEffect(() => {
    // Run algorithm comparison on mount and when dataset changes
    runComparison();
  }, [selectedDataset, heuristic]);

  function runComparison() {
    const dataset = getDataset(selectedDataset);

    console.clear();
    console.log("🎓 RESEARCH PROJECT DEMO");
    console.log("Task Scheduling System for Cash-Flow Management");
    console.log(`Dataset: ${dataset.name}`);
    console.log("─".repeat(80));

    // Run comparison
    const evaluation = compareSchedules(
      dataset.tasks,
      dataset.initialCash,
      heuristic,
    );

    // Get detailed schedules
    const baselineOrder = baselineSchedule(dataset.tasks);
    const cashAwareResult = cashAwareSchedule(
      dataset.tasks,
      dataset.initialCash,
      heuristic,
    );

    // Get timelines
    const baselineTimeline = simulateSchedule(
      dataset.tasks,
      baselineOrder,
      dataset.initialCash,
    );
    const cashAwareTimeline = simulateSchedule(
      dataset.tasks,
      cashAwareResult.order,
      dataset.initialCash,
    );

    setResults({
      dataset,
      evaluation,
      baselineOrder,
      baselineTimeline,
      cashAwareResult,
      cashAwareTimeline,
    });
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Running algorithms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Task Scheduling Algorithm Demo
          </h1>
          <p className="text-lg text-slate-600">
            Research Project: Cash-Flow Management in Small Businesses
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Test Dataset
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="feasible">Simple Manufacturing Flow</option>
                <option value="cashProblem">Cash Constraint Problem</option>
                <option value="deadlock">Insufficient Capital Deadlock</option>
                <option value="softwareLaunch">
                  🚀 SaaS Product Launch (15 tasks)
                </option>
                <option value="construction">
                  🏗️ Building Construction (18 tasks)
                </option>
                <option value="supplyChain">📦 Supply Chain (16 tasks)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Cash-Aware Heuristic
              </label>
              <select
                value={heuristic}
                onChange={(e) => setHeuristic(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="min_cost">Minimum Cost First</option>
                <option value="max_net_gain">Maximum Net Gain First</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm">
              <strong>Initial Cash:</strong> ${results.dataset.initialCash} |{" "}
              <strong>Tasks:</strong> {results.dataset.tasks.length} |{" "}
              <strong>Dependencies:</strong>{" "}
              {results.dataset.tasks.reduce((sum, t) => sum + t.deps.length, 0)}
            </div>
          </div>
        </div>

        {/* Results Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Results Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Metric
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Baseline
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Cash-Aware
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium">Completed All Tasks</td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.baseline.completed ? (
                      <span className="text-green-600 font-semibold">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ No</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.cashAware.completed ? (
                      <span className="text-green-600 font-semibold">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ No</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.cashAware.completed &&
                    !results.evaluation.baseline.completed ? (
                      <span className="text-blue-600 font-bold">
                        🏆 Cash-Aware
                      </span>
                    ) : !results.evaluation.cashAware.completed &&
                      results.evaluation.baseline.completed ? (
                      <span className="text-slate-600 font-bold">
                        🏆 Baseline
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>

                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium">Tasks Executed</td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.baseline.executedTasks}/
                    {results.dataset.tasks.length}
                  </td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.cashAware.executedTasks}/
                    {results.dataset.tasks.length}
                  </td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.cashAware.executedTasks >
                    results.evaluation.baseline.executedTasks ? (
                      <span className="text-blue-600 font-bold">
                        🏆 Cash-Aware
                      </span>
                    ) : results.evaluation.baseline.executedTasks >
                      results.evaluation.cashAware.executedTasks ? (
                      <span className="text-slate-600 font-bold">
                        🏆 Baseline
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>

                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium">Min Cash Balance</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={
                        results.evaluation.baseline.minCash < 0
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      ${results.evaluation.baseline.minCash.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={
                        results.evaluation.cashAware.minCash < 0
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      ${results.evaluation.cashAware.minCash.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.cashAware.minCash >
                    results.evaluation.baseline.minCash ? (
                      <span className="text-blue-600 font-bold">
                        🏆 Cash-Aware
                      </span>
                    ) : results.evaluation.baseline.minCash >
                      results.evaluation.cashAware.minCash ? (
                      <span className="text-slate-600 font-bold">
                        🏆 Baseline
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>

                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium">
                    Negative Cash Events
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={
                        results.evaluation.baseline.negativeEvents > 0
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {results.evaluation.baseline.negativeEvents}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={
                        results.evaluation.cashAware.negativeEvents > 0
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {results.evaluation.cashAware.negativeEvents}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {results.evaluation.cashAware.negativeEvents <
                    results.evaluation.baseline.negativeEvents ? (
                      <span className="text-blue-600 font-bold">
                        🏆 Cash-Aware
                      </span>
                    ) : results.evaluation.baseline.negativeEvents <
                      results.evaluation.cashAware.negativeEvents ? (
                      <span className="text-slate-600 font-bold">
                        🏆 Baseline
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Insight */}
          {results.evaluation.cashAware.minCash >= 0 &&
            results.evaluation.baseline.minCash < 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  💡 KEY INSIGHT: Cash-aware scheduler maintains positive cash
                  flow while baseline goes negative!
                </p>
              </div>
            )}

          {results.cashAwareResult.deadlock && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-semibold">
                ⚠️ WARNING: Cash-aware scheduler encountered deadlock -
                insufficient initial capital!
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Blocked tasks:{" "}
                {results.cashAwareResult.blockedTasks?.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Execution Schedules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Baseline Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-slate-500 rounded-full mr-2"></span>
              Baseline Schedule
            </h3>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Execution Order:</p>
              <div className="flex flex-wrap gap-2">
                {results.baselineOrder.map((taskId, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium"
                  >
                    {idx + 1}. {taskId}
                  </span>
                ))}
              </div>
            </div>
            <CashFlowChart
              timeline={results.baselineTimeline}
              initialCash={results.dataset.initialCash}
              color="rgb(100, 116, 139)"
            />
          </div>

          {/* Cash-Aware Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Cash-Aware Schedule
            </h3>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Execution Order:</p>
              <div className="flex flex-wrap gap-2">
                {results.cashAwareResult.order.map((taskId, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {idx + 1}. {taskId}
                  </span>
                ))}
                {results.cashAwareResult.deadlock && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    DEADLOCK
                  </span>
                )}
              </div>
            </div>
            <CashFlowChart
              timeline={results.cashAwareTimeline}
              initialCash={results.dataset.initialCash}
              color="rgb(37, 99, 235)"
            />
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Task Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Task ID
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Cost
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Net Gain
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Dependencies
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.dataset.tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 font-medium">{task.id}</td>
                    <td className="text-right py-3 px-4 text-red-600">
                      ${task.cost}
                    </td>
                    <td className="text-right py-3 px-4 text-green-600">
                      ${task.revenue}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      ${task.revenue - task.cost}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {task.deps.length > 0 ? task.deps.join(", ") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple cash flow visualization component
function CashFlowChart({ timeline, initialCash, color }) {
  if (timeline.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500 text-sm">No tasks executed</p>
      </div>
    );
  }

  const data = [
    { name: "Start", cash: initialCash },
    ...timeline.map((entry) => ({
      name: entry.taskId,
      cash: entry.cashAfter,
    })),
  ];

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="name"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip formatter={(value) => [`$${value}`, "Cash"]} />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="cash"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
