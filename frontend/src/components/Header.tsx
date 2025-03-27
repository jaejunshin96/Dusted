import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import LogoutButton from "./LogoutButton";

const Header: React.FC = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        Dusted
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Home</Link>
        {username && <Link to="/reviews" className={styles.navLink}>Reviews</Link>}
        {username && <LogoutButton />}
      </nav>
    </header>
  );
};

export default Header;
