import React, { useRef, useCallback } from 'react';
import styles from './MovieGrid.module.css';
import clapperboard from "../../assets/clapperboard.png";
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons

interface Movie {
  id: number;
  original_title: string;
  title: string;
  directors: [string];
  release_date: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
}

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  hasMore: boolean;
  onMovieClick: (movie: Movie) => void;
  onLoadMore: () => void;
  watchlistIds: number[]; // Add this new prop to track watchlist items
  onWatchlistToggle: (movie: Movie, isAdding: boolean) => void; // Add this handler
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  hasMore,
  onMovieClick,
  onLoadMore,
  watchlistIds = [],
  onWatchlistToggle
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for infinite scroll
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  // Handler to prevent event bubbling
  const handleWatchlistClick = (e: React.MouseEvent, movie: Movie, isInWatchlist: boolean) => {
    e.stopPropagation();
    onWatchlistToggle(movie, !isInWatchlist);
  };

  return (
    <>
      <div className={styles.grid}>
        {movies.map((movie, index) => {
          const isLastElement = index === movies.length - 1;
          const isInWatchlist = watchlistIds.includes(movie.id);

          return (
            <div
              key={`${movie.id}-${index}`}
              ref={isLastElement ? lastMovieElementRef : null}
              className={styles.card}
              onClick={() => onMovieClick(movie)}
            >
              <div
                className={styles.poster}
                style={{
                  backgroundImage: `url(${getImageUrl(movie.poster_path || movie.backdrop_path)})`
                }}
              >
                <button
                  className={styles.watchlistButton}
                  onClick={(e) => handleWatchlistClick(e, movie, isInWatchlist)}
                  aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {isInWatchlist ? <FaHeart className={styles.heartFilled} /> : <FaRegHeart />}
                </button>

                <div className={styles.overlay}>
                  <h3>{movie.title}</h3>
                  <p>{movie.directors?.join(', ')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <div className={styles.spinner}></div>}
    </>
  );
};

export default MovieGrid;
