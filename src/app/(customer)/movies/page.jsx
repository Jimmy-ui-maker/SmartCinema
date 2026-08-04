"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===============================
  // FETCH MOVIES
  // ===============================

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");

      const data = await res.json();

      if (data.success) {
        setMovies(data.movies);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || "Failed loading movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading movies 🎬...</h4>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="container">
        <h2 className="movies-title">🎬 Now Showing</h2>

        <p className="movies-subtitle">
          Discover today's biggest blockbusters and reserve your seats before
          they sell out.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {movies.length === 0 ? (
            <div className="movies-empty">
              <h5>No movies available</h5>
            </div>
          ) : (
            movies.map((movie) => (
              <div className="col-md-4 col-lg-3" key={movie._id}>
                <div className="movie-card">
                  {movie.poster ? (
                    <div className="movie-poster">
                      <img
                        src={movie.poster}
                        className="card-img-top"
                        alt={movie.title}
                      />

                      <span
                        className={`movie-status ${
                          movie.status === "Now Showing"
                            ? "showing"
                            : movie.status === "Coming Soon"
                              ? "coming"
                              : "ended"
                        }`}
                      >
                        {movie.status}
                      </span>
                    </div>
                  ) : (
                    <div className="movie-placeholder">No Poster</div>
                  )}

                  <div className="movie-body d-flex flex-column">
                    <h5 className="movie-title">{movie.title}</h5>

                    <p className="movie-genre">
                      {movie.genre?.map((g) => g.name).join(", ")}
                    </p>

                    <div className="movie-meta">
                      <span>⏱ {movie.duration} mins</span>
                      <span>⭐ {movie.rating}</span>
                    </div>

                    <p className="movie-language">🌍 {movie.language}</p>

                    

                    <Link
                      href={`/movies/${movie._id}`}
                     className="movie-btn mt-auto"
                    >
                      🎟 Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
