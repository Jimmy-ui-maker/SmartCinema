"use client";

import Link from "next/link";

export default function MovieCard({ movie }) {
  // Prevent crash while data is loading
  if (!movie) return null;

  const genreNames = Array.isArray(movie?.genre)
    ? movie.genre.map((g) => g.name).join(", ")
    : "Movie";

  const description = movie?.description
    ? movie.description.length > 90
      ? `${movie.description.substring(0, 90)}...`
      : movie.description
    : "Experience an amazing cinematic adventure.";

  return (
    <div className="movie-card">
      <div className="movie-image-wrapper">
        <img
          src={movie.poster || "/imgs/movie-placeholder.jpg"}
          alt={movie.title}
          className="movie-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/imgs/movie-placeholder.jpg";
          }}
        />

        <div className="movie-rating">
          <i className="bi bi-star-fill me-1"></i>
          {movie.rating ?? "N/A"}
        </div>

        {movie.status && (
          <span
            className={`badge position-absolute top-0 start-0 m-3 ${
              movie.status === "Now Showing"
                ? "bg-success"
                : movie.status === "Coming Soon"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
            }`}
          >
            {movie.status}
          </span>
        )}
      </div>

      <div className="movie-content">
        <h5 className="movie-title">{movie.title}</h5>

        <p className="movie-meta">
          <span>
            <i className="bi bi-tags-fill me-1"></i>
            {genreNames}
          </span>

          <span>
            <i className="bi bi-clock me-1"></i>
            {movie.duration || 120} mins
          </span>
        </p>

        <p className="movie-description">{description}</p>

        <Link href={`/movies/${movie._id}`} className="movie-book-btn">
          <i className="bi bi-ticket-perforated-fill me-2"></i>
          Book Now
        </Link>
      </div>
    </div>
  );
}
