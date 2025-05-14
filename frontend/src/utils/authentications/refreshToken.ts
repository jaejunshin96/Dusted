import axios from "axios";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${backendUrl}/api/token_refresh/`,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error: any) {
    console.error("Error refreshing token:", error.response?.data || error);
    return null;
  }
};

export default refreshAccessToken;
