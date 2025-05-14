import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./VerifyEmailPage.module.css";
//import { useTranslation } from "react-i18next";

const VerifyEmailPage: React.FC = () => {
  //const { t } = useTranslation();
  const [message, setMessage] = useState<string>("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (token) {
      axios
        .get(`${backendUrl}/api/auth/verify-email/`, {
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
