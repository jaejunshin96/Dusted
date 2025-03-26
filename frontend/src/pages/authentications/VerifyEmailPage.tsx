import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./VerifyEmailPage.module.css";

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string>("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (token) {
      axios
        .get(`http://127.0.0.1:8000/api/verify-email/`, {
          params: { token }, // Pass token as a query parameter
        })
        .then((response) => {
          setMessage(response.data.email || "Verification successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch(() => setMessage("Error verifying email. Please try again later."));
    } else {
      setMessage("Invalid verification link.");
    }
  }, [location, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.verifyBox}>
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
