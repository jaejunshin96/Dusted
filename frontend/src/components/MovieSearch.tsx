import { useState } from "react";
import authAxios from "../utils/authentications/authFetch";
import LoadingErrorItem from "./LoadingErrorItem";
import MovieListItem from "./MovieListItem";
import MovieModal from "./MovieModal";
import styles from "./MovieSearch.module.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim().length > 0) {
      setMovies([]);
      setPage(1);
      setHasMore(false);
      fetchMovies(query, 1);
    } else {
      setMovies([]);
      setHasMore(false);
      setError(t("Please enter at least 1 character."));
    }
  };

  const fetchMovies = async (searchTerm: string, pageNumber: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await authAxios(`${backendUrl}/api/film/search/`, {
        method: "GET",
        params: {
          query: searchTerm,
          page: pageNumber,
        },
      });

      const newMovies = response.data.results || [];
      setMovies(prevMovies => [...prevMovies, ...newMovies]);

      setHasMore(newMovies.length >= 20);

    } catch (err: any) {
      setError(t("Failed to fetch movies."));
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(query, nextPage);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={t("Search for a movie...")}
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch}>{t("Search")}</button>
      </div>

      <ul className={styles.movieList}>
        {loading && <LoadingErrorItem message={t("Loading...")} />}
        {error && <LoadingErrorItem message={error} isError />}
        {movies.map(movie => (
          <MovieListItem key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}

        {hasMore && (
          <li className={styles.loadMoreContainer}>
            <button className={styles.loadMoreButton} onClick={handleLoadMore}>
              {loading ? t("Loading...") : t("Load More")}
            </button>
          </li>
        )}
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
