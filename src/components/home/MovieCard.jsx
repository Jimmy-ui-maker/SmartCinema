"use client";

import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <div className="movie-image-wrapper">
        <img
          src={movie.poster || "/imgs/movie-placeholder.jpg"}
          alt={movie.title}
          className="movie-image"
        />

        <div className="movie-rating">
          <i className="bi bi-star-fill"></i>

          {movie.rating || "N/A"}
        </div>
      </div>

      <div className="movie-content">
        <h5 className="movie-title">{movie.title}</h5>

        <p className="movie-meta">
          <span>
            <i className="bi bi-tags-fill me-1"></i>

            {movie.genre || "Movie"}
          </span>

          <span>
            <i className="bi bi-clock me-1"></i>
            {movie.duration || "120"} mins
          </span>
        </p>

        <p className="movie-description">
          {movie.description
            ? movie.description.substring(0, 90) + "..."
            : "Experience an amazing cinematic adventure."}
        </p>

        <Link href={`/movies/${movie._id}`} className="movie-book-btn">
          <i className="bi bi-ticket-perforated-fill me-2"></i>
          Book Now
        </Link>
      </div>
    </div>
  );
}
