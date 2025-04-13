import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const GoogleLoginButton = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  const lang = i18n.language;

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
      text="continue_with"
      locale={lang}
    />
  );
};

export default GoogleLoginButton;
