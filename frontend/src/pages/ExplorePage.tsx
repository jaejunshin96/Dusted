import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExplorePage.module.css';
import { Movie } from '../types/types';
import MovieModal from '../components/movie/MovieModal';
import MovieGrid from '../components/movie/MovieGrid';
import cn from 'classnames';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlist';
import { getMovieExplore } from '../services/movie';
import { toast } from 'react-toastify';

type SearchType = 'popular' | 'now_playing' | 'upcoming';

const ExplorePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);

  const [movieCache, setMovieCache] = useState<{
    popular: Movie[];
    now_playing: Movie[];
    upcoming: Movie[];
  }>({
    popular: [],
    now_playing: [],
    upcoming: [],
  });

  const [pageCache, setPageCache] = useState<{
    popular: number;
    now_playing: number;
    upcoming: number;
  }>({
    popular: 1,
    now_playing: 1,
    upcoming: 1,
  });

  const [hasMoreCache, setHasMoreCache] = useState<{
    popular: boolean;
    now_playing: boolean;
    upcoming: boolean;
  }>({
    popular: true,
    now_playing: true,
    upcoming: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchType, setSearchType] = useState<SearchType>('now_playing');

  // Fetch watchlist when component mounts
  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        const watchlistData = await getWatchlist();
        setWatchlistIds(watchlistData.map((item: any) => item.movie_id));
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      }
    };

    fetchWatchlistData();
  }, []);

  // Fetch movies only when necessary
  useEffect(() => {
    fetchMovies();
  }, [pageCache, i18n.language, searchType]);

  // Add this effect to disable scrolling when modal is open
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

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    const currentPage = pageCache[searchType];

    try {
      const movieData = await getMovieExplore(searchType, currentPage, i18n.language);

      const newMovies = (movieData.results || []).map((movie: any) => ({
        ...movie,
        movie_id: movie.id
      }));

      setMovieCache(prev => ({
        ...prev,
        [searchType]: currentPage === 1
          ? newMovies
          : [...prev[searchType], ...newMovies]
      }));

      setHasMoreCache(prev => ({
        ...prev,
        [searchType]: newMovies.length > 0
      }));
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(t('Failed to load movies'));
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLoadMore = useCallback(() => {
    setPageCache(prev => ({
      ...prev,
      [searchType]: prev[searchType] + 1
    }));
  }, [searchType]);

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
        //toast?.success(`${movie.title} removed from watchlist`);
      }
    } catch (error) {
      console.error('Watchlist operation failed:', error);
      //toast?.error('Failed to update watchlist');
    }
  };

  return (
    <div className={styles.container}>
      {/* toggle buttons */}
      <div className={styles.switchContainer}>
      <button
          className={cn(styles.switchButton, {
            [styles.active]: searchType === 'popular',
          })}
          onClick={() => setSearchType('popular')}
        >
          {t('Popular')}
        </button>

        <button
          className={cn(styles.switchButton, {
            [styles.active]: searchType === 'now_playing',
          })}
          onClick={() => setSearchType('now_playing')}
        >
          {t('Now Playing')}
        </button>

        <button
          className={cn(styles.switchButton, {
            [styles.active]: searchType === 'upcoming',
          })}
          onClick={() => setSearchType('upcoming')}
        >
          {t('Upcoming')}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <MovieGrid
        movies={movieCache[searchType]}
        loading={loading}
        hasMore={hasMoreCache[searchType]}
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

export default ExplorePage;
