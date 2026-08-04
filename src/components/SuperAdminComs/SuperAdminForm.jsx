"use client";
import { useState, useEffect, useRef } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

export default function SuperAdminForm() {
  const [form, setForm] = useState({
    _id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    imgUrl: "",
    role: "Admin",
    isBlocked: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const fileInputRef = useRef();

  // ✅ Upload image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    return data.secure_url;
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Submit form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imgUrl = form.imgUrl;
      if (fileInputRef.current?.files[0]) {
        imgUrl = await uploadImage(fileInputRef.current.files[0]);
      }

      const method = form._id ? "PUT" : "POST";
      const res = await fetch("/api/superadmin/createadmin", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: form._id, imgUrl }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(
          `✅ ${form._id ? "Admin updated" : "Admin created"} successfully!`,
        );
        resetForm();
        fetchAdmins();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form after submission or cancel
  const resetForm = () => {
    setForm({
      _id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      imgUrl: "",
      role: "Admin",
      isBlocked: false,
    });
  };

  // ✅ Fetch all admins
  const fetchAdmins = async () => {
    const res = await fetch("/api/superadmin/createadmin");
    const data = await res.json();
    if (data.success) setAdmins(data.admins);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ✅ Toggle block/unblock
  const toggleBlock = async (id, currentStatus) => {
    const res = await fetch("/api/superadmin/createadmin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, block: !currentStatus }),
    });
    const data = await res.json();
    if (data.success) fetchAdmins();
  };

  // ✅ Delete admin
  const deleteAdmin = async (id) => {
    if (!confirm("Delete this admin?")) return;
    const res = await fetch(`/api/superadmin/createadmin?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) fetchAdmins();
  };

  // ✅ Edit admin
  const editAdmin = (a) => {
    setForm({ ...a, password: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Toggle visibility for admin passwords in table
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="admin-management">
      {/* HEADER */}

      <div className="text-center mb-4">
        <i
          className="bi bi-people-fill"
          style={{
            fontSize: "3rem",
            color: "var(--accent)",
          }}
        ></i>

        <h3 className="auth-title mt-3">Admin Management</h3>

        <p className="auth-subtitle">
          Create and manage cinema administrators.
        </p>
      </div>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* FORM */}

      <div className="auth-card mb-5">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* NAME */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">Full Name</label>

              <div className="position-relative">
                <i className="bi bi-person input-icon"></i>

                <input
                  type="text"
                  name="name"
                  className="custom-input ps-5"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">Email</label>

              <div className="position-relative">
                <i className="bi bi-envelope input-icon"></i>

                <input
                  type="email"
                  name="email"
                  className="custom-input ps-5"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PHONE */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">Phone</label>

              <div className="position-relative">
                <i className="bi bi-telephone input-icon"></i>

                <input
                  type="text"
                  name="phone"
                  className="custom-input ps-5"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ADDRESS */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">Address</label>

              <div className="position-relative">
                <i className="bi bi-geo-alt input-icon"></i>

                <input
                  type="text"
                  name="address"
                  className="custom-input ps-5"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">
                {form._id ? "New Password (optional)" : "Password"}
              </label>

              <div className="position-relative">
                <i className="bi bi-lock input-icon"></i>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="custom-input ps-5 pe-5"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    form._id ? "Leave blank to keep old password" : ""
                  }
                  required={!form._id}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* ROLE */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">Role</label>

              <select
                name="role"
                className="custom-input"
                value={form.role}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>

                <option value="Cashier">Cashier</option>

                <option value="Manager">Manager</option>
              </select>
            </div>

            {/* IMAGE */}

            <div className="col-md-6 mb-3">
              <label className="custom-label">Profile Picture</label>

              <input type="file" ref={fileInputRef} className="custom-input" />
            </div>

            {/* SHOW PASSWORD */}

            <div className="col-md-6 mb-3 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />

              <label className="custom-label mb-0">Show Password</label>
            </div>
          </div>

          <button className="primary-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : form._id ? (
              <>
                <i className="bi bi-pencil me-2"></i>
                Update Admin
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Create Admin
              </>
            )}
          </button>

          {form._id && (
            <button
              type="button"
              className="secondary-btn mt-3"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* TABLE */}

      <div className="auth-card">
        <h5 className="auth-title mb-3">
          <i className="bi bi-list-ul me-2"></i>
          All Administrators
        </h5>

        <div className="table-responsive">
          <table className="table cinema-table">
            <thead>
              <tr>
                <th>Image</th>

                <th>Email</th>

                <th>Role</th>

                <th>Status</th>

                <th>Password</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {admins.length > 0 ? (
                admins.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <img
                        src={a.imgUrl || "/default-avatar.png"}
                        className="admin-avatar"
                      />
                    </td>

                    <td>{a.email}</td>

                    <td>
                      <span className="role-badge">{a.role}</span>
                    </td>

                    <td>
                      <button
                        className={
                          a.isBlocked ? "status-danger" : "status-success"
                        }
                        onClick={() => toggleBlock(a._id, a.isBlocked)}
                      >
                        {a.isBlocked ? "Blocked" : "Active"}
                      </button>
                    </td>

                    <td>
                      {visiblePasswords[a._id] ? a.password : "••••••••"}

                      <button
                        className="icon-btn"
                        onClick={() => togglePasswordVisibility(a._id)}
                      >
                        <i
                          className={`bi ${
                            visiblePasswords[a._id] ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </td>

                    <td>
                      <button
                        className="table-edit"
                        onClick={() => editAdmin(a)}
                      >
                        Edit
                      </button>

                      <button
                        className="table-delete"
                        onClick={() => deleteAdmin(a._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Admin Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
