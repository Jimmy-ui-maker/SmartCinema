"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CustomerDashboardPage() {
  const router = useRouter();

  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();

    router.push("/auth/login");
  };

  // =====================================
  // PROTECT PAGE
  // =====================================

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token || !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-danger" role="status" />
          <p className="mt-3">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      {/* NAVBAR */}

      <nav className="navbar navbar-expand-lg customer-navbar">
        <div className="container">
          <Link href="/customerdashboard" className="navbar-brand fw-bold">
            🎬 CinemaHub
          </Link>

          <button
            className="navbar-toggler shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#customerNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="customerNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link href="/movies" className="nav-link">
                  🎥 Movies
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/customerdashboard/bookings" className="nav-link">
                  🎟 Bookings
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/customerdashboard/tickets" className="nav-link">
                  QR Tickets
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/customerdashboard/profile" className="nav-link">
                  👤 Profile
                </Link>
              </li>

              <li className="nav-item">
                <span className="nav-link text-info">
                  👋 {user?.name || "Customer"}
                </span>
              </li>

              <li className="nav-item ms-lg-2">
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* DASHBOARD CONTENT */}

      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="dashboard-card">
              <div className="card-body p-4">
                <h2 className="dashboard-title">🎬 Customer Dashboard</h2>

                <p className="dashboard-subtitle">
                  Welcome back, <strong>{user?.name || "Movie Lover"}</strong>{" "}
                  🍿
                </p>

                <hr className="dashboard-divider" />

                {/* ACCOUNT INFO */}

                <div className="account-card">
                  <h6>Account Information</h6>

                  <p className="mb-1">Name: {user?.name || "N/A"}</p>

                  <p className="mb-0">Email: {user?.email || "N/A"}</p>
                </div>

                {/* QUICK ACTIONS */}

                <div className="row g-4 mt-3">
                  {/* MOVIES */}

                  <div className="col-md-4">
                    <div className="dashboard-action-card h-100">
                      <div className="card-body text-center">
                        <div className="dashboard-icon">🎥</div>

                        <h5>Browse Movies</h5>

                        <p className="">
                          Explore movies, schedules and available seats.
                        </p>

                        <Link href="/movies" className="btn dashboard-btn dashboard-btn-primary">
                          View Movies
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* BOOKINGS */}

                  <div className="col-md-4">
                    <div className="dashboard-action-card h-100">
                      <div className="card-body text-center">
                        <div className="dashboard-icon">🎟️</div>

                        <h5>My Bookings</h5>

                        <p className="">
                          View your reservations and payment status.
                        </p>

                        <Link
                          href="/customerdashboard/bookings"
                          className="btn dashboard-btn dashboard-btn-success"
                        >
                          View Bookings
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* TICKETS */}

                  <div className="col-md-4">
                    <div className="dashboard-action-card h-100">
                      <div className="card-body text-center">
                        <div className="dashboard-icon">🎫</div>

                        <h5>My Tickets</h5>

                        <p className="">
                          Access your confirmed QR tickets.
                        </p>

                        <Link
                          href="/customerdashboard/tickets"
                          className="btn dashboard-btn dashboard-btn-warning"
                        >
                          View Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
