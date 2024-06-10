import React from "react";
import MovieData from "./components/MovieData";
import MovieGenre from "./components/MovieGenre";
import MovieSearch from "./components/MovieSearch";

function App() {
  return (
    <div className="App">
      <MovieGenre/>
      <MovieData />
      <MovieSearch/>
    </div>
  );
}

export default App;
