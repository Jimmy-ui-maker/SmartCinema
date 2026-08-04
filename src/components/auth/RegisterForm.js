"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { register } from "@/services/authClient";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await register(form);

      if (!data.success) {
        throw new Error(data.message);
      }

      login(data.user, data.token);

      setSuccess(data.message);

      router.push(
        data.user.role === "Admin" ? "/admin/dashboard" : "/auth/login",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="auth-title">Create Account</h2>

      <p className="auth-subtitle">
        Create your account to book movies, reserve seats and manage your
        tickets.
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

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="custom-label">First Name</label>

          <div className="position-relative">
            <i className="bi bi-person input-icon"></i>

            <input
              type="text"
              name="firstName"
              className="custom-input ps-5"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="custom-label">Last Name</label>

          <div className="position-relative">
            <i className="bi bi-person-vcard input-icon"></i>

            <input
              type="text"
              name="lastName"
              className="custom-input ps-5"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="custom-label">Email Address</label>

        <div className="position-relative">
          <i className="bi bi-envelope input-icon"></i>

          <input
            type="email"
            name="email"
            className="custom-input ps-5"
            placeholder="johndoe@email.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="custom-label">Phone Number</label>

        <div className="position-relative">
          <i className="bi bi-telephone input-icon"></i>

          <input
            type="tel"
            name="phone"
            className="custom-input ps-5"
            placeholder="+234 801 234 5678"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="custom-label">Password</label>

        <div className="position-relative">
          <i className="bi bi-lock input-icon"></i>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="custom-input ps-5 pe-5"
            placeholder="Create a secure password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
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

      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Creating Account...
          </>
        ) : (
          <>
            <i className="bi bi-ticket-perforated-fill me-2"></i>
            Create Account
          </>
        )}
      </button>

      <div className="text-center mt-4">
        <span className="text-secondary">Already have an account?</span>

        <Link href="/auth/login" className="auth-link fw-semibold ms-2">
          Login Here
        </Link>
      </div>
    </form>
  );
}
