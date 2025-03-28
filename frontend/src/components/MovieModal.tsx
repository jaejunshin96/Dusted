import React, { useState, useEffect } from "react";
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

  const [showFullOverview, setShowFullOverview] = useState(false);

  const truncatedOverview = movie.overview.length > 200
    ? movie.overview.slice(0, 200) + "..."
    : movie.overview;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
                {movie.title}
              </h2>
              <p className={styles.textBlock}><strong>{t("Director")}:</strong> {movie.directors || "Not found"}</p>
              <p className={styles.textBlock}><strong>{t("Release Date")}:</strong> {movie.release_date || "Not found."}</p>
              <div className={`${styles.textBlock} ${showFullOverview ? styles.scrollableOverview : ""}`}>
                {showFullOverview ? movie.overview : truncatedOverview}
                {movie.overview.length > 200 && (
                  <text
                    className={styles.readMoreButton}
                    onClick={() => setShowFullOverview(!showFullOverview)}
                  >
                    {showFullOverview ? t("Show Less") : t("Read More")}
                  </text>
                )}
              </div>
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button}`} onClick={() => setWritingReview(true)}>
                {t("Review")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>
                {t("Review for")} {movie.title} ({movie.original_title})
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

            <div className={styles.parentOfTextarea}>
              <textarea
                className={styles.textarea}
                value={reviewText}
                rows={6}
                placeholder={t("What do you think about this film?")}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button}`} onClick={handleSubmitReview}>
                {t("Save")}
              </button>
              <button className={`${styles.button} ${styles.closeButton}`} onClick={() => setWritingReview(false)}>
                {t("Back")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
