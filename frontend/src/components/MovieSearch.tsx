import { useState, useEffect } from "react";
import authAxios from "../utils/authentications/authFetch";
import LoadingErrorItem from "./LoadingErrorItem";
import MovieListItem from "./MovieListItem";
import MovieModal from "./MovieModal";
import styles from "./MovieSearch.module.css";
import { useTranslation } from "react-i18next";
//import { GiClapperboard } from "react-icons/gi";

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
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedMovie]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim().length > 0) {
      setSearchAttempted(true);
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
    if (pageNumber === 1) {
      setLoading(true);
      setLoadMoreLoading(false);
    } else {
      setLoading(false);
      setLoadMoreLoading(true);
    }
    setError("");

    try {
      const response = await authAxios(`${backendUrl}/api/film/search/`, {
        method: "GET",
        params: {
          query: searchTerm,
          page: pageNumber,
          lang: i18n.language,
        },
      });

      const newMovies = response.data.results || [];
      setMovies(prevMovies => [...prevMovies, ...newMovies]);

      setHasMore(newMovies.length >= 20);

    } catch (err: any) {
      setError(t("Failed to fetch movies."));
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
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
      <form
        className={styles.searchBar}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          placeholder={t("Search for a movie...")}
          value={query}
          onChange={handleInputChange}
        />
      </form>

      <ul className={styles.movieList}>
        {loading && <div className={styles.spinner} />}
        {error && <LoadingErrorItem message={error} isError />}
        {!loading && searchAttempted && movies.length === 0 && !error && (
          <div className={styles.noResults}>{t("No results found.")}</div>
        )}
        {movies.map(movie => (
          <MovieListItem key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}

        {hasMore && (
          <li className={styles.loadMoreContainer}>
            {loadMoreLoading ? (
              <div className={styles.loadMoreSpinner} />
            ) : (
              <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                {t("Load More")}
              </button>
            )}
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
