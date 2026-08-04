"use client";

import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ===========================
  // LOAD BOOKINGS
  // ===========================

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ===========================
  // CONFIRM PAYMENT
  // ===========================

  const confirmPayment = async (id) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          bookingStatus: "Confirmed",
          paymentStatus: "Paid",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage("Payment confirmed successfully ✅");

      fetchBookings();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ===========================
  // REVOKE BOOKING
  // ===========================

  const revokeBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          bookingStatus: "Cancelled",
          paymentStatus: "Failed",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage("Booking revoked successfully ❌");

      fetchBookings();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">Loading bookings...</div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">💰 Cashier Booking Verification</h3>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Booking No</th>
              <th>Customer</th>
              <th>Movie</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Booking</th>
              <th>Payment</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingNumber}</td>

                  <td>{booking.customer?.name}</td>

                  <td>{booking.schedule?.movie?.title}</td>

                  <td>{booking.seats.join(", ")}</td>

                  <td>₦{booking.totalAmount}</td>

                  <td>
                    <span
                      className={`badge ${
                        booking.bookingStatus === "Confirmed"
                          ? "bg-success"
                          : booking.bookingStatus === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        booking.paymentStatus === "Paid"
                          ? "bg-success"
                          : booking.paymentStatus === "Failed"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {/* Confirm */}
                      {booking.paymentStatus !== "Paid" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => confirmPayment(booking._id)}
                        >
                          ✅ Confirm
                        </button>
                      )}

                      {/* Revoke */}
                      {booking.paymentStatus === "Paid" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => revokeBooking(booking._id)}
                        >
                          ❌ Revoke
                        </button>
                      )}

                      {/* Re-confirm */}
                      {booking.bookingStatus === "Cancelled" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => confirmPayment(booking._id)}
                        >
                          🔄 Confirm Again
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
