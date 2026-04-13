import React, { useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Play,
  Settings,
  AlertTriangle,
  CheckCircle,
  FileJson,
  LayoutDashboard,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";
import Papa from "papaparse";

// Cash-Flow Task Scheduling System - CS Capstone Prototype
// Demonstrates baseline vs. cash-aware scheduling algorithms

// --- Logic & Algorithms ---

const topologicalSort = (tasks) => {
  const adj = {};
  const inDegree = {};
  const tasksById = {};

  tasks.forEach((t) => {
    tasksById[t.id] = t;
    adj[t.id] = [];
    inDegree[t.id] = 0;
  });

  tasks.forEach((t) => {
    (t.deps || []).forEach((depId) => {
      if (adj[depId]) {
        adj[depId].push(t.id);
        inDegree[t.id]++;
      }
    });
  });

  const queue = Object.keys(inDegree).filter((id) => inDegree[id] === 0);
  const result = [];

  while (queue.length > 0) {
    const u = queue.shift();
    result.push(u);

    (adj[u] || []).forEach((v) => {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    });
  }

  if (result.length !== tasks.length) {
    throw new Error("Cycle detected in dependencies!");
  }

  return result;
};

const cashAwareSchedule = (tasks, initialCash, heuristic) => {
  const tasksById = {};
  const adj = {};
  const inDegree = {};
  const tasksToSchedule = new Set();

  tasks.forEach((t) => {
    tasksById[t.id] = t;
    adj[t.id] = [];
    inDegree[t.id] = 0;
    tasksToSchedule.add(t.id);
  });

  tasks.forEach((t) => {
    (t.deps || []).forEach((depId) => {
      if (adj[depId]) {
        adj[depId].push(t.id);
        inDegree[t.id]++;
      }
    });
  });

  const completed = new Set();
  const schedule = [];
  let currentCash = initialCash;

  while (tasksToSchedule.size > 0) {
    const available = Array.from(tasksToSchedule).filter((id) => {
      const deps = tasksById[id].deps || [];
      return deps.every((d) => completed.has(d));
    });

    if (available.length === 0) break;

    const feasible = available
      .map((id) => tasksById[id])
      .filter((t) => t.cost <= currentCash);

    if (feasible.length === 0)
      return { schedule, status: "deadlock", finalCash: currentCash };

    let chosen;
    if (heuristic === "min_cost") {
      chosen = feasible.reduce((prev, curr) =>
        prev.cost < curr.cost ? prev : curr
      );
    } else {
      chosen = feasible.reduce((prev, curr) =>
        prev.revenue - prev.cost > curr.revenue - curr.cost ? prev : curr
      );
    }

    schedule.push(chosen.id);
    currentCash = currentCash - chosen.cost + chosen.revenue;
    completed.add(chosen.id);
    tasksToSchedule.delete(chosen.id);
  }

  return { schedule, status: "complete", finalCash: currentCash };
};

const simulate = (schedule, tasks, initialCash) => {
  const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]));
  let currentCash = initialCash;
  let minBalance = initialCash;
  let negativeEvents = 0;

  const history = schedule.map((id, idx) => {
    const t = tasksById[id];
    const before = currentCash;
    const afterCost = currentCash - t.cost;
    if (afterCost < 0) negativeEvents++;
    currentCash = afterCost + t.revenue;
    minBalance = Math.min(minBalance, afterCost);

    return {
      step: idx + 1,
      taskId: id,
      cost: t.cost,
      revenue: t.revenue,
      cashBefore: before,
      cashAfter: currentCash,
      afterCost: afterCost,
    };
  });

  return {
    history,
    metrics: {
      finalCash: currentCash,
      minBalance,
      negativeEvents,
      completed: schedule.length === tasks.length,
    },
  };
};

// --- Components ---

