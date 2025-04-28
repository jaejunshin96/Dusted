import authAxios from '../utils/authentications/authFetch';

const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

const API_URL = `${backendUrl}/api/film`;

export const getMovieTrailer = async (movieId: number, lang: string) => {
  const response = await authAxios(`${API_URL}/trailer/`, {
    method: 'GET',
    params: {
        movie_id: movieId,
        lang: lang,
     },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch movie trailer');
  }

  return response.data;
}

export const getMovieExplore = async (searchType: string, page: number, lang: string, country: string) => {
  const response = await authAxios(`${API_URL}/explore/`, {
    method: 'GET',
    params: {
      search_type: searchType,
      page: page,
      lang: lang,
      region: country,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch movies');
  }

  return response.data;
}

export const getMovieSearch = async (query: string, page: number, lang: string, country: string) => {
  const response = await authAxios(`${API_URL}/search/`, {
    method: 'GET',
    params: {
      query: query,
      page: page,
      lang: lang,
      region: country,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch movies');
  }

  return response.data;
}
