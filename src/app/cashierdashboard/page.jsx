"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Bookings from "@/components/CashierDashboard/Bookings";

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
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">💼 Cashier Dashboard</h2>
          <p className="text-muted mb-0">
            Manage bookings and verify customer payments.
          </p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <Bookings />
        </div>
      </div>
    </div>
  );
}