const Card = ({ title, children, icon: Icon, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-900 font-semibold flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const Metric = ({ label, value, subtext, color = "blue" }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    red: "text-rose-600",
    slate: "text-slate-600",
  };
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-2xl font-bold ${colorMap[color] || colorMap.blue}`}>
        {value}
      </p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
};

export default function CapstonePrototype() {
  const [tasks, setTasks] = useState([
    { id: "Materials", cost: 50, revenue: 0, deps: [] },
    { id: "Production", cost: 30, revenue: 0, deps: ["Materials"] },
    { id: "Sales", cost: 10, revenue: 150, deps: ["Production"] },
  ]);
  const [initialCash, setInitialCash] = useState(100);
  const [heuristic, setHeuristic] = useState("min_cost");
  const [view, setView] = useState("dashboard"); // dashboard, input, compare

  const [inputRaw, setInputRaw] = useState(JSON.stringify(tasks, null, 2));

  function cash_aware_scheduler_impl(tasks, initialCash, heuristic) {
    const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]));
    const completed = new Set();
    const schedule = [];
    const remaining = new Set(tasks.map((t) => t.id));
    let currentCash = initialCash;

    while (remaining.size > 0) {
      const available = Array.from(remaining).filter((id) =>
        (tasksById[id].deps || []).every((d) => completed.has(d))
      );
      if (available.length === 0) break;
      const feasible = available
        .map((id) => tasksById[id])
        .filter((t) => t.cost <= currentCash);
      if (feasible.length === 0) return { schedule, status: "deadlock" };
      let chosen;
      if (heuristic === "min_cost") {
        chosen = feasible.reduce((p, c) => (p.cost < c.cost ? p : c));
      } else {
        chosen = feasible.reduce((p, c) =>
          p.revenue - p.cost > c.revenue - c.cost ? p : c
        );
      }
      schedule.push(chosen.id);
      currentCash = currentCash - chosen.cost + chosen.revenue;
      completed.add(chosen.id);
      remaining.delete(chosen.id);
    }
    return { schedule, status: remaining.size === 0 ? "complete" : "deadlock" };
  }

  const baselineResult = useMemo(() => {
    try {
      const schedule = topologicalSort(tasks);
      return simulate(schedule, tasks, initialCash);
    } catch (e) {
      return { error: e.message };
    }
  }, [tasks, initialCash]);

  const cashAwareResult = useMemo(() => {
    const { schedule, status } = cash_aware_scheduler_impl(
      tasks,
      initialCash,
      heuristic
    );
    return { ...simulate(schedule, tasks, initialCash), status };
  }, [tasks, initialCash, heuristic]);

  const handleUpdateTasks = () => {
    try {
      const parsed = JSON.parse(inputRaw);
      setTasks(parsed);
      setView("dashboard");
    } catch (e) {
      alert("Invalid JSON format");
    }
  };

  const chartData = useMemo(() => {
    // Combine baseline and cash aware history for comparison
    const maxSteps = Math.max(
      baselineResult.history?.length || 0,
      cashAwareResult.history?.length || 0
    );
    const data = [{ step: 0, baseline: initialCash, cashAware: initialCash }];

    for (let i = 0; i < maxSteps; i++) {
      data.push({
        step: i + 1,
        baseline: baselineResult.history?.[i]?.cashAfter ?? null,
        cashAware: cashAwareResult.history?.[i]?.cashAfter ?? null,
      });
    }
    return data;
  }, [baselineResult, cashAwareResult, initialCash]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Task Scheduling & Cash-Flow
          </h1>
          <p className="text-slate-500 mt-1">
            Capstone Prototype for Small Business Management
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <a
            href="/demo"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Play className="w-4 h-4" />
            Algorithm Demo
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setView("dashboard")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                view === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => setView("input")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                view === "input"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileJson className="w-4 h-4" /> Data Input
            </button>
            <button
              onClick={() => setView("compare")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                view === "compare"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Comparison
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {view === "dashboard" && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Metric
                  label="Total Tasks"
                  value={tasks.length}
                  subtext="Across all nodes"
                />
                <Metric
                  label="Dependencies"
                  value={tasks.reduce((a, b) => a + (b.deps?.length || 0), 0)}
                  subtext="Total DAG edges"
                />
                <div className="p-4 bg-white rounded-lg border border-slate-100 flex flex-col justify-center">
                  <label className="text-xs font-medium text-slate-500 uppercase mb-1">
                    Initial Cash ($)
                  </label>
                  <input
                    type="number"
                    value={initialCash}
                    onChange={(e) => setInitialCash(Number(e.target.value))}
                    className="text-2xl font-bold text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Chart */}
              <Card title="Cash Balance Simulation" icon={BarChart3}>
                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="step"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value) => [`$${value}`, ""]}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <ReferenceLine
                        y={0}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        label={{
                          position: "right",
                          value: "Zero",
                          fill: "#ef4444",
                          fontSize: 10,
                        }}
                      />
                      <Line
                        name="Baseline (Topo Sort)"
                        type="monotone"
                        dataKey="baseline"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#94a3b8" }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        name="Cash-Aware"
                        type="monotone"
                        dataKey="cashAware"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#2563eb" }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Current Schedule Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Cash-Aware Status" icon={CheckCircle}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-sm font-medium text-slate-600">
                        Completion Status
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                          cashAwareResult.status === "complete"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {cashAwareResult.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3">
                        <p className="text-xs text-slate-400 uppercase">
                          Min Balance
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            cashAwareResult.metrics.minBalance < 0
                              ? "text-rose-600"
                              : "text-slate-900"
                          }`}
                        >
                          ${cashAwareResult.metrics.minBalance.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-3">
                        <p className="text-xs text-slate-400 uppercase">
                          Final Balance
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          ${cashAwareResult.metrics.finalCash.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Configuration" icon={Settings}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase block mb-2">
                        Selection Heuristic
                      </label>
                      <select
                        value={heuristic}
                        onChange={(e) => setHeuristic(e.target.value)}
                        className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        <option value="min_cost">
                          Min Cost First (Preserve Cash)
                        </option>
                        <option value="max_net_gain">
                          Max Net Gain (Profit First)
                        </option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-2 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5" />
                        Heuristic determines which task to pick when multiple
                        are feasible.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {view === "input" && (
            <Card title="Task Dataset Editor" icon={FileJson}>
              <p className="text-sm text-slate-500 mb-4">
                Edit your task definitions in JSON format or use the samples.
              </p>
              <textarea
                value={inputRaw}
                onChange={(e) => setInputRaw(e.target.value)}
                className="w-full h-[400px] p-4 font-mono text-sm bg-slate-900 text-emerald-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleUpdateTasks}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Apply Changes
                </button>
                <button
                  onClick={() => {
                    const sample = [
                      { id: "A", cost: 150, revenue: 10, deps: [] },
                      { id: "B", cost: 20, revenue: 100, deps: [] },
                      { id: "C", cost: 50, revenue: 200, deps: ["A", "B"] },
                    ];
                    setInputRaw(JSON.stringify(sample, null, 2));
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Load Sample
                </button>
              </div>
            </Card>
          )}

          {view === "compare" && (
            <Card title="Comparative Analysis" icon={RefreshCw}>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Step</th>
                      <th className="px-4 py-3 font-semibold">
                        Baseline Order
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        Cash-Aware Order
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({
                      length: Math.max(
                        baselineResult.history?.length || 0,
                        cashAwareResult.history?.length || 0
                      ),
                    }).map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          {baselineResult.history?.[i] ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {baselineResult.history[i].taskId}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                (${baselineResult.history[i].cost} → $
                                {baselineResult.history[i].revenue})
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {cashAwareResult.history?.[i] ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-600">
                                {cashAwareResult.history[i].taskId}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                (${cashAwareResult.history[i].cost} → $
                                {cashAwareResult.history[i].revenue})
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Why Cash-Aware?" icon={Info}>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                In standard project management, we prioritize tasks based on
                dependencies. However, for a small business, a high-cost task
                might be dependency-ready but financially impossible.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>
                  <strong>Deadlock:</strong> Occurs when the balance is less
                  than the cost of all available tasks.
                </p>
              </div>
              <ul className="list-disc pl-4 space-y-2">
                <li>Baseline (Topo) ignores your bank account.</li>
                <li>
                  Cash-Aware rearranges tasks to build capital before tackling
                  expensive nodes.
                </li>
              </ul>
            </div>
          </Card>

          <Card title="Algorithms" icon={Play}>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">
                  Topological Sort
                </h4>
                <p className="text-[11px] text-blue-600">
                  Standard DAG linear ordering. O(V+E).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-800 uppercase mb-1">
                  Cash-Aware Greedy
                </h4>
                <p className="text-[11px] text-emerald-600">
                  Dynamic selection based on feasibility + heuristic. O(V²).
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats Sidebar */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              Live Insights
            </h4>
            <div
              className={`p-4 rounded-xl border ${
                baselineResult.metrics?.negative_events > 0
                  ? "bg-rose-50 border-rose-100 text-rose-800"
                  : "bg-emerald-50 border-emerald-100 text-emerald-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {baselineResult.metrics?.negative_events > 0 ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span className="text-xs font-bold">Baseline Feasibility</span>
              </div>
              <p className="text-[11px] opacity-80">
                {baselineResult.metrics?.negative_events > 0
                  ? `Fails! Encountered negative balance ${baselineResult.metrics.negative_events} times.`
                  : "Feasible. Topological sort works with this cash level."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}