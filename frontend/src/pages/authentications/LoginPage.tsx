import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import axios from "axios";
import styles from "./LoginPage.module.css";
import videoSrc from "../../assets/The horse in motion.mp4";
import { useTranslation } from "react-i18next";

interface LoginResponse {
  email: string;
  username: string;
  access_token: string;
  refresh_token: string;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/login/`, {
        email,
        password,
      });

      const data: LoginResponse = response.data;

      if (data.access_token && data.refresh_token) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        navigate("/");
      }
    } catch (err: any) {
      if (err.response?.data?.detail === "google") {
        setError(t("Please continue your login using Google."));
      } else if (err.response?.data?.detail === "credentials") {
        setError(t("Invalid credentials"));
      } else if (err.response?.data?.detail === "verify") {
        setError(t("Not verified"));
      } else {
        setError(t("An unexpected error occurred."));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Video Section */}
        <div className={styles.videoContainer}>
          <video src={videoSrc} autoPlay loop muted playsInline className={styles.video} />
        </div>

        {/* Login Section */}
        <div className={styles.loginBox}>
          <h2>{t("Sign In")}</h2>
          {error && (
            <p className={styles.error}>
              {error.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder={t("Email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={t("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{t("Login")}</button>
          </form>
          <p>
            <a href="/register">{t("Create Account")}</a> | <a href="/password-reset">{t("Forgot Password?")}</a>
          </p>
          <div className={styles.socialLoginContainer}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLoginButton />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
