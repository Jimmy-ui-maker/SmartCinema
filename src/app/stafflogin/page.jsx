"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // ALREADY LOGGED IN
  // ==========================================

  useEffect(() => {
    const role = localStorage.getItem("adminRole");

    if (!role) return;

    if (role === "Cashier") {
      router.replace("/cashierdashboard");
    } else {
      router.replace("/admindashboard");
    }
  }, [router]);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Clear previous admin session
      localStorage.removeItem("token");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("adminImage");
      localStorage.removeItem("isBlocked");

      const res = await fetch("/api/superadmin/adminloginapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid login details");
      }

      const admin = data.admin;

      if (admin.isBlocked) {
        throw new Error(
          "Your account has been blocked. Please contact the Super Admin.",
        );
      }

      // ==========================================
      // SAVE SESSION
      // ==========================================

      localStorage.setItem("token", data.token);

      localStorage.setItem("adminId", admin.id);
      localStorage.setItem("adminName", admin.name);
      localStorage.setItem("adminEmail", admin.email);
      localStorage.setItem("adminRole", admin.role);
      localStorage.setItem("adminImage", admin.imgUrl || "");
      localStorage.setItem("isBlocked", admin.isBlocked);

      // ==========================================
      // REDIRECT
      // ==========================================

      if (admin.role === "Cashier") {
        router.replace("/cashierdashboard");
      } else {
        router.replace("/admindashboard");
      }
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="profile-card">
        <div className="text-center mb-4">
          <i
            className="bi bi-shield-fill-check"
            style={{
              fontSize: "3.5rem",
              color: "var(--accent)",
            }}
          ></i>

          <h2 className="auth-title mt-3">Staff Login</h2>

          <p className="auth-subtitle">Login as an Admin or Cashier.</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* EMAIL */}

          <div className="mb-3">
            <label className="custom-label">Email Address</label>

            <div className="position-relative">
              <i className="bi bi-envelope input-icon"></i>

              <input
                type="email"
                className="custom-input ps-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="mb-3">
            <label className="custom-label">Password</label>

            <div className="position-relative">
              <i className="bi bi-lock input-icon"></i>

              <input
                type={showPassword ? "text" : "password"}
                className="custom-input ps-5 pe-5"
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

          <button className="primary-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-secondary">Are you a customer?</span>

          <a href="/auth/login" className="auth-link fw-bold ms-2">
            Customer Login
          </a>
        </div>

        
      </div>
    </section>
  );
}
