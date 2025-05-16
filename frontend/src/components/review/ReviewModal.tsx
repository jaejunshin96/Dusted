import React, { useState, useEffect } from "react";
import { Review } from "../../types/types";
import { useTranslation } from "react-i18next";
import styles from "./ReviewModal.module.css";
import clapperboard from "../../assets/clapperboard.png"
import { patchReview, deleteReview } from "../../services/review";
import { toast } from "react-toastify";
import { Folder } from "../../types/types";
import FolderList from "../folder/FolderList";
import { getFolders, postFolder } from "../../services/folder";
import { getGenreName } from "../../constants/genreMap";
import { BiLoaderAlt } from "react-icons/bi";

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onSave: (updatedReview: Review) => void;
  onDelete: (deletedReview: Review) => void;
}

const ReviewModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onSave, onDelete }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [reviewText, setReviewText] = useState(review.review);
  const [editedReview, setEditedReview] = useState(review.review);
  const [textCount, setTextCount] = useState(review.review.length);
  const [error, setError] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    img.src = `https://image.tmdb.org/t/p/w1280${review.backdrop_path || review.poster_path}`;
    img.onload = () => setIsImageLoaded(true);
  }, [review.backdrop_path, review.poster_path]);

  useEffect(() => {
    setError(null);
    setTextCount(editedReview.length);
  }, [editedReview]);

  // Add useEffect to detect mobile screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 430);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Add this useEffect to fetch folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const folderData = await getFolders();
        setFolders(folderData);
        if (review.folder_id) {
          setSelectedFolder(review.folder_id);
        }
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      }
    };

    fetchFolders();
  }, []);

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/w1280${path}`;
  };

  const getGenreNames = (genreIds: string | number[]): string => {
    if (!genreIds) return "Not found";

    const ids = Array.isArray(genreIds)
      ? genreIds
      : genreIds.split(',').map(id => parseInt(id.trim(), 10));

    return ids
      .map(id => getGenreName(id, t))
      .join(", ");
  };

  const handleCreateFolder = async (folderName: string) => {
    if (!folderName) {
      setError(t("Folder name cannot be empty."));
      return;
    }
    try {
      const newFolder = await postFolder(folderName);
      setFolders((prevFolders) => [...prevFolders, newFolder]);
    } catch (error) {
      setError(t("Failed to create folder. Please try again."));
    }
  };

  const handleSave = async () => {
    if (textCount > 400) {
      setError(t("Review cannot exceed 400 characters."));
      return;
    }

    setIsSaving(true);
    try {
      await patchReview(review.id, editedReview, editedRating, selectedFolder ?? null);
      const updatedReview = {...review, review: editedReview, rating: editedRating, folder_id: selectedFolder};
      onSave(updatedReview);

      setRating(editedRating);
      setReviewText(editedReview);
      setIsEditing(false);

      toast.success(t("Review updated successfully!"));
    } catch (err: any) {
      if (err.response?.data?.review) {
        setError(t("Review over 400"));
      } else {
        setError(t("Failed to save the review. Please try again."));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("Are you sure you want to delete this review?"))) {
      setIsDeleting(true);
      try {
        await deleteReview(review.id);
        const deletedReview = {...review};
        onDelete(deletedReview);

        toast.success(t("Review deleted successfully!"));
      } catch (error) {
        alert(t("Failed to delete the review. Please try again."));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBackButton = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modalContainer} ${styles.modalBackgroundImage} ${styles.blurred}`}
        style={{
          backgroundImage: `url(${getImageUrl(isMobile ? review.poster_path : (review.backdrop_path || review.poster_path))})`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.navigationButtons}>
          {(isEditing) && (
            <button
              className={`${styles.navButton} ${styles.backButton}`}
              onClick={handleBackButton}
            >
              ←
            </button>
          )}
          <button
            className={`${styles.navButton} ${styles.closeButton}`}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {!isImageLoaded ? (<div className={styles.spinner}></div>) :
        !isEditing ? (
          <>
            <div className={styles.detailsContainer}>
              <h2 className={styles.textBlock}>{review.title}</h2>

              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= rating ? styles.starActive : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className={styles.textBlock}>
                <span style={{ opacity: 0.7 }}>{t("Director")}: </span>
                <strong>
                  {Array.isArray(review.directors)
                    ? review.directors.join(", ")
                    : review.directors || "Not found"}
                </strong>
              </p>

              <p className={styles.textBlock}>
                <span style={{ opacity: 0.7 }}>{t("Cast")}: </span>
                <strong>
                  {Array.isArray(review.cast)
                    ? review.cast.join(", ")
                    : review.cast || "Not found"}
                </strong>
              </p>

              <p className={styles.textBlock}>
                <span style={{ opacity: 0.7 }}>{t("Genre")}: </span>
                <strong>
                  {getGenreNames(review.genre_ids)}
                </strong>
              </p>

              {review.review && (
                <div className={styles.reviewTextBlock}>
                  {reviewText.split("\n").map((line, index) => (
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
            <div className={styles.reviewContainer}>
              <h2 className={styles.textBlock}>{review.title}</h2>

              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= editedRating ? styles.starActive : ""}`}
                    onClick={() => setEditedRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className={styles.parentOfTextarea}>
                <textarea
                  className={styles.textarea}
                  value={editedReview}
                  rows={7}
                  placeholder={t("What do you think about this film?")}
                  onChange={(e) => setEditedReview(e.target.value)}
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

              <FolderList
                folders={folders}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                onCreateFolder={handleCreateFolder}
              />
            </div>

            <div className={styles.errorContainer}>
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <div className={styles.buttonSection}>
              <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <BiLoaderAlt size={20} className={styles.buttonSpinner} />
                ) : (
                  t("Delete")
                )}
              </button>
              <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <BiLoaderAlt size={20} className={styles.buttonSpinner} />
                ) : (
                  t("Save")
                )}
              </button>
              <button className={`${styles.button} ${styles.closeButton}`} onClick={() => setIsEditing(false)}>
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
