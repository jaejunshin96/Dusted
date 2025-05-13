import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./NewPasswordPage.module.css";
import { useTranslation } from "react-i18next";

const NewPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const location = useLocation();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  const searchParams = new URLSearchParams(location.search);
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uidb64 || !token) {
      navigate("/");
    }
  }, [uidb64, token, navigate]);

  // Password validation function
  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
    const isLongEnough = password.length >= 9;

    return hasLetter && hasDigit && hasSpecial && isLongEnough;
  };

  // Password validation effect
  useEffect(() => {
    if (password) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasDigit = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
      const isLongEnough = password.length >= 9;

      if (!isLongEnough || !hasLetter || !hasDigit || !hasSpecial) {
        setPasswordError(t("Password must be at least 9 characters long and include letters, numbers, and special characters (!@#$%^&*)."));
      } else {
        setPasswordError(null);
      }
    } else {
      setPasswordError(null);
    }
  }, [password, t]);

  // Password match validation effect
  useEffect(() => {
    if (password2) {
      if (password !== password2) {
        setPasswordMatchError(t("Passwords do not match"));
      } else {
        setPasswordMatchError(null);
      }
    } else {
      setPasswordMatchError(null);
    }
  }, [password, password2, t]);

  // Form validation effect
  useEffect(() => {
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = password === password2;

    setIsFormValid(isPasswordValid && doPasswordsMatch);
    setError(null);
  }, [password, password2]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!uidb64 || !token) {
      setError(t("Invalid reset link."));
      return;
    }

    if (!isFormValid) {
      return;
    }

    try {
      const response = await axios.patch(`${backendUrl}/api/auth/password-reset-complete/`,
        { uidb64, token, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setIsRedirecting(true);
        setMessage(t("Password reset successful. Redirecting to login..."));
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err: any) {
      if (err.response?.data?.password) {
        setError(t("Password must be at least 9 characters long and include letters, numbers, and special characters."))
      } else if (err.response?.data?.password2) {
        setError(t("Passwords do not match."));
      } else {
        setError(t("An unexpected error occurred."));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetBox}>
        <h2>{t("Reset Password")}</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleResetPassword}>
          <div className={styles.formGroup}>
            <div className={styles.labelWithValidation}>
              <label htmlFor="password">{t("New Password")}</label>
              <div className={styles.validationIndicators}>
                <span className={password.length >= 9 ? styles.validRule : styles.invalidRule} title={t("9+ characters")}>
                  9+
                </span>
                <span className={/[a-zA-Z]/.test(password) ? styles.validRule : styles.invalidRule} title={t("Contains letters")}>
                  A
                </span>
                <span className={/[0-9]/.test(password) ? styles.validRule : styles.invalidRule} title={t("Contains numbers")}>
                  1
                </span>
                <span className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password) ? styles.validRule : styles.invalidRule} title={t("Contains special characters")}>
                  @
                </span>
              </div>
            </div>
            <input
              id="password"
              type="password"
              placeholder={t("New Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={passwordError ? styles.inputError : ""}
            />
            {passwordError && <p className={styles.fieldError}>{passwordError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">{t("Confirm Password")}</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder={t("Confirm Password")}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className={passwordMatchError ? styles.inputError : ""}
            />
            {passwordMatchError && <p className={styles.fieldError}>{passwordMatchError}</p>}
          </div>

          <button type="submit" disabled={isRedirecting || !isFormValid}>
            {t("Reset Password")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
