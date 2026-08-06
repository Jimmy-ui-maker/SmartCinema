"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { login as loginUser } from "@/services/authClient";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginUser(form);

      if (!data.success) {
        throw new Error(data.message || "Login failed.");
      }

      login(data.user, data.token);

      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        router.push("/customerdashboard");
      }, 800);

      // Later
      router.push(
        data.user.role === "Admin"
          ? "/admin/dashboard"
          : "/customerdashboard"
      );
      
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="auth-title">Welcome Back</h2>

      <p className="auth-subtitle">
        Sign in to continue booking your favourite movies.
      </p>

      {error && (
        <div className="alert alert-danger py-2">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success py-2">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
        </div>
      )}

      <div className="mb-3">
        <label className="custom-label">Email Address</label>

        <div className="position-relative">
          <i className="bi bi-envelope input-icon"></i>

          <input
            type="email"
            name="email"
            className="custom-input ps-5"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
            required
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="custom-label">Password</label>

        <div className="position-relative">
          <i className="bi bi-lock input-icon"></i>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="custom-input ps-5 pe-5"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <Link href="/auth/forgot-password" className="auth-link small">
          Forgot Password?
        </Link>
      </div>

      <button type="submit" className="primary-btn" disabled={loading}>
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

      <div className="my-4 d-flex align-items-center">
        <hr className="flex-grow-1 border-secondary" />

        <span className="px-3 text-secondary small">OR</span>

        <hr className="flex-grow-1 border-secondary" />
      </div>

      <div className="text-center">
        <span className="text-secondary">Don't have an account?</span>

        <Link href="/auth/register" className="auth-link fw-semibold ms-2">
          Create Account
        </Link>
      </div>
    </form>
  );
}
