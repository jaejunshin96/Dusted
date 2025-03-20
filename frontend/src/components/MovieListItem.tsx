import React, { useEffect, useState } from "react";
import { Movie } from "./MovieSearch";

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
      style={{
        padding: "8px",
        cursor: "pointer",
        borderBottom: "1px solid #ddd",
        boxSizing: "border-box",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
      onClick={() => onClick(movie)}
    >
      {movie.title}
    </li>
  );
};

export default MovieListItem;
