"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import StaffNavbar from "@/components/AdminDashboard/StaffNavbar";

import AdminSidebar from "@/components/AdminDashboard/AdminSidebar";

import DashboardOverview from "@/components/AdminDashboard/DashboardOverview";

import ManageMovies from "@/components/AdminDashboard/ManageMovies";

import ManageGenres from "@/components/AdminDashboard/ManageGenres";

import ManageHalls from "@/components/AdminDashboard/ManageHalls";

import ManageSchedules from "@/components/AdminDashboard/ManageSchedules";

import ManageBookings from "@/components/AdminDashboard/ManageBookings";

import ManagePayments from "@/components/AdminDashboard/ManagePayments";

import ManageTickets from "@/components/AdminDashboard/ManageTickets";

import Reports from "@/components/AdminDashboard/Reports";



export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const role = localStorage.getItem("adminRole");

    if (!role) {
      router.push("/admindashboard/adminlogin");
    }
  }, []);

  const pages = {
    dashboard: <DashboardOverview />,

    movies: <ManageMovies />,

    genres: <ManageGenres />,

    halls: <ManageHalls />,

    schedules: <ManageSchedules />,

    bookings: <ManageBookings />,

    payments: <ManagePayments />,

    tickets: <ManageTickets />,

    reports: <Reports />,
  };

  return (
    <div className="admin-page">
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-layout">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="admin-content">{pages[activeTab]}</main>
      </div>
    </div>
  );
}
