import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface ResetResponse {
  success?: boolean;
  message?: string;
  Error?: string;
}

const NewPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      setError("Invalid reset link.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.patch("http://127.0.0.1:8000/api/password-reset-complete/",
        { uidb64, token, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.Error || "Password reset failed");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleResetPassword}>
        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default NewPasswordPage;
