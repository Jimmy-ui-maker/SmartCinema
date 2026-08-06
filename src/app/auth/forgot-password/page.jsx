"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");
    setToken("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setSuccess(data.message);

      // Temporary until email service is added
      setToken(data.resetToken);
    } catch (err) {
      setError(err.message || "Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="container profile-card">
        <div className="auth-card mx-auto" style={{ maxWidth: "500px" }}>
          {/* HEADER */}

          <div className="text-center mb-4">
            <i
              className="bi bi-key-fill"
              style={{
                fontSize: "3.5rem",
                color: "var(--accent)",
              }}
            ></i>

            <h2 className="auth-title mt-3">Forgot Password</h2>

            <p className="auth-subtitle">
              Enter your account email to generate a password reset token.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}

            <div className="mb-3">
              <label className="custom-label">Email Address</label>

              <div className="position-relative">
                <i className="bi bi-envelope input-icon"></i>

                <input
                  type="email"
                  className="custom-input ps-5"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              </div>
            )}

            {/* TEMP TOKEN */}

            {token && (
              <div className="alert alert-warning">
                <h6 className="fw-bold">Development Reset Token</h6>

                <div
                  className="p-2 bg-dark text-light rounded small mt-2"
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  {token}
                </div>

                <Link
                  href={`/auth/reset-password/${token}`}
                  className="btn btn-warning w-100 mt-3"
                >
                  Continue to Reset Password
                </Link>
              </div>
            )}

            <button className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Generate Reset Token
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-secondary">Remember your password?</span>

            <Link href="/auth/login" className="auth-link fw-bold ms-2">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
