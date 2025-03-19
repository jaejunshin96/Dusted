import axios from "axios";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.log("No refresh token found. User must log in.");
    return null;
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/token_refresh/",
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
