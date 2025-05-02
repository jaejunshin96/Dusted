import { useState } from "react";
import axios from "axios";
import styles from "./PasswordResetPage.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

//interface PasswordResetResponse {
//  success?: string;
//  Error?: string;
//}

const PasswordResetPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/request-password-reset-email/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setMessage(t("Password reset link sent"));
      }

      setTimeout(() => {
        navigate("/");
      }, 10000);
    } catch (err: any) {
      if (err.response?.data?.google) {
        setError(t("Try with Google."));
      } else if (err.response?.data?.Error) {
        setError(t("Email not found."));
      } else {
        setError(t("An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetBox}>
        <h2>{t("Reset Password")}</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleResetRequest}>
          <input
            type="email"
            placeholder={t("Enter your email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? t("Sending email...") : t("Send Reset Link")}
          </button>
        </form>

        <div className={styles.loginPrompt}>
          <span>{t("Remember your password?")}</span>
          <br></br>
          <a href="/login" className={styles.loginLink}>{t("Sign In")}</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
