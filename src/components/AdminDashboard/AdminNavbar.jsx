"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminName(localStorage.getItem("adminName") || "Admin");
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/stafflogin");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <h4 className="admin-navbar-title mb-0">
          <i className="bi bi-camera-reels-fill me-2"></i>
          Cinema Control Center
        </h4>
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
  );
}
