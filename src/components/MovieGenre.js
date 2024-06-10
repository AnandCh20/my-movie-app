import React, { useState, useEffect } from "react";

function MovieGenre() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State to manage selected movie

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  const fetchGenres = async () => {
    try {
      const genreApiUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=d9b0a83c9e832fe99a823757383466b9";
      const response = await fetch(genreApiUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const genreData = await response.json();
      setGenres(genreData.genres);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchMovies = async (genreIds = []) => {
    setLoading(true);
    try {
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=d9b0a83c9e832fe99a823757383466b9&with_genres=${genreIds.join(',')}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      setMovies(jsonData.results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genreId) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(updatedGenres);
    fetchMovies(updatedGenres);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSearchQuery("");
    fetchMovies([]);
  };

  const handleCardClick = (movieId) => {
    setSelectedMovieId((prevId) => (prevId === movieId ? null : movieId));
  };

  const filteredMovies = movies.filter(movie =>
    (searchQuery ? movie.title.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary ">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={resetFilters}>Movies Club</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sort by Genre
                </a>
                <ul className="dropdown-menu">
                  {genres.map(genre => (
                    <li key={genre.id} className="dropdown-item">
                      <input
                        type="checkbox"
                        id={`genre-${genre.id}`}
                        checked={selectedGenres.includes(genre.id)}
                        onChange={() => handleGenreChange(genre.id)}
                      />
                      <label htmlFor={`genre-${genre.id}`} className="ms-2">{genre.name}</label>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => setSearchQuery(e.target.value)}/>
            </form>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          <div className="row">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                <div className="card" onClick={() => handleCardClick(movie.id)}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <h5 className="card-title">{movie.release_date?.slice(0, 4)}</h5>
                    <h6 className="card-title">
                      {movie.adult ? "A" : "R"}
                    </h6>
                    {selectedMovieId === movie.id && (
                      <div>
                        <p className="card-text">{movie.overview}</p>
                        <p className="card-text">Rating: {movie.vote_average}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieGenre;
