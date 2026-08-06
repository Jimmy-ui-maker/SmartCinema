"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const SUPER_ADMIN = {
    email: "supper@gmail.com",
    password: "supperadmin",
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (email === SUPER_ADMIN.email && password === SUPER_ADMIN.password) {
      localStorage.setItem("role", "superadmin");
      localStorage.setItem("email", email);

      router.push("/superadmin");
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <section className="superadmin-login-section">
      <div className=" container superadmin-login-card">
        {/* HEADER */}

        <div className="text-center mb-4">
          <div className="superadmin-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>

          <h2 className="auth-title mt-3">Super Admin Login</h2>

          <p className="auth-subtitle">
            Secure access to cinema system management.
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          {/* EMAIL */}

          <div className="mb-3">
            <label className="custom-label">Email Address</label>

            <div className="position-relative">
              <i className="bi bi-envelope input-icon"></i>

              <input
                type="email"
                className="custom-input ps-5"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="mb-4">
            <label className="custom-label">Password</label>

            <div className="position-relative">
              <i className="bi bi-lock input-icon"></i>

              <input
                type={showPassword ? "text" : "password"}
                className="custom-input ps-5 pe-5"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="alert alert-danger py-2">
              <i className="bi bi-exclamation-circle me-2"></i>

              {error}
            </div>
          )}

          {/* BUTTON */}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Access Dashboard
              </>
            )}
          </button>
        </form>

        {/* USER LOGIN */}

        <div className="text-center mt-4">
          <span className="text-secondary">Are you a customer?</span>

          <a href="/auth/login" className="auth-link fw-bold ms-2">
            User Login
          </a>
        </div>
      </div>
    </section>
  );
}
