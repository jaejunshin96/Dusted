import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>{t("Oops! The page you're looking for doesn't exist.")}</p>
      <Link to="/">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>Go back to Home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
