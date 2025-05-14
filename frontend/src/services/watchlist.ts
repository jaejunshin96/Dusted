import authAxios from '../utils/authentications/authFetch';
import { Movie } from '../types/types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendUrl}/api/watchlist/watchlist/`;

export const getWatchlist = async () => {
  const response = await authAxios(API_URL, {
    method: 'GET',
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch watchlist');
  }

  return response.data;
};

export const addToWatchlist = async (movie: Movie) => {
  const watchlistItem = {
    movie_id: movie.id,
    title: movie.title,
    directors: Array.isArray(movie.directors)
      ? movie.directors.join(', ') : movie.directors,
    cast: Array.isArray(movie.cast)
      ? movie.cast.join(', ') : movie.cast,
    genre_ids: Array.isArray(movie.genre_ids)
      ? movie.genre_ids.join(', ') : movie.genre_ids,
    release_date: movie.release_date,
    overview: movie.overview,
    backdrop_path: movie.backdrop_path,
    poster_path: movie.poster_path
  };

  const response = await authAxios(API_URL, {
    method: 'POST',
    data: watchlistItem,
  });

  if (response.status !== 201) {
    throw new Error('Failed to add movie to watchlist');
  }

  return response.data;
};

export const removeFromWatchlist = async (movieId: number) => {
  const response = await authAxios(API_URL, {
    method: 'DELETE',
    params: { movie_id: movieId },
  });

  if (response.status !== 204) {
    throw new Error('Failed to remove movie from watchlist');
  }

  return response.data;
};
