

"use client";
import React, { useEffect, useState } from "react";
import "./manager.css";

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

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const approveTask = (id: number) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, status: "Closed" as Task["status"] } : t
    );
    saveTasks(updatedTasks);
  };

  const reopenTask = (id: number) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, status: "Open" as Task["status"] } : t
    );
    saveTasks(updatedTasks);
  };

  return (
  <div className="manager-container">
    <div className="manager-header">
  <h1 className="manager-title">Manager Dashboard</h1>
  <button
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("fealtyx_user");
      window.location.href = "/login"; // redirect back to login page
    }}
  >
    Logout
  </button>
</div>

    <div className="header-bar"></div>

    {tasks.length === 0 ? (
      <p>No tasks available from developers.</p>
    ) : (
      <div className="manager-table-container">
        <table className="manager-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Developer</th>
              <th>Status</th>
              <th>Time Spent (hrs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.title}</div>
                  {t.description && (
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {t.description}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
                    Created: {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>{t.assignee ?? "-"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      t.status === "Open"
                        ? "status-open"
                        : t.status === "In Progress"
                        ? "status-inprogress"
                        : t.status === "Pending Approval"
                        ? "status-pending"
                        : "status-closed"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>{t.timeSpent}</td>
                <td>
                  {t.status === "Pending Approval" && (
                    <button
                      className="approve-btn"
                      onClick={() => approveTask(t.id)}
                    >
                      Approve
                    </button>
                  )}

                  {t.status === "Closed" && (
                    <button
                      className="reopen-btn"
                      onClick={() => reopenTask(t.id)}
                    >
                      Reopen
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>

  );
}
