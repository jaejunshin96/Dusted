import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import axios from "axios";
import styles from "./LoginPage.module.css";
import videoSrc from "../../assets/The horse in motion.mp4";

interface LoginResponse {
  email: string;
  username: string;
  access_token: string;
  refresh_token: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/api/login/`, {
        email,
        password,
      });

      const data: LoginResponse = response.data;

      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      console.log(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
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
          <h2>Sign In</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>
            <a href="/register">Create Account</a> | <a href="/password-reset">Forgot Password?</a>
          </p>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLoginButton />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
