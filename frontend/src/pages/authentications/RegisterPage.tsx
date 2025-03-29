import { useState } from "react";
import axios from "axios";
import styles from "./RegisterPage.module.css";
import { useTranslation } from "react-i18next";

//interface RegisterResponse {
//  success?: string;
//  Error?: string;
//}

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(`${backendUrl}/api/register/`,
        { username, email, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(t("Registration successful. Please check your email for verification."));
    } catch (err: any) {
      setError(err.response?.data?.Error || t("Registration failed"));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h2>Register</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
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
          <button type="submit">{t("Register")}</button>
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
