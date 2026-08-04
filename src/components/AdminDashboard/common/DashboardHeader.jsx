"use client";

export default function DashboardHeader({
  title,
  subtitle,
  buttonText,
  buttonIcon = "bi-plus-circle",
  onButtonClick,
}) {
  return (
    <div className="dashboard-header mb-4">
      <div className="row align-items-center">
        <div className="col-md-8">
          <h2 className="dashboard-title">{title}</h2>

          {subtitle && <p className="dashboard-subtitle mb-0">{subtitle}</p>}
        </div>

        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          {buttonText && (
            <button className="primary-btn" onClick={onButtonClick}>
              <i className={`bi ${buttonIcon} me-2`}></i>

              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
