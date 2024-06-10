import React, { useState, useEffect } from "react";
import "./MovieData.css"; 


function MovieData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Track the selected movie ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://api.themoviedb.org/3/discover/movie?api_key=d9b0a83c9e832fe99a823757383466b9"; 
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        setData(jsonData.results); // Store the list of movies
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const toggleOverview = (movieId) => {
    setSelectedMovieId((prevId) => (prevId === movieId ? null : movieId)); // Toggle the selected movie ID
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <div className="row">
          {data.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-4">
              <div className="card" onClick={() => toggleOverview(movie.id)}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <h5 className="card-title">{movie.release_date?.slice(0, 4)}</h5>
                  <h6 className="card-title">
                    {movie.adult === "false" ? "A" : "R"}
                  </h6>
                  {selectedMovieId === movie.id && (
                    <p className="card-text">{movie.overview}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieData;
