"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SuperAdminForm from "@/components/SuperAdminComs/SuperAdminForm";

export default function SuperAdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (role !== "superadmin") {
      router.push("/superadmin/enter");
      return;
    }

    setUsername(email || "Super Admin");
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/superadmin/enter");
  };

  const MenuButton = ({ name, label }) => (
    <button
      className={`super-menu-btn ${activeTab === name ? "active" : ""}`}
      onClick={() => setActiveTab(name)}
    >
      {label}
    </button>
  );

  return (
    <div className="superadmin-page">
      {/* NAVBAR */}

      <nav className="super-navbar">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-shield-lock-fill super-logo"></i>

          <h5 className="mb-0 fw-bold">Cinema Super Admin</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="super-user">{username}</span>

          <button className="super-logout" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>

            <span className="d-none d-md-inline ms-2">Logout</span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU BUTTON */}

      <button
        className="mobile-menu-btn d-lg-none"
        data-bs-toggle="offcanvas"
        data-bs-target="#superMenu"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* OFFCANVAS */}

      <div className="offcanvas offcanvas-start" id="superMenu">
        <div className="offcanvas-header">
          <h5>Super Admin</h5>

          <button className="btn-close" data-bs-dismiss="offcanvas" />
        </div>

        <div className="offcanvas-body">
          <MenuButton name="dashboard" label="Dashboard" />

          <MenuButton name="manage-admins" label="Manage Admins" />

          <MenuButton name="settings" label="Settings" />
        </div>
      </div>

      {/* DESKTOP MENU */}

      <div className="super-tabs d-none d-lg-flex">
        <MenuButton name="dashboard" label="Dashboard" />

        <MenuButton name="manage-admins" label="Manage Admins" />

        <MenuButton name="settings" label="Settings" />
      </div>

      {/* CONTENT */}

      <main className="super-content">
        {activeTab === "dashboard" && (
          <div className="super-card">
            <i className="bi bi-speedometer2 super-icon"></i>

            <h3>Dashboard Overview</h3>

            <p>
              Welcome Super Admin. Manage cinema administrators, security
              settings and system operations here.
            </p>
          </div>
        )}

        {activeTab === "manage-admins" && (
          <div className="super-card">
            <h3>Manage Administrators</h3>

            <SuperAdminForm />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="super-card">
            <i className="bi bi-gear super-icon"></i>

            <h3>System Settings</h3>

            <p>Configure global cinema settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}
