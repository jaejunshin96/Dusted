import React, { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/watchlist';
import MovieGrid from '../components/movie/MovieGrid';
import MovieModal from '../components/movie/MovieModal';
import { Movie } from '../types/types';
import styles from './WatchlistPage.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import EmptyContainer from '../components/movie/EmptyContainer';

const WatchlistPage: React.FC = () => {
  const { t } = useTranslation();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch watchlist on component mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

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

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const data = await getWatchlist();

      // Convert genre_ids to number arrays if they're strings
      const processedData = data.map((movie: Movie) => {
        // If genre_ids is a string, convert it to an array of numbers
        if (movie.genre_ids && typeof movie.genre_ids === 'string') {
          return {
            ...movie,
            genre_ids: (movie.genre_ids as string).split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
          };
        }
        // If genre_ids is already an array but contains strings, convert to numbers
        else if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 && typeof movie.genre_ids[0] === 'string') {
          return {
            ...movie,
            genre_ids: movie.genre_ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id))
          };
        }
        return movie;
      });

      setMovies(processedData);
      setWatchlistIds(processedData.map((movie: Movie) => movie.movie_id));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError(t('Failed to load watchlist. Please try again later.'));
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    // Refresh watchlist after closing modal in case there were changes
    fetchWatchlist();
  };

  const handleWatchlistToggle = async (movie: Movie) => {
    try {
      // Remove movie from UI first for better user experience
      await removeFromWatchlist(movie.movie_id);
      setMovies(prevMovies => prevMovies.filter(m => m.movie_id !== movie.movie_id));
      setWatchlistIds(prevIds => prevIds.filter(id => id !== movie.movie_id));
      toast.success(`${movie.title} removed from watchlist`);
    } catch (err) {
      console.error('Error updating watchlist:', err);
      fetchWatchlist();
      setError(t('Failed to update watchlist. Please try again.'));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t('My Watchlist')}</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {/*{loading && <div className={styles.spinner}></div>}*/}

      {!error && !loading && movies.length === 0 && (
        <EmptyContainer
          icon="📚"
          title={t('Your watchlist is empty')}
          text={t('Add movies to your watchlist to see them here.')}
        />
      )}

      <MovieGrid
        movies={movies}
        loading={loading}
        hasMore={false}
        onMovieClick={handleMovieClick}
        onLoadMore={() => {}}
        watchlistIds={watchlistIds}
        onWatchlistToggle={handleWatchlistToggle}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WatchlistPage;
