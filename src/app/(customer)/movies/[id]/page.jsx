"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MovieDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const movieId = params.id;

  const [movie, setMovie] = useState(null);

  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =================================
  // LOAD MOVIE + SCHEDULES
  // =================================

  useEffect(() => {
    const loadData = async () => {
      try {
        // GET MOVIE

        const movieRes = await fetch("/api/movies");

        const movieData = await movieRes.json();

        if (movieData.success) {
          const selectedMovie = movieData.movies.find(
            (movie) => movie._id === movieId,
          );

          setMovie(selectedMovie);
        }

        // GET SCHEDULES

        const scheduleRes = await fetch("/api/schedules");

        const scheduleData = await scheduleRes.json();

        if (scheduleData.success) {
          const movieSchedules = scheduleData.schedules.filter(
            (schedule) => schedule.movie?._id === movieId,
          );

          setSchedules(movieSchedules);
        }
      } catch (err) {
        setError(err.message || "Unable to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading movie 🎬...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5">
        <h4>Movie not found</h4>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      <div className="container">
        <div className="row g-4">
          {/* MOVIE POSTER */}

          <div className="col-lg-4">
            <div className="details-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>
          </div>

          {/* DETAILS */}

          <div className="col-lg-8">
            <div className="details-card">
              <h1 className="details-title">{movie.title}</h1>

              <p className="details-description">{movie.description}</p>

              <div className="movie-info-grid">
                <div className="movie-info-item">
                  <small>Genre</small>
                  <strong>{movie.genre?.map((g) => g.name).join(", ")}</strong>
                </div>

                <div className="movie-info-item">
                  <small>Duration</small>
                  <strong>{movie.duration} Minutes</strong>
                </div>

                <div className="movie-info-item">
                  <small>Rating</small>
                  <strong>⭐ {movie.rating}</strong>
                </div>

                <div className="movie-info-item">
                  <small>Language</small>
                  <strong>{movie.language}</strong>
                </div>
              </div>

              <hr />

              <h3 className="showtime-title">🎟 Available Showtimes</h3>

              {schedules.length === 0 ? (
                <div className="no-showtime">
                  No available schedule for this movie.
                </div>
              ) : (
                <div className="row g-3">
                  {schedules.map((schedule) => (
                    <div className="col-md-6" key={schedule._id}>
                      <div className="showtime-card">
                        <div className="card-body">
                          <h5>🏛 {schedule.hall?.name}</h5>

                          <p>
                            📅{" "}
                            {new Date(schedule.showDate).toLocaleDateString()}
                          </p>

                          <p>
                            🕒{" "}
                            {new Date(schedule.showTime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>

                          <p className="ticket-price">
                            ₦{schedule.ticketPrice}
                          </p>

                          <button
                            className="btn book-seat-btn"
                            onClick={() =>
                              router.push(`/booking/${schedule._id}`)
                            }
                          >
                            Select Seats
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
