"use client";

export default function StatCard({ title, value, icon, color = "primary" }) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className={`stat-card stat-${color}`}>
        <div className="stat-icon">
          <i className={`bi ${icon}`}></i>
        </div>

        <div className="stat-content">
          <small>{title}</small>

          <h3>{value}</h3>
        </div>
      </div>
    </div>
  );
}
