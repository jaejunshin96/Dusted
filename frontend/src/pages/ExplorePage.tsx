import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import authAxios from '../utils/authentications/authFetch';
import styles from './ExplorePage.module.css';
import MovieModal from '../components/movie/MovieModal';
import MovieGrid from '../components/movie/MovieGrid';
import cn from 'classnames';

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

type SearchType = 'popular' | 'now_playing' | 'upcoming';

const ExplorePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Replace single movies state with a cache object
  const [movieCache, setMovieCache] = useState<{
    popular: Movie[];
    now_playing: Movie[];
    upcoming: Movie[];
  }>({
    popular: [],
    now_playing: [],
    upcoming: [],
  });

  // Track page number for each type
  const [pageCache, setPageCache] = useState<{
    popular: number;
    now_playing: number;
    upcoming: number;
  }>({
    popular: 1,
    now_playing: 1,
    upcoming: 1,
  });

  // Track hasMore state for each type
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
  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

  // Fetch movies only when necessary
  useEffect(() => {
    fetchMovies();
  }, [pageCache, i18n.language, searchType]);

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
    const currentPage = pageCache[searchType];

    try {
      const response = await authAxios(`${backendUrl}/api/film/explore/`, {
        method: "GET",
        params: {
          search_type: searchType,
          page: currentPage,
          lang: i18n.language === 'ko' ? 'ko-KR' : 'en-US',
          region: i18n.language === 'ko' ? 'kr' : 'us',
        },
      });

      const newMovies = response.data.results || [];

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
