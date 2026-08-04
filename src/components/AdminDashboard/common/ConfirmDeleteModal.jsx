"use client";

export default function ConfirmDeleteModal({
  show,
  title = "Delete Item",
  message = "Are you sure you want to delete this record?",
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!show) return null;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <div className="confirm-icon">
          <i className="bi bi-trash3-fill"></i>
        </div>

        <h4 className="confirm-title">{title}</h4>

        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            className="secondary-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button className="danger-btn" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash3 me-2"></i>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
