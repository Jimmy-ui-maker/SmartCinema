"use client";

export default function DashboardOverview() {
  const cards = [
    {
      title: "Movies",
      number: "0",
      icon: "bi-film",
    },

    {
      title: "Bookings",
      number: "0",
      icon: "bi-ticket",
    },

    {
      title: "Payments",
      number: "0",
      icon: "bi-wallet",
    },

    {
      title: "Tickets",
      number: "0",
      icon: "bi-qr-code",
    },
  ];

  return (
    <div>
      <h3>Dashboard Overview</h3>

      <div className="row g-4 mt-3">
        {cards.map((card) => (
          <div className="col-md-3" key={card.title}>
            <div className="admin-stat">
              <i className={`bi ${card.icon}`}></i>

              <h4>{card.number}</h4>

              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
