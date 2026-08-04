"use client";

export default function EmptyState({
  icon = "bi-folder2-open",
  title = "Nothing Found",
  message = "There are no records available.",
  buttonText,
  buttonIcon = "bi-plus-circle",
  onButtonClick,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <i className={`bi ${icon}`}></i>
      </div>

      <h3 className="empty-title">{title}</h3>

      <p className="empty-message">{message}</p>

      {buttonText && (
        <button className="primary-btn mt-3" onClick={onButtonClick}>
          <i className={`bi ${buttonIcon} me-2`}></i>

          {buttonText}
        </button>
      )}
    </div>
  );
}
