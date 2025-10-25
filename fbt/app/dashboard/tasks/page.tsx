"use client";
import React, { useEffect, useState } from "react";
import "./developer.css";
import TaskForm, { NewTaskPayload } from "./taskform";
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
  try {
    const uRaw = localStorage.getItem("fealtyx_user");
    if (uRaw) {
      const parsedUser = JSON.parse(uRaw);
      setUser(parsedUser);

      // 🧠 Load all tasks and filter only those belonging to this user
      const allTasks = loadTasks();
      const filteredTasks = allTasks.filter(
        (t) => t.assignee === parsedUser.username
      );
      setTasks(filteredTasks);
    } else {
      setTasks([]);
    }
  } catch {
    setTasks([]);
  }
}, []);

  useEffect(() => {
  if (!user) return;

  const allTasks = loadTasks();

  // Remove this user's old tasks and add the updated ones
  const updatedAll = [
    ...allTasks.filter((t) => t.assignee !== user.username),
    ...tasks,
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
}, [tasks, user]);


  const addTask = (payload: NewTaskPayload) => {
    const newTask: Task = {
      id: Date.now(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      assignee: payload.assignee ?? user?.username ?? undefined,
      status: payload.status ?? "Open",
      createdAt: payload.createdAt
        ? new Date(payload.createdAt).toISOString()
        : new Date().toISOString(),
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

  const chartData = Object.values(
    tasks.reduce((acc: any, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
        return "status-pill status-open";
      case "Pending Approval":
        return "status-pill status-pending-approval";
      case "Closed":
        return "status-pill status-closed";
      default:
        return "status-pill status-open";
    }
  };

  return (
    <div className="developer-page">
      <h1 className="page-title">Developer Task Tracker</h1>
      <div className="logged-in-bar">
  <p>
    Logged in as: <strong>{user?.username ?? "unknown"}</strong>
  </p>
  <button
    onClick={() => {
      localStorage.removeItem("fealtyx_user");
      window.location.href = "/login"; // redirect back to login page
    }}
    className="logout-btn"
  >
    Logout
  </button>
</div>


      {/* Task Creation Form */}
      <TaskForm onAddTask={addTask} defaultAssignee={user?.username} />

      {/* Task Table */}
      <div className="table-card">
        {tasks.length === 0 ? (
          <p style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            No tasks yet. Add one above.
          </p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Due</th>
                <th>Time (hrs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>
                      {t.title}
                    </div>
                    {t.description && (
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                        {t.description}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                      Created: {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>{t.priority}</td>
                  <td>{t.assignee ?? "-"}</td>
                  <td>
                    <span className={getStatusClass(t.status)}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
                  <td>{t.timeSpent ?? 0}</td>
                  <td>
                    <button onClick={() => addHour(t.id, 1)} className="btn-hour">
                      +1 hr
                    </button>
                    {t.status !== "Closed" && t.status !== "Pending Approval" && (
                      <button
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((task) =>
                              task.id === t.id
                                ? { ...task, status: "Pending Approval" }
                                : task
                            )
                          )
                        }
                        className="btn-close"
                      >
                        Close
                      </button>
                    )}
                    <button onClick={() => deleteTask(t.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Task Trend Chart */}
      <div className="chart-card">
        <h3>📈 Task Creation Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}