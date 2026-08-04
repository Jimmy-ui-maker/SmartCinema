"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="cinema-hero">
      <div className="cinema-overlay"></div>

      <div className="container cinema-hero-content">
        <div className="row">
          <div className="col-lg-12">
            <span className="hero-badge">
              <i className="bi bi-camera-reels-fill me-2"></i>
              Premium Cinema Experience
            </span>

            <h1 className="hero-title">
              Watch Movies.
              <br />
              Reserve Seats.
              <br />
              Enjoy The Moment.
            </h1>

            <p className="hero-description">
              Discover the latest movies, check available showtimes, choose your
              preferred seats and book your cinema tickets online with ease.
            </p>

            <div className="hero-actions">
              <Link href="/movies" className="hero-primary-btn">
                <i className="bi bi-film me-2"></i>
                Browse Movies
              </Link>

              <Link href="/auth/register" className="hero-secondary-btn">
                <i className="bi bi-ticket-perforated me-2"></i>
                Book Ticket
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
