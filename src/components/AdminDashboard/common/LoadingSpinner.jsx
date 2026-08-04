"use client";

export default function LoadingSpinner({
  text = "Loading...",
  fullPage = false,
}) {
  if (fullPage) {
    return (
      <div className="loading-page">
        <div className="loading-card">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <h5 className="mt-3 mb-0">{text}</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div
        className="spinner-border spinner-border-sm text-primary me-2"
        role="status"
      ></div>

      <span>{text}</span>
    </div>
  );
}
