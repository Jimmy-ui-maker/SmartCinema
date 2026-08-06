"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import StaffNavbar from "@/components/AdminDashboard/StaffNavbar";
import Bookings from "@/components/CashierDashboard/Bookings";

import "../admindashboard/admindashboard.css";

export default function CashierDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("adminRole");

    if (!role) {
      router.replace("/admindashboard/adminlogin");
      return;
    }

    if (role !== "Cashier") {
      router.replace("/admindashboard");
    }
  }, [router]);

  return (
    <>
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-layout">
        <main className="admin-content">
          <div className="container-fluid py-4">
            <div className="mb-4">
              <h2 className="fw-bold">💼 Cashier Dashboard</h2>

              <p className="">Manage bookings and verify customer payments.</p>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <Bookings />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
