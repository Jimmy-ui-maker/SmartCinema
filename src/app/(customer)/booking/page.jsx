"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookingSummaryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container py-5">
          <h3>Loading bookings...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container py-5">
        <div className="booking-header text-center">
          <h1>🎟 My Bookings</h1>
          <p>Review your reservations before payment confirmation.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="booking-empty">
            <i className="bi bi-ticket-perforated"></i>

            <h3>No Bookings Yet</h3>

            <p>Browse our movies and reserve your favourite seats.</p>

            <Link href="/movies" className="btn btn-danger">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => (
              <div className="col-lg-6" key={booking._id}>
                <div className="booking-card">
                  <div className="booking-card-header">
                    <h4>{booking.schedule.movie.title}</h4>

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
                  </div>

                  <div className="booking-info">
                    <div>
                      <small>Booking Number</small>

                      <h6>{booking.bookingNumber}</h6>
                    </div>

                    <div>
                      <small>Hall</small>

                      <h6>{booking.schedule.hall.name}</h6>
                    </div>

                    <div>
                      <small>Date</small>

                      <h6>
                        {new Date(
                          booking.schedule.showDate,
                        ).toLocaleDateString()}
                      </h6>
                    </div>

                    <div>
                      <small>Time</small>

                      <h6>
                        {new Date(booking.schedule.showTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </h6>
                    </div>
                  </div>

                  <hr />

                  <div className="mb-3">
                    <strong>Seats</strong>

                    <div className="mt-2">
                      {booking.seats.map((seat) => (
                        <span key={seat} className="seat-pill">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="booking-total">₦{booking.totalAmount}</div>

                  <Link
                    href="/customerdashboard/bookings"
                    className="btn btn-danger w-100 mt-4"
                  >
                    View Booking Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
