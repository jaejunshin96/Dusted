import React, { useEffect, useState } from "react";
import { Movie } from "./MovieSearch";
import authAxios from "../utils/authentications/authFetch";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [writingReview, setWritingReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting your review.");
      return;
    }

    try {
      const response = await authAxios(`${backendUrl}/api/review/reviews/`, {
        method: "POST",
        data: {
          movie_id: movie.id,
          title: movie.title,
          rating: rating,
          review: reviewText,
          image_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        }
      });

      if (response.status === 201) {
        alert("Review submitted successfully!");
        setWritingReview(false);
        setReviewText("");
        setRating(0);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Please try again.");
    }
  };

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
          marginTop: "40px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "900px",
          height: "500px",
          textAlign: "left",
          color: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.7)",
          position: "relative",
          animation: "slideUp 1.0s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!writingReview ? (
          <>
            <h2
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              {movie.title} ({movie.original_title})
            </h2>
            <br></br>
            <p
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              <strong>Director:</strong> {movie.directors}
            </p>
            <br></br>
            <p
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              <strong>Overview:</strong> {movie.overview || "No description available."}
            </p>
            <br></br>
            <div
              style={{
                position: "absolute", // Make it stick to the bottom
                bottom: "20px",        // Distance from the bottom of the modal
                left: "0",
                right: "0",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <button
                onClick={() => setWritingReview(true)}
                style={{
                  marginRight: "10px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                Write a Review
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              Review for {movie.title} ({movie.original_title})
            </h2>
            <br></br>
            {/* Rating System */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: star <= rating ? "#FFD700" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              value={reviewText}
              placeholder="What did you like from this film?"
              onChange={(e) => setReviewText(e.target.value)}
              rows={7}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                resize: "vertical",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            />
            <div
              style={{
                position: "absolute", // Make it stick to the bottom
                bottom: "20px",        // Distance from the bottom of the modal
                left: "0",
                right: "0",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <button
                onClick={handleSubmitReview}
                style={{
                  marginRight: "10px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                Submit Review
              </button>
              <button
                onClick={() => setWritingReview(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
