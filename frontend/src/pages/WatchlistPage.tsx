import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/watchlist';
import MovieGrid from '../components/movie/MovieGrid';
import MovieModal from '../components/movie/MovieModal';
import { Movie } from '../types/types';
import styles from './WatchlistPage.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const WatchlistPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      setMovies(data);
      setWatchlistIds(data.map((movie: Movie) => movie.movie_id));
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
      // Log the movie ID to debug
      console.log('Attempting to remove movie from watchlist:', movie.id, movie);

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

      {!loading && movies.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{t('Your watchlist is empty.')}</p>
          <button className={styles.browseButton} onClick={() => navigate('/search')}>
            {t('Browse Movies')}
          </button>
        </div>
      ) : (
        <MovieGrid
          movies={movies}
          loading={loading}
          hasMore={false}
          onMovieClick={handleMovieClick}
          onLoadMore={() => {}}
          watchlistIds={watchlistIds}
          onWatchlistToggle={handleWatchlistToggle}
        />
      )}

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
