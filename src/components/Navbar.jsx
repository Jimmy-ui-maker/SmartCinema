"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-lg cinema-navbar">
        <div className="container-fluid">
          {/* LOGO */}

          <Link href="/" className="navbar-brand cinema-brand">
            <i className="bi bi-film me-2"></i>
            Cinema<span>Hub</span>
          </Link>

          {/* SEARCH */}

          <div className="cinema-search d-none d-md-flex">
            <i className="bi bi-search"></i>

            <input type="text" placeholder="Search movies..." />
          </div>

          {/* TOGGLER */}

          <button
            className="navbar-toggler shadow-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#cinemaMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* OFFCANVAS */}

      <div
        className="offcanvas offcanvas-end cinema-offcanvas"
        tabIndex="-1"
        id="cinemaMenu"
      >
        <div className="offcanvas-header">
          <h5 className="fw-bold">CinemaHub Menu</h5>

          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <ul className="list-unstyled cinema-menu">
            <li>
              <Link href="/">
                <i className="bi bi-house me-2"></i>
                Home
              </Link>
            </li>

            <li>
              <Link href="/movies">
                <i className="bi bi-film me-2"></i>
                Movies
              </Link>
            </li>

            <li>
              <Link href="/bookings">
                <i className="bi bi-ticket-perforated me-2"></i>
                My Tickets
              </Link>
            </li>

            <li>
              <Link href="/schedule">
                <i className="bi bi-calendar-event me-2"></i>
                Schedule
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link href="/profile">
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Link>
                </li>

                <li>
                  <button className="logout-btn" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </Link>
                </li>

                <li>
                  <Link href="/auth/register">
                    <i className="bi bi-person-plus me-2"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
