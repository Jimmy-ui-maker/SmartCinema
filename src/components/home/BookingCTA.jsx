"use client";

import Link from "next/link";

export default function BookingCTA() {
  return (
    <section className="booking-cta">
      <div className="container">
        <div className="cta-box">
          <div>
            <h2>Ready for your next movie night?</h2>

            <p>
              Book your seats online and enjoy a smooth cinema experience
              without waiting in queues.
            </p>
          </div>

          <div>
            <Link href="/movies" className="cta-btn">
              <i className="bi bi-ticket-perforated-fill me-2"></i>
              Book Your Ticket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
