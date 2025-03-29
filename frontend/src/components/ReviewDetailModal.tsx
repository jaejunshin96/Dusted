import React, { useState, useEffect } from "react";
import { Review } from "../pages/ReviewCollectionPage";
import authAxios from "../utils/authentications/authFetch";
import { useTranslation } from "react-i18next";
import styles from "./ReviewDetailModal.module.css";

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onSave: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onSave }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.review);
  const [rating, setRating] = useState(review.rating);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = async () => {
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
    } catch (error) {
      alert(t("Failed to save the review. Please try again."));
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
        className={`${styles.modalContainer} ${styles.modalBackgroundImage}`}
        style={{
          backgroundImage: review.image_path
            ? `url(https://image.tmdb.org/t/p/original${review.image_path})`
            : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isEditing ? (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>{review.title}</h2>

              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= review.rating ? styles.starActive : styles.star}
                    style={{ fontSize: "24px" }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.reviewContainer}>
              <p className={`${styles.textBlock} ${styles.reviewBlock}`}>
                "{review.review}"
              </p>
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button}`} onClick={() => setIsEditing(true)}>{t("Edit")}</button>
              {/*<button className={`${styles.button} ${styles.closeButton}`} onClick={onClose}>Close</button>*/}
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
                    className={star <= rating ? styles.starActive : styles.star}
                    style={{ fontSize: "24px", cursor: "pointer" }}
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
              <button className={`${styles.button}`} onClick={handleSave}>{t("Save")}</button>
              <button className={`${styles.button} ${styles.closeButton}`} onClick={() => setIsEditing(false)}>{t("Cancel")}</button>
              <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleDelete}>{t("Delete")}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailModal;
