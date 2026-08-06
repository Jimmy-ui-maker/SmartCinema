"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffNavbar({ activeTab, setActiveTab }) {
  const router = useRouter();

  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminName(localStorage.getItem("adminName") || "Admin");
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    router.replace("/stafflogin");
  };

  // ======================================
  // MOBILE MENUS
  // ======================================

  const menus = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },
    {
      id: "movies",
      label: "Movies",
      icon: "bi-film",
    },
    {
      id: "genres",
      label: "Genres",
      icon: "bi-tags",
    },
    {
      id: "halls",
      label: "Halls",
      icon: "bi-building",
    },
    {
      id: "schedules",
      label: "Schedules",
      icon: "bi-calendar-event",
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: "bi-qr-code",
    },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">
        <div>
          <h4 className="mb-0 fw-bold">Cinema Control Center</h4>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="d-none d-md-block fw-semibold">
            Welcome, {adminName}
          </span>

          <button className="admin-logout" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </nav>

      {/* ================= MOBILE NAVIGATION ================= */}

      {setActiveTab && (
        <div className="admin-mobile-nav d-lg-none">
          {menus.map((menu) => (
            <button
              key={menu.id}
              className={activeTab === menu.id ? "active" : ""}
              onClick={() => setActiveTab(menu.id)}
            >
              <i className={`bi ${menu.icon}`}></i>
              <span>{menu.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
