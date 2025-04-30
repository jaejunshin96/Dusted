import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./RegisterPage.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { languages, countries } from "../../constants/localization";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;

  // Set default country and language from browser settings
  useEffect(() => {
    // Get browser language (e.g., "en-US")
    const browserLang = navigator.language || navigator.languages?.[0] || "en-US";

    // Extract language code (e.g., "en" from "en-US")
    const langCode = browserLang.split('-')[0];
    setLanguage(langCode);

    // Extract country code if available (e.g., "US" from "en-US")
    if (browserLang.includes('-')) {
      const countryCode = browserLang.split('-')[1];
      setCountry(countryCode);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await axios.post(`${backendUrl}/api/auth/register/`,
        { username, email, password, password2, country, language },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(t("Registration successful. Please check your email for verification."));

      setTimeout(() => {
        navigate("/");
      }, 10000);

    } catch (err: any) {
      if (err.response?.data?.email) {
        setError(t("Email alreay exists.") || "Registration failed");
      } else if (err.response?.data?.username) {
        setError(t("Username already exists.") || "Registration failed");
      } else if (err.response?.data?.password2) {
        setError(t("Password must be at least 8 characters long.") || "Registration failed");
      } else if (err.response?.data?.password) {
        setError(t("Passwords do not match.") || "Registration failed");
      } else {
        setError(t("An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h2>{t("Register")}</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && (
          <p className={styles.message}>
            {message.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder={t("Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={t("Username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Language Selection */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value="" disabled>{t("Select Language")}</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          {/* Country Selection */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="" disabled>{t("Select Country")}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="password"
            placeholder={t("Password")}
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
          <button type="submit" disabled={loading}>
            {loading ? t("Validating...") : t("Register")}
          </button>
        </form>
        <div className={styles.loginPrompt}>
          <span>{t("Already have an account?")}</span>
          <br></br>
          <a href="/login" className={styles.loginLink}>{t("Sign In")}</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
