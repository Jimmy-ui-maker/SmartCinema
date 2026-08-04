"use client";

import Link from "next/link";

export default function CategorySection() {
  const categories = [
    {
      name: "Action",
      icon: "bi-lightning-charge-fill",
      count: "25 Movies",
    },

    {
      name: "Adventure",
      icon: "bi-compass-fill",
      count: "18 Movies",
    },

    {
      name: "Comedy",
      icon: "bi-emoji-laughing-fill",
      count: "30 Movies",
    },

    {
      name: "Romance",
      icon: "bi-heart-fill",
      count: "15 Movies",
    },

    {
      name: "Horror",
      icon: "bi-moon-stars-fill",
      count: "12 Movies",
    },

    {
      name: "Sci-Fi",
      icon: "bi-rocket-fill",
      count: "20 Movies",
    },
  ];

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore Categories</h2>

          <p>Find your favourite movies by genre.</p>
        </div>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div className="col-lg-2 col-md-4 col-6" key={index}>
              <Link
                href={`/movies?genre=${category.name}`}
                className="category-card"
              >
                <i className={`bi ${category.icon}`}></i>

                <h6>{category.name}</h6>

                <small>{category.count}</small>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
