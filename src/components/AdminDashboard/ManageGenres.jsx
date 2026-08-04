"use client";

import { useEffect, useState } from "react";

export default function ManageGenres() {
  const emptyForm = {
    name: "",
    description: "",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [genres, setGenres] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // =================================
  // FETCH GENRES
  // =================================

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

  useEffect(() => {
    fetchGenres();
  }, []);

  // =================================
  // HANDLE INPUT
  // =================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });
  };

  // =================================
  // CREATE GENRE
  // =================================

  // =================================
  // CREATE / UPDATE GENRE
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const url = isEditing ? `/api/genres/${editingId}` : "/api/genres";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage(
        isEditing
          ? "Genre updated successfully 🎉"
          : "Genre created successfully 🎉",
      );

      setForm(emptyForm);

      setEditingId(null);

      setIsEditing(false);

      fetchGenres();
    } catch (error) {
      setMessage(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // EDIT GENRE
  // =================================

  const handleEdit = (genre) => {
    setEditingId(genre._id);

    setIsEditing(true);

    setForm({
      name: genre.name || "",
      description: genre.description || "",
      image: genre.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =================================
  // DELETE GENRE
  // =================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this genre?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/genres/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      if (editingId === id) {
        setEditingId(null);

        setIsEditing(false);

        setForm(emptyForm);
      }

      setMessage("Genre deleted successfully 🗑️");

      fetchGenres();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="auth-card">
        <h3>{isEditing ? "✏️ Edit Genre" : "🎭 Manage Movie Genres"}</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Genre Name</label>

            <input
              className="custom-input ps-5"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Action"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>

            <textarea
              className="custom-input ps-5"
              rows="3"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Movie genre description"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>

            <input
              className="custom-input ps-5"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://image-url.com/action.jpg"
            />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                  ? "Update Genre 🎭"
                  : "Add Genre 🎭"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setIsEditing(false);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <hr className="my-5" />

        <h4>🎬 Existing Genres</h4>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>

                <th>Description</th>

                <th>Image</th>

                <th width="140">Actions</th>
              </tr>
            </thead>

            <tbody>
              {genres.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No genres created yet
                  </td>
                </tr>
              ) : (
                genres.map((genre) => (
                  <tr key={genre._id}>
                    <td>{genre.name}</td>

                    <td>{genre.description || "-"}</td>

                    <td>
                      {genre.image ? (
                        <img
                          src={genre.image}
                          alt={genre.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(genre)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(genre._id)}
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
