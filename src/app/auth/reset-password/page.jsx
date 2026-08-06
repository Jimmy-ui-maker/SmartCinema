"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      return setError("Invalid or missing reset token.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setSuccess(data.message);

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="container profile-card">
        <div
          className="auth-card mx-auto"
          style={{
            maxWidth: "500px",
          }}
        >
          {/* HEADER */}

          <div className="text-center mb-4">
            <i
              className="bi bi-shield-lock-fill"
              style={{
                fontSize: "3.5rem",
                color: "var(--accent)",
              }}
            ></i>

            <h2 className="auth-title mt-3">Reset Password</h2>

            <p className="auth-subtitle">
              Enter your new password to regain access to your account.
            </p>
          </div>

          {!token && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Invalid or expired password reset link.
            </div>
          )}

          {token && (
            <form onSubmit={handleSubmit}>
              {/* PASSWORD */}

              <div className="mb-3">
                <label className="custom-label">New Password</label>

                <div className="position-relative">
                  <i className="bi bi-lock input-icon"></i>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="custom-input ps-5 pe-5"
                    placeholder="Enter new password"
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
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mb-3">
                <label className="custom-label">Confirm Password</label>

                <div className="position-relative">
                  <i className="bi bi-lock-fill input-icon"></i>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="custom-input ps-5"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <br />
                  Redirecting to login...
                </div>
              )}

              <button className="primary-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <span className="text-secondary">Back to</span>

            <Link href="/auth/login" className="auth-link fw-bold ms-2">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
