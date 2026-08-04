"use client";

import { useEffect, useState } from "react";
import TicketCard from "@/components/CustomerDashboard/TicketCard";

export default function CustomerTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CUSTOMER TICKETS
  // ==========================================

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setTickets(data.tickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ==========================================

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-3">Loading your cinema tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // ==========================================

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">🎟 My Cinema Tickets</h1>

        <p className="">
          View, download and print your confirmed cinema tickets.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="alert alert-warning text-center">
          <h5>No Tickets Found</h5>

          <p className="mb-0">You don't have any confirmed tickets yet.</p>
        </div>
      ) : (
        <div className="row">
          {tickets.map((ticket) => (
            <div className="col-lg-6 mb-4" key={ticket._id}>
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
