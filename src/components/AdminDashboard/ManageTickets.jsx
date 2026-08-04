"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardHeader from "./common/DashboardHeader";
import SearchBox from "./common/SearchBox";
import StatCard from "./common/StatCard";
import LoadingSpinner from "./common/LoadingSpinner";
import EmptyState from "./common/EmptyState";

export default function ManageTickets() {
  // ======================================================
  // STATES
  // ======================================================

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // ======================================================
  // FETCH BOOKINGS
  // ======================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setBookings(data.bookings);
        setFilteredBookings(data.bookings);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // ======================================================
  // SEARCH
  // ======================================================

  useEffect(() => {
    if (!search.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const keyword = search.toLowerCase();

    const result = bookings.filter((booking) => {
      return (
        booking.bookingNumber?.toLowerCase().includes(keyword) ||
        booking.customer?.fullName?.toLowerCase().includes(keyword) ||
        booking.schedule?.movie?.title?.toLowerCase().includes(keyword) ||
        booking.schedule?.hall?.name?.toLowerCase().includes(keyword)
      );
    });

    setFilteredBookings(result);
  }, [search, bookings]);

  // ======================================================
  // GENERATE TICKET
  // ======================================================

  const generateTicket = async (bookingId) => {
    try {
      setSubmitting(true);

      setMessage("");

      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch("/api/tickets", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          booking: bookingId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Ticket generated successfully.");

        fetchBookings();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);

      setError("Unable to generate ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // STATS
  // ======================================================

  const totalBookings = useMemo(() => bookings.length, [bookings]);

  const confirmedBookings = useMemo(
    () => bookings.filter((item) => item.bookingStatus === "Confirmed").length,
    [bookings],
  );

  const generatedTickets = useMemo(
    () => bookings.filter((item) => item.ticketGenerated).length,
    [bookings],
  );

  const pendingTickets = useMemo(
    () =>
      bookings.filter(
        (item) => item.bookingStatus === "Confirmed" && !item.ticketGenerated,
      ).length,
    [bookings],
  );

  // ======================================================
  // STATUS BADGE
  // ======================================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";

      case "Reserved":
        return "warning";

      case "Cancelled":
        return "danger";

      default:
        return "secondary";
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formatPrice = (amount) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  // ======================================================
  // JSX STARTS BELOW
  // ======================================================

  return (
    <div className="container-fluid">
      <DashboardHeader
        title="Manage Tickets"
        subtitle="Generate cinema tickets for confirmed bookings."
      />

      {/* ========================= ALERTS ========================= */}

      {message && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-2"></i>
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* ========================= STATS ========================= */}

      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Bookings"
            value={totalBookings}
            icon="bi-ticket-perforated"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Confirmed"
            value={confirmedBookings}
            icon="bi-check-circle"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Generated"
            value={generatedTickets}
            icon="bi-qr-code"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Pending"
            value={pendingTickets}
            icon="bi-clock-history"
          />
        </div>
      </div>

      {/* ========================= SEARCH ========================= */}

      <div className="mb-4">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search booking number, customer or movie..."
        />
      </div>

      {/* ========================= LOADING ========================= */}

      {loading ? (
        <LoadingSpinner />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          subtitle="Bookings will appear here."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Booking No</th>

                <th>Customer</th>

                <th>Movie</th>

                <th>Hall</th>

                <th>Seats</th>

                <th>Amount</th>

                <th>Status</th>

                <th>Date</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="fw-semibold">{booking.bookingNumber}</td>

                  <td>
                    {booking.customer?.fullName ||
                      booking.customer?.name ||
                      "-"}
                  </td>

                  <td>{booking.schedule?.movie?.title || "-"}</td>

                  <td>{booking.schedule?.hall?.name || "-"}</td>

                  <td>{booking.seats?.join(", ")}</td>

                  <td>{formatPrice(booking.totalAmount)}</td>

                  <td>
                    <span
                      className={`badge bg-${getStatusBadge(
                        booking.bookingStatus,
                      )}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>

                  <td>{formatDate(booking.createdAt)}</td>

                  <td className="text-center">
                    {booking.ticketGenerated ? (
                      <button className="btn btn-success btn-sm" disabled>
                        <i className="bi bi-check-circle me-1"></i>
                        Generated
                      </button>
                    ) : booking.bookingStatus !== "Confirmed" ? (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Await Payment
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={submitting}
                        onClick={() => generateTicket(booking._id)}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-ticket-perforated me-2"></i>
                            Generate Ticket
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
