import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import MovieSearch from "../components/MovieSearch";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dusted</h1>
        <p className={styles.welcome}>Welcome, <strong>{username}</strong></p>
      </div>

      <div className={styles.searchSection}>
        <MovieSearch />
      </div>

      {/*<div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => navigate("/reviews")}>
          Reviews
        </button>
        <LogoutButton />
      </div>*/}
    </div>
  )
};

export default HomePage;
