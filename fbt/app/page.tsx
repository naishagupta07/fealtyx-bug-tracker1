"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eef2ff, #e0f2fe)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "50px 60px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
          maxWidth: "450px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "#1e3a8a",
            marginBottom: "10px",
          }}
        >
          Welcome to FealtyX Bug Tracker
        </h1>
        <p style={{ color: "#475569", marginBottom: "25px" }}>
          Track, manage, and resolve bugs effortlessly.  
          Please login to continue.
        </p>
        <button
          onClick={handleStart}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Go to Login
        </button>
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: "20px",
          color: "#64748b",
          fontSize: "0.9rem",
        }}
      >
        © 2025 FealtyX Bug Tracker. All rights reserved.
      </footer>
    </div>
  );
}
