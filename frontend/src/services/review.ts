import authAxios from '../utils/authentications/authFetch';
import { Movie } from '../types/types';

const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

const API_URL = `${backendUrl}/api/review/reviews/`;

export const getReviewStatus = async (movieId: number) => {
  const response = await authAxios(`${API_URL}status/`, {
    method: 'GET',
    params: {
      movie_id: movieId,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch review status');
  }

  return response.data;
}

export const getReviews = async (page: number, query: string, sorting: string, order: string, folderId?: number | null) => {
  const response = await authAxios(`${API_URL}`, {
    method: "GET",
    params: {
      page: page,
      query: query,
      sorting: sorting,
      order: order,
      folder_id: folderId, // Add folder filtering support
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch reviews');
  }

  return response.data;
}

export const postReview = async (movie: Movie, reviewText: string, rating: number, folderId?: number | null) => {
  const response = await authAxios(`${API_URL}`, {
    method: "POST",
    data: {
      movie_id: movie.movie_id,
      title: movie.title,
      directors: Array.isArray(movie.directors)
        ? movie.directors.join(", ")
        : movie.directors,
      review: reviewText,
      rating: rating,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      folder_id: folderId, // Add folder assignment on creation
    }
  });

  if (response.status !== 201) {
    throw new Error('Failed to post review');
  }

  return response.data;
}

export const patchReview = async (reviewId: number, reviewText: string, rating: number, folderId?: number | null) => {
  const response = await authAxios(`${API_URL}`, {
    method: "PATCH",
    data: {
      id: reviewId,
      review: reviewText,
      rating: rating,
      folder: folderId, // Add ability to update folder
    }
  });

  if (response.status !== 200) {
    throw new Error('Failed to update review');
  }

  return response.data;
}

export const deleteReview = async (reviewId: number) => {
  const response = await authAxios(`${API_URL}`, {
    method: "DELETE",
    data: {
      id: reviewId,
    }
  });

  if (response.status !== 204) {
    throw new Error('Failed to delete review');
  }

  return response.data;
}

// New function to move reviews between folders
export const moveReview = async (reviewId: number, folderId: number | null) => {
  const response = await authAxios(`${API_URL}move/`, {
    method: "POST",
    data: {
      review_id: reviewId,
      folder_id: folderId,
    }
  });

  if (response.status !== 200) {
    throw new Error('Failed to move review');
  }

  return response.data;
}
