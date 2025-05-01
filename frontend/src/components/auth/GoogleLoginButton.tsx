import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import styles from './GoogleLoginButton.module.css';
import i18n from "../../i18n";

const GoogleLoginButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  useEffect(() => {
    // Load the Google Identity Services SDK
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = () => {
    // @ts-ignore (google is added to window by the script)
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      scope: "profile email openid",
    });

    // @ts-ignore
    window.google.accounts.id.prompt();
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      const browserLocale = navigator.language;

      const res = await axios.post(`${backendUrl}/api/social_auth/google/`, {
        auth_token: response.credential,
        locale: browserLocale,
      });

      localStorage.setItem("email", res.data.email);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("country", res.data.country);
      localStorage.setItem("language", res.data.language);
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      i18n.changeLanguage(res.data.language);

      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className={styles.googleButton}
    >
      <FcGoogle className={styles.googleIcon} />
      {t("Continue with Google")}
    </button>
  );
};

export default GoogleLoginButton;
