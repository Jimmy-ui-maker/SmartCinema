"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="container py-5">
        <h4>Loading bookings...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎟 My Bookings</h2>

        <Link href="/movies" className="btn btn-primary">
          Browse Movies
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          You haven't booked any movie yet.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Movie</th>
                <th>Date</th>
                <th>Hall</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Ticket</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.schedule?.movie?.title}</td>

                  <td>
                    {new Date(booking.schedule?.showDate).toLocaleDateString()}
                  </td>

                  <td>{booking.schedule?.hall?.name}</td>

                  <td>{booking.seats.join(", ")}</td>

                  <td>₦{booking.totalAmount.toLocaleString()}</td>

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
                    {booking.ticketGenerated ? (
                      <Link
                        href={`/tickets/${booking.ticket._id}`}
                        className="btn btn-success btn-sm"
                      >
                        View Ticket
                      </Link>
                    ) : (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Waiting
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
