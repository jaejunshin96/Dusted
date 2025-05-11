import { useState, useEffect, useCallback } from "react";
import MovieGrid from "../components/movie/MovieGrid";
import MovieModal from "../components/movie/MovieModal";
import { Movie } from '../types/types';
import styles from "./SearchPage.module.css";
import { useTranslation } from "react-i18next";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlist';
import { getMovieSearch } from "../services/movie";
import { toast } from "react-toastify";
import EmptyContainer from "../components/movie/EmptyContainer";

const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const currentLanguage = localStorage.getItem('language') || i18n.language;
  const currentCountry = localStorage.getItem('country') || 'US';

  // Fetch watchlist when component mounts
  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        const watchlistData = await getWatchlist();
        setWatchlistIds(watchlistData.map((movie: Movie) => movie.movie_id));
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      }
    };

    fetchWatchlistData();
  }, []);

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
  }, [page, searchAttempted]);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");

    try {
      const movieData = await getMovieSearch(query, page, currentLanguage, currentCountry);

      const newMovies = (movieData.results || []).map((movie: any) => ({
        ...movie,
        movie_id: movie.id
      }));

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
    if (query.trim().length > 0) {
      setLoading(true);
      setMovies([]);
      setHasMore(false);
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

  // Handle watchlist toggle
  const handleWatchlistToggle = async (movie: Movie, isAdding: boolean) => {
    try {
      if (isAdding) {
        await addToWatchlist(movie);
        setWatchlistIds(prev => [...prev, movie.movie_id]);
        toast.success(`${movie.title} added to watchlist`);
      } else {
        await removeFromWatchlist(movie.movie_id);
        setWatchlistIds(prev => prev.filter(id => id !== movie.movie_id));
      }
    } catch (error) {
      console.error('Watchlist operation failed:', error);
    }
  };

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

      {!searchAttempted && movies.length === 0 && !loading && !error && (
        <EmptyContainer
          title={t("Discover your next favorite movie")}
          text={t("Type a movie title in the search box above to get started")}
        />
      )}

      {searchAttempted && movies.length === 0 && !loading && (
        <EmptyContainer
          title={t("No movies found")}
          text={t("Try a different search term or check your spelling")}
        />
      )}

      <MovieGrid
        movies={movies}
        loading={loading}
        hasMore={hasMore}
        onMovieClick={handleMovieClick}
        onLoadMore={handleLoadMore}
        watchlistIds={watchlistIds}
        onWatchlistToggle={handleWatchlistToggle}
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
