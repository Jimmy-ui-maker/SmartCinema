"use client";

import Bookings from "@/components/CashierDashboard/Bookings";

export default function CashierDashboardPage() {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">💼 Cashier Dashboard</h1>

          <div className="card shadow-sm">
            <div className="card-body">
              <Bookings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
