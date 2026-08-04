"use client";

import { useEffect, useState } from "react";

export default function ManageHalls() {
  const emptyForm = {
    name: "",
    capacity: "",
    rows: "",
    seatsPerRow: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [halls, setHalls] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // ===============================
  // GET HALLS
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

  useEffect(() => {
    fetchHalls();
  }, []);

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });
  };

  // ===============================
  // CREATE HALL
  // ===============================

  // ===============================
  // CREATE / UPDATE HALL
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const rowsArray = form.rows
        .split(",")
        .map((row) => row.trim())
        .filter(Boolean);

      const url = isEditing ? `/api/halls/${editingId}` : "/api/halls";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          name: form.name,
          capacity: Number(form.capacity),
          rows: rowsArray,
          seatsPerRow: Number(form.seatsPerRow),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage(
        isEditing
          ? "Hall updated successfully 🏛️"
          : "Hall created successfully 🏛️",
      );

      setForm(emptyForm);

      setEditingId(null);

      setIsEditing(false);

      fetchHalls();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // EDIT HALL
  // ===============================

  const handleEdit = (hall) => {
    setEditingId(hall._id);

    setIsEditing(true);

    // Convert generated seats back to rows
    const rows = [...new Set(hall.seats.map((seat) => seat.row))];

    const seatsPerRow = hall.seats.filter(
      (seat) => seat.row === rows[0],
    ).length;

    setForm({
      name: hall.name,
      capacity: hall.capacity,
      rows: rows.join(","),
      seatsPerRow,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // DELETE HALL
  // ===============================

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this hall?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/halls/${id}`, {
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

      setMessage("Hall deleted successfully 🗑️");

      fetchHalls();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="auth-card">
        <h3>{isEditing ? "✏️ Edit Hall" : "🏛️ Manage Cinema Halls"}</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Hall Name</label>

            <input
              className="custom-input ps-5"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Hall A"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Capacity</label>

              <input
                type="number"
                className="custom-input ps-5"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Rows</label>

              <input
                className="custom-input ps-5"
                name="rows"
                value={form.rows}
                onChange={handleChange}
                placeholder="A,B,C,D"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Seats Per Row</label>

              <input
                type="number"
                className="custom-input ps-5"
                name="seatsPerRow"
                value={form.seatsPerRow}
                onChange={handleChange}
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Hall 🏛️"
                  : "Create Hall 🏛️"}
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

        <h4>🏢 Existing Halls</h4>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>

                <th>Capacity</th>

                <th>Seats Generated</th>

                <th>Status</th>
                <th width="140">Actions</th>
              </tr>
            </thead>

            <tbody>
              {halls.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No halls created yet
                  </td>
                </tr>
              ) : (
                halls.map((hall) => (
                  <tr key={hall._id}>
                    <td>{hall.name}</td>

                    <td>{hall.capacity}</td>

                    <td>{hall.seats?.length}</td>

                    <td>
                      <span
                        className={`badge ${
                          hall.status === "Available"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {hall.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(hall)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(hall._id)}
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
