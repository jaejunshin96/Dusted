import React, { useState } from "react";
import { Movie } from "./MovieSearch";
import authAxios from "../utils/authentications/authFetch";
import { useTranslation } from "react-i18next";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { t } = useTranslation();
  const [writingReview, setWritingReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert(t("Please select a rating before submitting your review."));
      return;
    }

    try {
      const response = await authAxios(`${backendUrl}/api/review/reviews/`, {
        method: "POST",
        data: {
          movie_id: movie.id,
          title: movie.title,
          rating,
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
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modalContainer} ${styles.modalBackgroundImage}`}
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!writingReview ? (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>
                {movie.title} ({movie.original_title})
              </h2>
              <p className={styles.textBlock}><strong>Director:</strong> {movie.directors || "Not found"}</p>
              <p className={styles.textBlock}><strong>Release Date:</strong> {movie.release_date || "Not found."}</p>
              <p className={styles.textBlock}>{movie.overview || "Not found."}</p>
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button}`} onClick={() => setWritingReview(true)}>
                Review
              </button>
              {/*<button className={`${styles.button} ${styles.closeButton}`} onClick={onClose}>
                Close
              </button>*/}
            </div>
          </>
        ) : (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>
                Review for {movie.title} ({movie.original_title})
              </h2>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= rating ? styles.starActive : ""}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea
              className={styles.textarea}
              value={reviewText}
              rows={6}
              placeholder="How was it?"
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className={styles.buttonSection}>
              <button className={`${styles.button}`} onClick={handleSubmitReview}>
                Save
              </button>
              <button className={`${styles.button} ${styles.closeButton}`} onClick={() => setWritingReview(false)}>
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
