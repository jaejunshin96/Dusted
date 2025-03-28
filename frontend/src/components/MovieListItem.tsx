import React, { useEffect, useState } from "react";
import { Movie } from "./MovieSearch";
import styles from "./MovieListItem.module.css";

interface MovieListItemProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieListItem: React.FC<MovieListItemProps> = ({ movie, onClick }) => {
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
      <div className={styles.director}>Directed by: {movie.directors.join(", ")}</div>
    </li>
  );
};

export default MovieListItem;
