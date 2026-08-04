"use client";

export default function AuthHeader() {
  return (
    <div className="auth-header">
      <div className="brand-logo">
        <i className="bi bi-film"></i>
      </div>

      <h1 className="brand-title">
        Cinema Ticketing
        <br />
        System
      </h1>

      <p className="brand-text">
        Discover the latest movies, reserve your favourite seats, pay securely,
        and enjoy a seamless cinema experience from anywhere.
      </p>

      <div className="brand-features">
        <div className="feature-item">
          <i className="bi bi-check-circle-fill"></i>
          <span>Easy Movie Booking</span>
        </div>

        <div className="feature-item">
          <i className="bi bi-check-circle-fill"></i>
          <span>Real-time Seat Selection</span>
        </div>

        <div className="feature-item">
          <i className="bi bi-check-circle-fill"></i>
          <span>Instant Ticket Confirmation</span>
        </div>

        <div className="feature-item">
          <i className="bi bi-check-circle-fill"></i>
          <span>Secure Online Payment</span>
        </div>
      </div>
    </div>
  );
}
