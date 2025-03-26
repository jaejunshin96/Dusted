import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./ActivationConfirmPage.module.css";

const ActivationConfirmPage: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setIsValid(false);
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/validate-activation-token/`, {
        params: { token },
      })
      .then((response) => {
        if (response.data.success) {
          setIsValid(true);
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setIsValid(false);
          setTimeout(() => navigate("/"), 3000);
        }
      })
      .catch(() => {
        setIsValid(false);
        setTimeout(() => navigate("/"), 3000);
      });
  }, [location, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.activationBox}>
        {isValid === null && <p className={styles.message}>Validating...</p>}
        {isValid === false && (
          <p className={`${styles.message} ${styles.error}`}>
            Invalid or expired activation link. Redirecting to homepage...
          </p>
        )}
        {isValid === true && (
          <p className={`${styles.message} ${styles.success}`}>
            Your email has been verified! Redirecting to login...
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivationConfirmPage;
