"use client";
import React, { useEffect, useState } from "react";
import TaskForm, { NewTaskPayload } from "./tasks/taskform";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  assignee?: string;
  status: "Open" | "In Progress" | "Pending Approval" | "Closed";
  createdAt: string;
  dueDate?: string;
  timeSpent: number;
}

const STORAGE_KEY = "fealtyx_tasks_v1";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<{ username?: string } | null>(null);

  useEffect(() => {
    // Load user info
    try {
      const uRaw = localStorage.getItem("fealtyx_user");
      if (uRaw) setUser(JSON.parse(uRaw));
    } catch {}
    // Load tasks
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    // Persist tasks
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (payload: NewTaskPayload) => {
    const newTask: Task = {
      id: Date.now(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      assignee: payload.assignee ?? user?.username ?? undefined,
      status: payload.status ?? "Open",
      createdAt: payload.createdAt ?? new Date().toISOString(),
      dueDate: payload.dueDate,
      timeSpent: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id: number) => {
    if (!confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addHour = (id: number, hours = 1) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timeSpent: (t.timeSpent || 0) + hours } : t
      )
    );
  };

  // Chart data
  const chartData = Object.values(
    tasks.reduce((acc: any, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Developer Task Tracker</h1>
      <p style={{ marginBottom: 12 }}>
        Logged in as: <strong>{user?.username ?? "unknown"}</strong>
      </p>

      <TaskForm onAddTask={addTask} defaultAssignee={user?.username} />

      <div style={{ marginTop: 20 }}>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "white",
              backgroundColor: "black",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: 8 }}>Title</th>
                <th style={{ padding: 8 }}>Priority</th>
                <th style={{ padding: 8 }}>Assignee</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Due</th>
                <th style={{ padding: 8 }}>Time (hrs)</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    {t.description && (
                      <div style={{ fontSize: 13, color: "#aaa" }}>
                        {t.description}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                      Created: {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: 8 }}>{t.priority}</td>
                  <td style={{ padding: 8 }}>{t.assignee ?? "-"}</td>
                  <td style={{ padding: 8 }}>{t.status}</td>
                  <td style={{ padding: 8 }}>{t.dueDate ?? "-"}</td>
                  <td style={{ padding: 8 }}>{t.timeSpent ?? 0}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => addHour(t.id, 1)}
                      style={{
                        marginRight: 8,
                        background: "#333",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      +1 hr
                    </button>

                    {t.status !== "Closed" &&
                      t.status !== "Pending Approval" && (
                        <button
                          onClick={() =>
                            setTasks((prev) =>
                              prev.map((task) =>
                                task.id === t.id
                                  ? {
                                      ...task,
                                      status:
                                        "Pending Approval" as Task["status"],
                                    }
                                  : task
                              )
                            )
                          }
                          style={{
                            backgroundColor: "orange",
                            color: "black",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: 5,
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                        >
                          Close
                        </button>
                      )}

                    <button
                      onClick={() => deleteTask(t.id)}
                      style={{
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Chart Section */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ marginBottom: 10 }}>📈 Task Creation Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
