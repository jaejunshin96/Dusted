import React, { useState, useEffect } from "react";
import { Movie } from "./MovieSearch";
import authAxios from "../utils/authentications/authFetch";
import { useTranslation } from "react-i18next";
import styles from "./MovieModal.module.css";
import clapperboard from "../assets/clapperboard.png"

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { t } = useTranslation();
  const [writingReview, setWritingReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isReviewed, setIsReviewed] = useState(false);
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : "";

  const [isImageLoaded, setIsImageLoaded] = useState(false);

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

  useEffect(() => {
    const fetchReviewStatus = async () => {
      try {
        const response = await authAxios(`${backendUrl}/api/review/reviews/status/`, {
          method: "GET",
          params: { movie_id: movie.id }
        });

        if (response.status === 200 && response.data.reviewed) {
          setIsReviewed(true);
        }
      } catch (error) {
        console.error("Failed to fetch review status:", error);
      }
    };

    fetchReviewStatus();
  }, [movie.id]);

  useEffect(() => {
    if (!movie.backdrop_path) {
      setIsImageLoaded(true);
      return;
    }

    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    img.onload = () => setIsImageLoaded(true);
  }, [movie.backdrop_path]);

  useEffect(() => {
    setError(null);
    setTextCount(reviewText.length);
  }, [reviewText]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setError(t("Please select a rating before submitting your review."));
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
          image_path: movie.backdrop_path ?
            `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
        }
      });

      if (response.status === 201) {
        alert(t("Review submitted successfully!"));
        setWritingReview(false);
        setReviewText("");
        setRating(0);
      }
    } catch (err: any) {
      if (err.response?.data?.review) {
        setError(t("Review over 400"));
      } else {
        setError(t("Failed to save the review. Please try again."));
      }
    }
  };

  //if (!isImageLoaded) {
  //  return (
  //    <div className={styles.overlay}>
  //      <div className={styles.modalContainer}>
  //        <div className={styles.spinner}></div>
  //      </div>
  //    </div>
  //  );
  //}

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modalContainer} ${styles.modalBackgroundImage}`}
        style={{
          backgroundImage:
            `url(${movie.backdrop_path && isImageLoaded
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : clapperboard})`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isImageLoaded ? (<div className={styles.spinner}></div>) :
        !writingReview ? (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>
                {movie.title}
              </h2>
              <p className={styles.textBlock}>
                {t("Director")}:{" "}
                <strong>
                  {Array.isArray(movie.directors)
                    ? movie.directors.join(", ")
                    : movie.directors || "Not found"}
                </strong>
              </p>
              <p className={styles.textBlock}>{t("Release Date")}: <strong>{movie.release_date || "Not found."}</strong></p>
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
              <button
                className={`${styles.button}`}
                onClick={() => setWritingReview(true)}
                disabled={isReviewed}
              >
                {isReviewed ? t("Reviewed") : t("Review")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>
                {t("Review for")} {movie.title}
                  {movie.original_title !== movie.title ? " (" + (movie.original_title) + ")" : ""}
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

              <div className={styles.parentOfTextarea}>
                <textarea
                  className={styles.textarea}
                  value={reviewText}
                  rows={6}
                  placeholder={t("What do you think about this film?")}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <div style={{ textAlign: "right", width: "90%", color: textCount > 400 ? "red" : "white"}}>
                {textCount} / 400
              </div>

              <div className={styles.errorContainer}>
                {error && <p className={styles.error}>{error}</p>}
              </div>
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
