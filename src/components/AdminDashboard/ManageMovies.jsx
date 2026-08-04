"use client";

import { useState, useEffect } from "react";

export default function ManageMovies() {
  const initialForm = {
    title: "",
    description: "",
    poster: "",
    banner: "",
    trailer: "",
    genre: [],
    duration: "",
    language: "English",
    rating: "",
    releaseDate: "",
    status: "Coming Soon",
    isFeatured: false,
  };

  const [form, setForm] = useState(initialForm);

  const [genres, setGenres] = useState([]);

  const [movies, setMovies] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ==============================
  // LOAD GENRES
  // ==============================

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/genres");

      const data = await res.json();

      if (data.success) {
        setGenres(data.genres);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==============================
  // LOAD MOVIES
  // ==============================

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");

      const data = await res.json();

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGenres();

    fetchMovies();
  }, []);

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,

      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==============================
  // MULTIPLE GENRE SELECT
  // ==============================

  const handleGenreChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );

    setForm({
      ...form,

      genre: selected,
    });
  };

  // ==============================
  // CREATE MOVIE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const url = isEditing ? `/api/movies/${editingId}` : "/api/movies";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          ...form,
          duration: Number(form.duration),
          rating: Number(form.rating),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage(
        isEditing
          ? "Movie updated successfully 🎉"
          : "Movie created successfully 🎉",
      );

      setForm(initialForm);

      setEditingId(null);
      setIsEditing(false);

      fetchMovies();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);

    setIsEditing(true);

    setForm({
      title: movie.title || "",
      description: movie.description || "",
      poster: movie.poster || "",
      banner: movie.banner || "",
      trailer: movie.trailer || "",
      genre: movie.genre?.map((g) => g._id) || [],
      duration: movie.duration || "",
      language: movie.language || "English",
      rating: movie.rating || "",
      releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : "",
      status: movie.status || "Coming Soon",
      isFeatured: movie.isFeatured || false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==============================
  // DELETE MOVIE
  // ==============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?",
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // if deleted while editing same movie
      if (editingId === id) {
        setEditingId(null);
        setIsEditing(false);
        setForm(initialForm);
      }

      setMessage("Movie deleted successfully 🗑️");

      fetchMovies();
    } catch (error) {
      setMessage(error.message || "Failed to delete movie");
    }
  };

  return (
    <div className="container py-4">
      <div className="auth-card">
        <h3>{isEditing ? "✏️ Edit Movie" : "🎬 Add New Movie"}</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Movie Title</label>

            <input
              className="custom-input ps-5"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>

            <textarea
              className="custom-input ps-5"
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Poster URL</label>

              <input
                className="custom-input ps-5"
                name="poster"
                value={form.poster}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Banner URL</label>

              <input
                className="custom-input ps-5"
                name="banner"
                value={form.banner}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Trailer URL</label>

              <input
                className="custom-input ps-5"
                name="trailer"
                value={form.trailer}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Genres</label>

              <select
                multiple
                className="custom-input ps-5"
                value={form.genre}
                onChange={handleGenreChange}
                required
              >
                {genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <small className="">Hold CTRL to select multiple genres</small>
            </div>

            <div className="col-md-6 mb-3">
              <label>Duration (minutes)</label>

              <input
                type="number"
                className="custom-input ps-5"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Language</label>

              <input
                className="custom-input ps-5"
                name="language"
                value={form.language}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Rating</label>

              <input
                type="number"
                step="0.1"
                className="custom-input ps-5"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Release Date</label>

              <input
                type="date"
                className="custom-input ps-5"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Status</label>

            <select
              className="custom-input ps-5"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Coming Soon">Coming Soon</option>

              <option value="Now Showing">Now Showing</option>

              <option value="Ended">Ended</option>
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />

            <label className="form-check-label">Featured Movie ⭐</label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                  ? "Update Movie 🎬"
                  : "Add Movie 🎬"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <hr className="my-5" />

        <h4>🎥 Movie Library</h4>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Poster</th>

                <th>Title</th>

                <th>Genre</th>

                <th>Rating</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No movies available
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          width="50"
                          height="70"
                          style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>{movie.title}</td>

                    <td>{movie.genre?.map((g) => g.name).join(", ")}</td>

                    <td>{movie.rating}</td>

                    <td>
                      <span
                        className={`badge ${
                          movie.status === "Now Showing"
                            ? "bg-success"
                            : movie.status === "Coming Soon"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                        }`}
                      >
                        {movie.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-warning btn-sm"
                          title="Edit Movie"
                          onClick={() => handleEdit(movie)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          title="Delete Movie"
                          onClick={() => handleDelete(movie._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
