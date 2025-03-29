import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

interface LogoutButtonProps {
  onLogout?: () => void; // ✅ Accepting the prop as an optional function
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
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
      Logout
    </span>
  );
};

export default LogoutButton;
