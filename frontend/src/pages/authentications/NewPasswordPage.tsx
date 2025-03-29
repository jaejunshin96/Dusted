import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./NewPasswordPage.module.css";
import { useTranslation } from "react-i18next";

//interface ResetResponse {
//  success?: boolean;
//  message?: string;
//  Error?: string;
//}

const NewPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const searchParams = new URLSearchParams(location.search);
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uidb64 || !token) {
      navigate("/"); // Redirect to home if token is invalid
    }
  }, [uidb64, token, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!uidb64 || !token) {
      setError(t("Invalid reset link."));
      return;
    }

    if (password !== password2) {
      setError(t("Passwords do not match."));
      return;
    }

    try {
      await axios.patch(`${backendUrl}/api/password-reset-complete/`,
        { uidb64, token, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(t("Password reset successful. Redirecting to login..."));
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.Error || t("Password reset failed"));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetBox}>
        <h2>Reset Password</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder={t("New Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("Confirm Password")}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button type="submit">{t("Reset Password")}</button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
