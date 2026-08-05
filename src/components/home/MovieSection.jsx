"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function MovieSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <section className="movie-section py-5">
      <div className="container">
        <div className="section-title mb-5 text-center">
          <h2>Latest Movies</h2>
          <p>Discover movies currently showing in our cinemas.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-5">
            <h5>No movies available.</h5>
          </div>
        ) : (
          <div className="row g-4">
            {movies.map((movie) => (
              <div className="col-lg-4 col-md-6" key={movie._id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
