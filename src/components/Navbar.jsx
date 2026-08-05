"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const searchRef = useRef(null);

  const staticLinks = [
    {
      title: "Home",
      href: "/",
      icon: "bi-house",
    },
    {
      title: "Movies",
      href: "/movies",
      icon: "bi-film",
    },
    {
      title: "My Tickets",
      href: "/bookings",
      icon: "bi-ticket-perforated",
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: "bi-calendar-event",
    },
    {
      title: "Gate",
      href: "/gate",
      icon: "bi-camera",
    },
    {
      title: "Admin Dashboard",
      href: "/admindashboard",
      icon: "bi-person",
    },
    {
      title: "Customer Dashboard",
      href: "/customerdashboard",
      icon: "bi-person",
    },
    {
      title: "Cashier Dashboard",
      href: "/cashierdashboard",
      icon: "bi-person",
    },
    {
      title: "Supper Admin",
      href: "/superadmin",
      icon: "bi-person",
    },
    {
      title: "Login",
      href: "/auth/login",
      icon: "bi-box-arrow-in-right",
    },
    {
      title: "Register",
      href: "/auth/register",
      icon: "bi-person-plus",
    },
  ];

  // ==========================================
  // LIVE SEARCH
  // ==========================================

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const filtered = staticLinks.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );

    setResults(filtered);
  }, [search]);

  // ==========================================
  // CLOSE SEARCH WHEN CLICK OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (href) => {
    setSearch("");
    setResults([]);
    router.push(href);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg cinema-navbar">
        <div className="container">
          {/* ================= LOGO ================= */}

          <Link href="/" className="navbar-brand cinema-brand">
            <i className="bi bi-film me-2"></i>
            Cinema<span>Hub</span>
          </Link>

          {/* ================= DESKTOP SEARCH ================= */}

          <div
            className="cinema-search d-none d-lg-flex position-relative mx-auto"
            ref={searchRef}
          >
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <div className="search-dropdown">
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      className="search-item"
                      onClick={() => handleSelect(item.href)}
                    >
                      <i className={`bi ${item.icon} me-2`}></i>

                      {item.title}
                    </button>
                  ))
                ) : (
                  <div className="search-empty">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* ================= DESKTOP BUTTONS ================= */}

          <div className="d-none d-lg-flex align-items-center gap-2">
            {user ? (
              <>
                <Link href="/profile" className="btn btn-outline-light">
                  Profile
                </Link>

                <button className="btn btn-danger" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-outline-light">
                  Login
                </Link>

                <Link href="/auth/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ================= MOBILE SEARCH ================= */}

          <button
            className="btn d-lg-none"
            onClick={() => setShowSearch(!showSearch)}
          >
            <i className="bi bi-search fs-4"></i>
          </button>
        </div>
      </nav>

      {/* ================= MOBILE SEARCH BOX ================= */}

      {showSearch && (
        <div className="container d-lg-none mt-2">
          <div className="cinema-search position-relative" ref={searchRef}>
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <div className="search-dropdown">
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      className="search-item"
                      onClick={() => {
                        handleSelect(item.href);
                        setShowSearch(false);
                      }}
                    >
                      <i className={`bi ${item.icon} me-2`}></i>

                      {item.title}
                    </button>
                  ))
                ) : (
                  <div className="search-empty">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
