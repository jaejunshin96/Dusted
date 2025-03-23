import { useState } from "react";
import authAxios from "../utils/authentications/authFetch";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim().length > 1) {
      fetchMovies(query);
    } else {
      setMovies([]);
      setError("Please enter at least 2 characters.");
    }
  };

  const fetchMovies = async (searchTerm: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await authAxios("http://127.0.0.1:8000/api/film/search/", {
        method: "GET",
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px", width: "100%" }}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={handleInputChange}
          style={{ flex: 1, padding: "8px", fontSize: "16px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Search
        </button>
      </div>

      <ul style={{
        width: "100%",
        border: "1px solid #ddd",
        padding: 0,
        maxHeight: "250px",
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
