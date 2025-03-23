import React, { useEffect, useState } from "react";
import { Movie } from "./MovieSearch";
import axios from "axios";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [writingReview, setWritingReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

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
      const response = await axios.post("http://127.0.0.1:8000/api/review/reviews/",
        {
          movie_id: movie.id,
          title: movie.title,
          rating: rating,
          review: reviewText,
          image_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Adjust if you store tokens differently
          },
        }
      );

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
          borderRadius: "8px",
          width: "80%",
          maxWidth: "700px",
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
            <h2>{movie.title} ({movie.original_title})</h2>
            <p><strong>Director:</strong> {movie.directors}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Overview:</strong> {movie.overview || "No description available."}</p>

            <div style={{ marginTop: "10px" }}>
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
            <h2>Review for {movie.title}</h2>

            {/* Rating System */}
            <div>
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
            <div style={{ marginTop: "10px" }}>
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
