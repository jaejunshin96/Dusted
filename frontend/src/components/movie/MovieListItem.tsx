import React, { useEffect, useState } from "react";
import { Movie } from "../../pages/SearchPage";
import styles from "./MovieListItem.module.css";
import { useTranslation } from "react-i18next";

interface MovieListItemProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieListItem: React.FC<MovieListItemProps> = ({ movie, onClick }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <li
      className={styles.movieListItem}
      onClick={() => onClick(movie)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <div className={styles.title}>{movie.title}</div>
      <div className={styles.director}>{t("Directed by:")} {movie.directors.join(", ")}</div>
    </li>
  );
};

export default MovieListItem;
