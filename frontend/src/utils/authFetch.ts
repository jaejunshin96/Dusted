import refreshAccessToken from "./refreshToken";

const authFetch = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("access_token");

  //axios to be used here, in fact on the whole project for fetch
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    console.log("Access token expired. Trying to refresh...");
    token = await refreshAccessToken();

    if (token) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${token}`,
        },
      });
    }
  }

  return response;
};

export default authFetch;
