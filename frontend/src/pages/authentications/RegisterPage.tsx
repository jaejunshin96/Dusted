import { useState } from "react";
import axios from "axios";
import styles from "./RegisterPage.module.css";
import { text } from "stream/consumers";

interface RegisterResponse {
  success?: string;
  Error?: string;
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/",
        { username, email, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("Registration successful. \nPlease check your email for verification.");
    } catch (err: any) {
      setError(err.response?.data?.Error || "Registration failed");
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className={styles.loginPrompt}>
          <span>Already have an account?</span>
          <br></br>
          <a href="/login" className={styles.loginLink}>Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
