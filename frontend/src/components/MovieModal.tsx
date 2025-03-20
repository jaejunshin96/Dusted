import React, { useEffect, useState } from "react";
import { Movie } from "./MovieSearch";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false); // Clean up when unmounting
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
          backgroundColor: movie.backdrop_path ? "transparent" : "#2a2a2a",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "500px",
          textAlign: "left",
          color: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.7)",
          position: "relative",
          animation: "slideUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{movie.title}</h2>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Overview:</strong> {movie.overview || "No description available."}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default MovieModal;
