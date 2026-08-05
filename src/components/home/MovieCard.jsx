"use client";

import Link from "next/link";

export default function MovieCard({ movie }) {

  console.log("MovieCard:", movie);

  
  const genres = Array.isArray(movie?.genre)
    ? movie.genre.map((g) => g.name).join(", ")
    : movie?.genre?.name || "Movie";

  return (
    <div className="movie-card">
      <div className="movie-image-wrapper">
        <img
          src={movie?.poster || "/imgs/movie-placeholder.jpg"}
          alt={movie?.title || "Movie"}
          className="movie-image"
        />

        <div className="movie-rating">
          <i className="bi bi-star-fill"></i>{" "}
          {movie?.rating ? Number(movie.rating).toFixed(1) : "N/A"}
        </div>

        {movie?.status && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-3">
            {movie.status}
          </span>
        )}
      </div>

      <div className="movie-content">
        <h5 className="movie-title">{movie?.title}</h5>

        <p className="movie-meta">
          <span>
            <i className="bi bi-tags-fill me-1"></i>
            {genres}
          </span>

          <span>
            <i className="bi bi-clock me-1"></i>
            {movie?.duration || 0} mins
          </span>
        </p>

        <p className="movie-description">
          {movie?.description
            ? movie.description.length > 90
              ? movie.description.substring(0, 90) + "..."
              : movie.description
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
