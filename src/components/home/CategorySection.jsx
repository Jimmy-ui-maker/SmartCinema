"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/genres");
      const data = await res.json();

      if (data.success) {
        setCategories(data.genres);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>Explore Categories</h2>
          <p>Find your favourite movies by genre.</p>
        </div>

        <div className="row g-4">
          {categories.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted">No categories available.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div className="col-lg-2 col-md-4 col-6" key={category._id}>
                <Link
                  href={`/movies?genre=${category._id}`}
                  className="category-card"
                >
                  <div className="mb-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="img-fluid rounded-circle"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <i
                        className="bi bi-film"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                    )}
                  </div>

                  <h6>{category.name}</h6>

                  <small>
                    {category.movieCount ?? 0}{" "}
                    {(category.movieCount ?? 0) === 1 ? "Movie" : "Movies"}
                  </small>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
