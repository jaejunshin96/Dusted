import { useState, useEffect, useCallback } from "react";
import authAxios from "../utils/authentications/authFetch";
import MovieGrid from "../components/movie/MovieGrid";
import MovieModal from "../components/movie/MovieModal";
import styles from "./SearchPage.module.css";
import { useTranslation } from "react-i18next";

export interface Movie {
  id: number;
  original_title: string;
  title: string;
  directors: [string];
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
}

const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedMovie]);

  useEffect(() => {
    if (searchAttempted) {
      fetchMovies();
    }
  }, [page, i18n.language]);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authAxios(`${backendUrl}/api/film/search/`, {
        method: "GET",
        params: {
          page,
          query,
          lang: i18n.language,
        },
      });

      const newMovies = response.data.results || [];

      if (page === 1) {
        setMovies(newMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }

      setHasMore(newMovies.length > 0);
    } catch (err: any) {
      setError(err.response?.data?.Error || t("Failed to fetch movies."));
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    setMovies([]);
    setHasMore(false);
    if (query.trim().length > 0) {
      setSearchAttempted(true);
      setPage(1);
      fetchMovies();
    } else {
      setError(t("Please enter at least 1 character."));
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleLoadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

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
        <button
          type="button"
          className={`${styles.clearButton} ${!query ? styles.hidden : ''}`}
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <MovieGrid
        movies={movies}
        loading={loading}
        hasMore={hasMore}
        onMovieClick={handleMovieClick}
        onLoadMore={handleLoadMore}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default SearchPage;
