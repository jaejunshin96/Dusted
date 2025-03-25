import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import MovieSearch from "../components/MovieSearch";
import styles from "./HomePage.module.css"

const HomePage: React.FC = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div>
      <h1 className={styles.h1}>Dusted</h1>
      <p className={styles.p}>Welcome, <strong>{username}</strong></p>
      <div className={styles.searchContainer}>
        <MovieSearch />
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => navigate("/reviews")}
        >
          Reviews
        </button>

        <LogoutButton />
      </div>
    </div>
  )
};

export default HomePage;
