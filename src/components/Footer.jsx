"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="cinema-footer">
      <div className="container">
        <div className="row gy-5">
          {/* Logo & About */}
          <div className="col-lg-4">
            <div className="footer-brand">
              <img
                src="/icons/cinemahub-192.png"
                alt="CinemaHub"
                className="footer-logo"
              />

              <h4>CinemaHub</h4>
            </div>

            <p className="footer-text">
              Experience modern cinema booking with fast reservations, real-time
              seat selection, secure payments, and unforgettable movie nights.
            </p>

            <div className="footer-social">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="#">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-4">
            <h5 className="footer-title">Quick Links</h5>

            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>

              <li>
                <Link href="/movies">Movies</Link>
              </li>

              <li>
                <Link href="/customerdashboard/bookings">Bookings</Link>
              </li>

              <li>
                <Link href="/customerdashboard/tickets">Tickets</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-lg-2 col-md-4">
            <h5 className="footer-title">Account</h5>

            <ul className="footer-links">
              <li>
                <Link href="/auth/login">Login</Link>
              </li>

              <li>
                <Link href="/auth/register">Register</Link>
              </li>

              <li>
                <Link href="/profile">Profile</Link>
              </li>

              <li>
                <Link href="/customerdashboard">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-4">
            <h5 className="footer-title">Contact</h5>

            <div className="footer-contact">
              <p>
                <i className="bi bi-geo-alt-fill"></i>
                CinemaHub Entertainment
              </p>

              <p>
                <i className="bi bi-envelope-fill"></i>
                support@cinemahub.com
              </p>

              <p>
                <i className="bi bi-telephone-fill"></i>
                +234 800 000 0000
              </p>

              <p>
                <i className="bi bi-clock-fill"></i>
                Open Daily • 8:00 AM - 11:00 PM
              </p>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} CinemaHub. All Rights Reserved.
          </span>

          <span>Built with ❤️ for Movie Lovers.</span>
        </div>
      </div>
    </footer>
  );
}
