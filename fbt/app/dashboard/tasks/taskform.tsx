"use client";
import React, { useState } from "react";

export interface NewTaskPayload {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Pending Approval" | "Closed";
  assignee?: string;
  dueDate?: string;
  createdAt?: string;
}

interface TaskFormProps {
  onAddTask: (task: NewTaskPayload) => void;
  defaultAssignee?: string;
}

export default function TaskForm({ onAddTask, defaultAssignee }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [status, setStatus] = useState<
    "Open" | "In Progress" | "Pending Approval" | "Closed"
  >("Open");
  const [assignee, setAssignee] = useState(defaultAssignee ?? "");
  const [dueDate, setDueDate] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const payload: NewTaskPayload = {
      title,
      description,
      priority,
      status,
      assignee,
      dueDate,
      createdAt,
    };

    onAddTask(payload);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("Open");
    setAssignee(defaultAssignee ?? "");
    setDueDate("");
    setCreatedAt("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-wrap">
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="task-input"
        required
      />

      <input
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-input"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
        className="task-select"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "Open" | "In Progress" | "Pending Approval" | "Closed")
        }
        className="task-select"
      >
        <option>Open</option>
        <option>In Progress</option>
        <option>Pending Approval</option>
        <option>Closed</option>
      </select>

      <input
        type="text"
        placeholder="Assignee name"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="task-input"
      />

      <div className="date-field">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input"
        />
      </div>

      <div className="date-field">
        <label>Created At</label>
        <input
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="task-input"
        />
      </div>

      <button type="submit" className="task-btn">
        Add Task
      </button>
    </form>
  );
}
