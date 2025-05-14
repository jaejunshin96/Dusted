import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NotFoundPage.module.css";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p className={styles.text}>{t("Oops! The page you're looking for doesn't exist.")}</p>
      <Link to="/">
        <button className={styles.button}>Go back to Home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
