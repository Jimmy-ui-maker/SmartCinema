"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function SeatSelection({ scheduleId }) {

  const router = useRouter();
  
  const [schedule, setSchedule] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===============================
  // FETCH SCHEDULE
  // ===============================

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`);

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setSchedule(data.schedule);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule();
    }
  }, [scheduleId]);

  // ===============================
  // SEAT CLICK
  // ===============================

  const handleSeatClick = (seat) => {
    const seatNumber = `${seat.row}${seat.number}`;

    // already booked
    if (schedule.bookedSeats.includes(seatNumber)) {
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading seats...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const seats = schedule?.hall?.seats || [];

  const bookedSeats = schedule?.bookedSeats || [];

  const handleBooking = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          schedule: scheduleId,

          seats: selectedSeats,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // after booking

      alert("Booking created successfully 🎉");
      router.push("/booking");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="seatscard shadow p-4">
        <h3 className="mb-3">🎬 Select Seats</h3>

        <h5>{schedule.movie.title}</h5>

        <p>Hall: {schedule.hall.name}</p>

        <hr />

        {/* SCREEN */}

        <div className="screen-wrapper mb-5">
          <div className="cinema-screen">SCREEN</div>
        </div>

        {/* SEATS */}

        <div className="cinema-screen-wrapper">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => {
            const rowSeats = seats.filter((seat) => seat.row === row);

            if (rowSeats.length === 0) return null;

            return (
              <div
                key={row}
                className="d-flex justify-content-center align-items-center mb-3"
              >
                <div
                  className="fw-bold text-white me-3"
                  style={{ width: "20px" }}
                >
                  {row}
                </div>

                {rowSeats.map((seat) => {
                  const seatCode = `${seat.row}${seat.number}`;

                  const isBooked = bookedSeats.includes(seatCode);

                  const isSelected = selectedSeats.includes(seatCode);

                  return (
                    <button
                      key={seatCode}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isBooked}
                      className={`seat-btn ${
                        isBooked
                          ? "seat-booked"
                          : isSelected
                            ? "seat-selected"
                            : "seat-available"
                      }`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <hr />

        <div className="selected-seat-box mt-4">
          <h5 className="mb-3">Selected Seats</h5>

          {selectedSeats.length === 0 ? (
            <p className=" mb-0">No seat selected</p>
          ) : (
            <>
              <div className="mb-3">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="badge bg-danger me-2 p-2">
                    {seat}
                  </span>
                ))}
              </div>

              <h4 className="text-warning">
                ₦{selectedSeats.length * schedule.ticketPrice}
              </h4>
            </>
          )}
        </div>

        <div className="mt-4">
          <button
            className="btn btn-danger btn-lg w-100"
            disabled={selectedSeats.length === 0}
            onClick={handleBooking}
          >
            🎟 Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
}
