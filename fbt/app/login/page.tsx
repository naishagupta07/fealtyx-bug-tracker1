"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("/users.json");
    const users = await response.json();

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("fealtyx_user", JSON.stringify(user));

      // ✅ Redirect based on role
      if (user.role === "manager") {
        router.push("/dashboard/manager");
      } else if (user.role === "developer") {
        router.push("/dashboard/tasks");
      } else {
        router.push("/dashboard/tasks"); // fallback
      }
    } else {
      setError("Invalid username or password");
    }

  } catch (error) {
    console.error("Login error:", error);
    setError("Error loading user data");
  }
};



  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login to FealtyX Bug Tracker</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
    }
  