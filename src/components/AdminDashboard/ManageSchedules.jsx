"use client";

import { useEffect, useState } from "react";

export default function ManageSchedules() {
  const emptyForm = {
    movie: "",
    hall: "",
    showDate: "",
    showTime: "",
    ticketPrice: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [movies, setMovies] = useState([]);

  const [halls, setHalls] = useState([]);

  const [schedules, setSchedules] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // ===============================
  // FETCH MOVIES
  // ===============================

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

  // ===============================
  // FETCH HALLS
  // ===============================

  const fetchHalls = async () => {
    try {
      const res = await fetch("/api/halls");

      const data = await res.json();

      if (data.success) {
        setHalls(data.halls);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===============================
  // FETCH SCHEDULES
  // ===============================

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/schedules");

      const data = await res.json();

      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovies();

    fetchHalls();

    fetchSchedules();
  }, []);

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });
  };

  // ===============================
  // CREATE SCHEDULE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const fullShowTime = `${form.showDate}T${form.showTime}`;

      const url = editingId ? `/api/schedules/${editingId}` : "/api/schedules";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          movie: form.movie,
          hall: form.hall,
          showDate: form.showDate,
          showTime: fullShowTime,
          ticketPrice: Number(form.ticketPrice),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage(
        editingId
          ? "Schedule updated successfully 🎉"
          : "Schedule created successfully 🎬",
      );

      setEditingId(null);
      setForm(emptyForm);

      fetchSchedules();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/schedules/${id}`);

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const schedule = data.schedule;

      setEditingId(schedule._id);

      setForm({
        movie: schedule.movie._id,
        hall: schedule.hall._id,
        showDate: schedule.showDate.slice(0, 10),
        showTime: new Date(schedule.showTime).toISOString().substring(11, 16),
        ticketPrice: schedule.ticketPrice,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this schedule?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage("Schedule deleted successfully.");

      fetchSchedules();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="auth-card">
        <h3 className="mb-4">📅 Create Movie Schedule</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* MOVIE */}

          <div className="mb-3">
            <label className="form-label">Movie</label>

            <select
              className="custom-input ps-5"
              name="movie"
              value={form.movie}
              onChange={handleChange}
              required
            >
              <option value="">Select Movie</option>

              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {/* HALL */}

          <div className="mb-3">
            <label className="form-label">Hall</label>

            <select
              className="custom-input ps-5"
              name="hall"
              value={form.hall}
              onChange={handleChange}
              required
            >
              <option value="">Select Hall</option>

              {halls.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {hall.name}({hall.capacity}
                  seats)
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Show Date</label>

              <input
                type="date"
                className="custom-input ps-5"
                name="showDate"
                value={form.showDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Show Time</label>

              <input
                type="time"
                className="custom-input ps-5"
                name="showTime"
                value={form.showTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Ticket Price</label>

            <input
              type="number"
              className="custom-input ps-5"
              name="ticketPrice"
              value={form.ticketPrice}
              onChange={handleChange}
              placeholder="5000"
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Schedule ✏️"
                : "Create Schedule 🎬"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel Editing
            </button>
          )}
        </form>

        <hr className="my-5" />

        <h4>🎥 Current Schedules</h4>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Movie</th>

                <th>Hall</th>

                <th>Date</th>

                <th>Time</th>

                <th>Price</th>

                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>

            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No schedules yet
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td>{schedule.movie?.title}</td>

                    <td>{schedule.hall?.name}</td>

                    <td>{new Date(schedule.showDate).toLocaleDateString()}</td>

                    <td>
                      {new Date(schedule.showTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>₦{schedule.ticketPrice}</td>

                    <td>
                      <span
                        className={`badge ${
                          schedule.status === "Scheduled"
                            ? "bg-primary"
                            : schedule.status === "Showing"
                              ? "bg-success"
                              : schedule.status === "Completed"
                                ? "bg-secondary"
                                : "bg-danger"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(schedule._id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(schedule._id)}
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
