"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    profilePicture: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [message, setMessage] = useState("");

  // ====================================
  // FETCH PROFILE
  // ====================================

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setUser(data.user);

      setProfileForm({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture || "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ====================================
  // PROFILE INPUT
  // ====================================

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // ====================================
  // PASSWORD INPUT
  // ====================================

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // ====================================
  // Upload PROFILE
  // ====================================

  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setProfileForm((prev) => ({
        ...prev,
        profilePicture: data.image,
      }));

      setUser(data.user);

      setMessage("Profile picture updated.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ====================================
  // UPDATE PROFILE
  // ====================================

  const updateProfile = async (e) => {
    e.preventDefault();

    setLoadingProfile(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify(profileForm),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage("✅ Profile updated successfully.");

      fetchProfile();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ====================================
  // CHANGE PASSWORD
  // ====================================

  const changePassword = async (e) => {
    e.preventDefault();

    setLoadingPassword(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage("🔒 Password changed successfully.");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container py-5">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-person-circle me-2"></i>
          My Profile
        </h2>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="row g-4">
          {/* PROFILE */}

          <div className="col-lg-7">
            <div className="profile-card">
              <div className="card-body p-4">
                <div className="profile-avatar ">
                  <img
                    src={profileForm.profilePicture || "/imgs/avatar.png"}
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                    }}
                  />

                  <div className="profile-upload">
                    <input
                      type="file"
                      accept="image/*"
                      className="profile-input"
                      onChange={uploadImage}
                    />
                  </div>

                  {uploading && (
                    <div className="mt-2 text-primary">Uploading...</div>
                  )}
                </div>

                <form onSubmit={updateProfile}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="profile-name">First Name</label>

                      <input
                        className="custom-input"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="profile-name">Last Name</label>

                      <input
                        className="custom-input"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="profile-email">Email</label>

                    <input
                      className="custom-input"
                      value={user.email}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>

                    <input
                      className="custom-input"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <button className="btn btn-danger" disabled={loadingProfile}>
                    {loadingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFO */}

          <div className="col-lg-5">
            <div className="profile-card">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Account Information</h5>

                <p>
                  <strong>Role:</strong> {user.role}
                </p>

                <p>
                  <strong>Status:</strong> {user.status}
                </p>

                <p>
                  <strong>Email Verified:</strong>{" "}
                  {user.isEmailVerified ? "Yes" : "No"}
                </p>

                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* PASSWORD */}

            <div className="profile-card">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Change Password</h5>

                <form onSubmit={changePassword}>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="custom-input"
                      placeholder="Current Password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      className="custom-input"
                      placeholder="New Password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      className="custom-input"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <button
                    className="btn btn-dark w-100"
                    disabled={loadingPassword}
                  >
                    {loadingPassword ? "Updating..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
