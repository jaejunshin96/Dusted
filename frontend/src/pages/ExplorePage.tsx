import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import authAxios from '../utils/authentications/authFetch';
import styles from './ExplorePage.module.css';
import MovieModal from '../components/movie/MovieModal';
import clapperboard from "../assets/clapperboard.png";

interface Movie {
  id: number;
  original_title: string;
  title: string;
  directors: [string];
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
}

const ExplorePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

  // Fetch movies on initial load and when page changes
  useEffect(() => {
    fetchMovies();
  }, [page, i18n.language]);

  // Handle body overflow when modal is open
  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMovie]);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAxios(`${backendUrl}/api/film/explore/`, {
        method: "GET",
        params: {
          page,
          lang: i18n.language === 'ko' ? 'ko-KR' : 'en-US',
          region: i18n.language === 'ko' ? 'kr' : 'us',
        },
      });

      const newMovies = response.data.results || [];

      if (page === 1) {
        setMovies(newMovies);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
      }

      setHasMore(newMovies.length > 0);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(t('Failed to load movies'));
    } finally {
      setLoading(false);
    }
  };

  // Set up intersection observer for infinite scroll
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div className={styles.container}>
      {/*<h1 className={styles.title}>{t('Explore Movies')}</h1>*/}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {movies.map((movie, index) => {
          const isLastElement = index === movies.length - 1;

          return (
            <div
              key={`${movie.id}-${index}`}
              ref={isLastElement ? lastMovieElementRef : null}
              className={styles.card}
              onClick={() => handleMovieClick(movie)}
            >
              <div
                className={styles.poster}
                style={{
                  backgroundImage: `url(${getImageUrl(movie.poster_path || movie.backdrop_path)})`
                }}
              >
                <div className={styles.overlay}>
                  <h3>{movie.title}</h3>
                  <p>{movie.directors?.join(', ')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <div className={styles.loader}>{t('Loading...')}</div>}

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
