"use client";

import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    movies: 0,
    genres: 0,
    halls: 0,
    schedules: 0,
    bookings: 0,
    payments: 0,
    tickets: 0,
    customers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");

      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Movies",
      number: stats.movies,
      icon: "bi-film",
      color: "primary",
    },

    {
      title: "Genres",
      number: stats.genres,
      icon: "bi-tags",
      color: "warning",
    },

    {
      title: "Halls",
      number: stats.halls,
      icon: "bi-building",
      color: "success",
    },

    {
      title: "Schedules",
      number: stats.schedules,
      icon: "bi-calendar-event",
      color: "info",
    },

    {
      title: "Bookings",
      number: stats.bookings,
      icon: "bi-ticket-perforated",
      color: "danger",
    },

    {
      title: "Payments",
      number: stats.payments,
      icon: "bi-credit-card",
      color: "secondary",
    },

    {
      title: "Tickets",
      number: stats.tickets,
      icon: "bi-qr-code",
      color: "dark",
    },

    {
      title: "Customers",
      number: stats.customers,
      icon: "bi-people",
      color: "primary",
    },
  ];

  return (
    <div>
      <h2 className="fw-bold">Dashboard Overview</h2>

      <p className="">Monitor your cinema activities in real time.</p>

      <div className="row g-4 mt-2">
        {cards.map((card) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={card.title}>
            <div className="admin-stat">
              <div className={`admin-stat-icon bg-${card.color}`}>
                <i className={`bi ${card.icon}`}></i>
              </div>

              <div className="admin-stat-content">
                <h3>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    card.number
                  )}
                </h3>

                <p>{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
