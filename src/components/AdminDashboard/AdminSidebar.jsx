"use client";

{
  /** 
    {
      id: "bookings",
      label: "Bookings",
      icon: "bi-ticket-perforated",
    },

    {
      id: "payments",
      label: "Payments",
      icon: "bi-credit-card",
    },

     {
      id: "reports",
      label: "Reports",
      icon: "bi-bar-chart",
    },
    */
}

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menus = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },

    {
      id: "movies",
      label: "Movies",
      icon: "bi-film",
    },

    {
      id: "genres",
      label: "Genres",
      icon: "bi-tags",
    },

    {
      id: "halls",
      label: "Halls",
      icon: "bi-building",
    },

    {
      id: "schedules",
      label: "Schedules",
      icon: "bi-calendar-event",
    },

    {
      id: "tickets",
      label: "Tickets",
      icon: "bi-qr-code",
    },
  ];

  return (
    <div className="admin-sidebar">
      <h5 className="admin-brand">
        <i className="bi bi-camera-reels"></i>
        Cinema Admin
      </h5>

      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>
            <button
              className={activeTab === menu.id ? "active" : ""}
              onClick={() => setActiveTab(menu.id)}
            >
              <i className={`bi ${menu.icon}`}></i>

              <span>{menu.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
