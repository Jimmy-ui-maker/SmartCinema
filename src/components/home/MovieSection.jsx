"use client";

import MovieCard from "./MovieCard";

export default function MovieSection() {
  const movies = [
    {
      _id: "1",
      title: "The Last Journey",
      genre: "Action",
      duration: "130",
      rating: "8.5",
      poster: "/imgs/movie1.jpg",
      description: "An epic adventure filled with action and suspense.",
    },

    {
      _id: "2",
      title: "Dark Horizon",
      genre: "Sci-Fi",
      duration: "118",
      rating: "9.0",
      poster: "/imgs/movie2.jpg",
      description: "A futuristic story beyond imagination.",
    },

    {
      _id: "3",
      title: "Love Beyond Time",
      genre: "Romance",
      duration: "105",
      rating: "8.2",
      poster: "/imgs/movie3.jpg",
      description: "A beautiful story about love and destiny.",
    },
  ];

  return (
    <section className="movie-section">
      <div className="container">
        <div className="section-header">
          <h2>Latest Movies</h2>

          <p>Discover movies currently showing in our cinemas.</p>
        </div>

        <div className="row g-4">
          {movies.map((movie) => (
            <div className="col-lg-4 col-md-6" key={movie._id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
