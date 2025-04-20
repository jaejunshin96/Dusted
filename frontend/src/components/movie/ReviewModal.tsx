import React, { useState, useEffect } from "react";
import { Review } from "../../pages/ReviewCollectionPage";
import authAxios from "../../utils/authentications/authFetch";
import { useTranslation } from "react-i18next";
import styles from "./ReviewModal.module.css";
import clapperboard from "../../assets/clapperboard.png"

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onSave: () => void;
}

const ReviewModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onSave }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.review);
  const [textCount, setTextCount] = useState(review.review.length);
  const [rating, setRating] = useState(review.rating);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
    if (!review.backdrop_path && !review.poster_path) {
      setIsImageLoaded(true);
      return;
    }

    const img = new Image();
    img.src = getImageUrl(review.backdrop_path || review.poster_path);
    img.onload = () => setIsImageLoaded(true);
  }, [review.backdrop_path, review.poster_path]);

  useEffect(() => {
    setError(null);
    setTextCount(reviewText.length);
  }, [reviewText]);

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  const handleSave = async () => {
    if (textCount > 400) {
      setError(t("Review cannot exceed 400 characters."));
      return;
    }

    try {
      await authAxios(`${backendUrl}/api/review/reviews/`, {
        method: "PATCH",
        data: {
          id: review.id,
          review: reviewText,
          rating: rating,
        }
      });
      onSave();
      setIsEditing(false);
    } catch (err: any) {
      if (err.response?.data?.review) {
        setError(t("Review over 400"));
      } else {
        setError(t("Failed to save the review. Please try again."));
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("Are you sure you want to delete this review?"))) {
      try {
        await authAxios(`${backendUrl}/api/review/reviews/`, {
          method: "DELETE",
          data: { id: review.id }
        });

        onSave();
        onClose();
      } catch (error) {
        alert(t("Failed to delete the review. Please try again."));
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modalContainer} ${styles.modalBackgroundImage} ${!isEditing ? '' : styles.blurred}`}
        style={{
          backgroundImage: `url(${getImageUrl(review.backdrop_path || review.poster_path)})`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isImageLoaded ? (<div className={styles.spinner}></div>) :
        !isEditing ? (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>{review.title}</h2>

              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= review.rating ? styles.starActive : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {review.review && (
                <div className={styles.reviewBlock}>
                  {review.review.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button}`} onClick={() => setIsEditing(true)}>
                {t("Edit")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>{review.title}</h2>

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

              <div style={{
                textAlign: "right",
                width: "100%",
                color: textCount > 400 ? "#ff6b6b" : "rgba(255,255,255,0.6)",
                fontSize: "14px",
                marginTop: "5px"
              }}>
                {textCount} / 400
              </div>

              <div className={styles.errorContainer}>
                {error && <p className={styles.error}>{error}</p>}
              </div>
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleDelete}>
                {t("Delete")}
              </button>
              <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave}>
                {t("Save")}
              </button>
              <button className={`${styles.button}`} onClick={() => setIsEditing(false)}>
                {t("Cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
