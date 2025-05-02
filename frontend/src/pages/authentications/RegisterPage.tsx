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
  const [validating, setValidating] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
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

  // Add password validation
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
        setPasswordError(t("Password must be at least 9 characters long and include \
                            letters, numbers, and special characters (!@#$%^&*)."));
      } else {
        setPasswordError(null);
      }
    } else {
      setPasswordError(null);
    }
  }, [password, t]);

  // Add password match validation effect
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
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isUsernameValid = username.trim().length >= 3;
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = password === password2;
    const isCountryValid = country.trim() !== '';
    const isLanguageValid = language.trim() !== '';

    setIsFormValid(
      isEmailValid &&
      isUsernameValid &&
      isPasswordValid &&
      doPasswordsMatch &&
      isCountryValid &&
      isLanguageValid
    );

    setError(null);
  }, [email, username, password, password2, country, language]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setValidating(true);

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
        setError(t("Password must be at least 9 characters long and include \
                  letters, numbers, and special characters (!@#$%^&*).")
                  || "Registration failed");
      } else if (err.response?.data?.password) {
        setError(t("Passwords do not match.") || "Registration failed");
      } else {
        setError(t("An unexpected error occurred."));
      }
    } finally {
      setValidating(false);
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
          <div className={styles.formGroup}>
            <label htmlFor="email">{t("Email")}</label>
            <input
              id="email"
              type="email"
              placeholder={t("Enter your email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">{t("Username")}</label>
            <input
              id="username"
              type="text"
              placeholder={t("Choose a username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Language Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="language">{t("Language")}</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="" disabled>{t("Select language")}</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="country">{t("Country")}</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>{t("Select country")}</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelWithValidation}>
              <label htmlFor="password">{t("Password")}</label>
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
              placeholder={t("Create password")}
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
              placeholder={t("Confirm password")}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className={passwordMatchError ? styles.inputError : ""}
            />
            {passwordMatchError && <p className={styles.fieldError}>{passwordMatchError}</p>}
          </div>

          <button type="submit" disabled={validating || !isFormValid}>
            {validating ? t("Validating...") : t("Register")}
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
