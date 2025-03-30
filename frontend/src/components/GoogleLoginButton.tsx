import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : "";

  const handleSuccess = async (response: any) => {
    try {
      const res = await axios.post(`${backendUrl}/api/social_auth/google/`, {
        auth_token: response.credential, // Send Google token to Django backend
      });

      localStorage.setItem("email", res.data.email);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google login failed")}
    />
  );
};

export default GoogleLoginButton;
