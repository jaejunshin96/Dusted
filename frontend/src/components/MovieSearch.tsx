import { useState } from "react";
import authAxios from "../utils/authentications/authFetch";
import LoadingErrorItem from "./LoadingErrorItem";
import MovieListItem from "./MovieListItem";
import MovieModal from "./MovieModal";
import styles from "./MovieSearch.module.css";  // ✅ Import the new CSS module

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
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className={styles.movieList}>
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
