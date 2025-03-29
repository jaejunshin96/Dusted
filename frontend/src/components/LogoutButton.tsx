import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";

interface LogoutButtonProps {
  onLogout?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <span onClick={handleLogout} className={styles.navLink}>
      {t("Logout")}
    </span>
  );
};

export default LogoutButton;
