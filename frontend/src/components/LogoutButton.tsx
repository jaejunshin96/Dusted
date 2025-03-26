import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <text onClick={handleLogout} className={styles.navLink} style={{ cursor: "pointer" }}>
      Logout
    </text>
  );
};

export default LogoutButton;
