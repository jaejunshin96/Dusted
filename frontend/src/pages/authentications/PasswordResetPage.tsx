import { useState } from "react";
import axios from "axios";
import styles from "./PasswordResetPage.module.css";

//interface PasswordResetResponse {
//  success?: string;
//  Error?: string;
//}

const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/request-password-reset-email/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(response.data.success || "Password reset link sent.");
    } catch (err: any) {
      setMessage(err.response?.data?.Error || "An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetBox}>
        <h2>Reset Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleResetRequest}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
