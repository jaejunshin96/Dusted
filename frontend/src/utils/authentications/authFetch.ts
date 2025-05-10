import axios, { AxiosRequestConfig } from "axios";
import refreshAccessToken from "./refreshToken";

const authAxios = async (url: string, options: AxiosRequestConfig = {}) => {
  let token = localStorage.getItem("access_token");

  try {
    const response = await axios({
      url,
      method: options.method || "GET",
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: options.data || null,
      params: options.params || null,
    });

    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      token = await refreshAccessToken();

      if (token) {
        try {
          // Retry the request with the refreshed token
          return await axios({
            url,
            method: options.method || "GET",
            headers: {
              ...options.headers,
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: options.data || null,
            params: options.params || null,
          });
        } catch (retryError) {
          console.error("Failed to retry with refreshed token:", retryError);
          throw retryError;
        }
      }
    }
    throw error;
  }
};

export default authAxios;
