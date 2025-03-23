import { useState, useEffect } from "react";
import axios from "axios";
import LoadingErrorItem from "./LoadingErrorItem";
import MovieListItem from "./MovieListItem";
import MovieModal from "./MovieModal";

export interface Movie {
  id: number;
  original_title: string;
  title: string;
  directors: [string];
  overview: string;
  backdrop_path: string | null;
  release_date: string;
}

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  let debounceTimeout: NodeJS.Timeout;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (value.length > 1) {
        fetchMovies(value);
      } else {
        setMovies([]);
      }
    }, 500);
  };

  const fetchMovies = async (searchTerm: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/film/search/", {
        params: { query: searchTerm },
      });
      setMovies(response.data.results || []);
    } catch (err: any) {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div style={{
      display: "flex",           // Makes the parent a flex container
      flexDirection: "column",    // Stacks children vertically
      alignItems: "center",       // Centers children horizontally
    }}>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleInputChange}
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />
      <ul style={{
        width: "100%",
        border: "1px solid #ddd",
        padding: 0,
        marginTop: "10px",
        maxHeight: "250px",            // Increased height for more visibility
        overflowY: "auto",
        listStyleType: "none",
      }}>
        {loading && <LoadingErrorItem message="Loading..." />}
        {error && <LoadingErrorItem message={error} isError />}
        {movies.map(movie => (
          <MovieListItem key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}
      </ul>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MovieSearch;
