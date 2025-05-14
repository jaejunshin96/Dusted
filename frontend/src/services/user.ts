import authAxios from '../utils/authentications/authFetch';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendUrl}/api/auth/`

export const updateLanguage = async (lang: string) => {
  const response = await authAxios(`${API_URL}update-language/`, {
    method: 'PATCH',
    data: {
      language: lang,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to update language');
  }

  return response.data;
}

export const updateCountry = async (country: string) => {
  const response = await authAxios(`${API_URL}update-country/`, {
    method: 'PATCH',
    data: {
      country: country,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to update country');
  }

  return response.data;
}
