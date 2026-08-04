"use client";

import { useRef, useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

export default function UploadBox({
  label = "Upload Image",
  value = "",
  onUpload,
  accept = "image/*",
  height = 220,
}) {
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const chooseFile = () => {
    fileRef.current.click();
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }

      setPreview(data.secure_url);

      if (onUpload) {
        onUpload(data.secure_url);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = async (e) => {
    if (!e.target.files.length) return;

    const file = e.target.files[0];

    await uploadImage(file);
  };

  const removeImage = () => {
    setPreview("");

    if (onUpload) {
      onUpload("");
    }

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="upload-box">
      <label className="upload-label">{label}</label>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        hidden
        onChange={handleChange}
      />

      <div
        className="upload-preview"
        style={{
          minHeight: height,
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="upload-image" />
        ) : (
          <div className="upload-placeholder">
            <i className="bi bi-cloud-arrow-up"></i>

            <h6>No Image Selected</h6>

            <small>Click below to upload</small>
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button
          type="button"
          className="primary-btn flex-fill"
          disabled={uploading}
          onClick={chooseFile}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Uploading...
            </>
          ) : (
            <>
              <i className="bi bi-upload me-2"></i>
              Upload Image
            </>
          )}
        </button>

        {preview && (
          <button type="button" className="danger-btn" onClick={removeImage}>
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
}
