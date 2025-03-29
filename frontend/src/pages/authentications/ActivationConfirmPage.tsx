import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./ActivationConfirmPage.module.css";
import { useTranslation } from "react-i18next";

const ActivationConfirmPage: React.FC = () => {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setIsValid(false);
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    axios
      .get(`${backendUrl}/api/validate-activation-token/`, {
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
        {isValid === null && <p className={styles.message}>{t("Validating...")}</p>}
        {isValid === false && (
          <p className={`${styles.message} ${styles.error}`}>
            {t("Invalid or expired activation link. Redirecting to homepage...")}
          </p>
        )}
        {isValid === true && (
          <p className={`${styles.message} ${styles.success}`}>
            {t("Your email has been verified! Redirecting to login...")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivationConfirmPage;
