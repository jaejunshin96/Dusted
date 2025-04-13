//import { useNavigate } from "react-router-dom";
//import LogoutButton from "../components/LogoutButton";
import MovieSearch from "../components/movie/MovieSearch";
import styles from "./HomePage.module.css";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const username = localStorage.getItem("username");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dusted</h1>
        <p className={styles.welcome}>
          {t("WelcomeMessage", { username })}
        </p>
      </div>

      <div className={styles.searchSection}>
        <MovieSearch />
      </div>
    </div>
  )
};

export default HomePage;
