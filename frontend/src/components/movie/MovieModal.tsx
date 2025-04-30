import React, { useState, useEffect } from "react";
import { Movie } from "../../types/types";
import { useTranslation } from "react-i18next";
import styles from "./MovieModal.module.css";
import clapperboard from "../../assets/clapperboard.png"
import YouTube from 'react-youtube';
import { FaYoutube } from "react-icons/fa";
import { getMovieTrailer } from "../../services/movie";
import { getReviewStatus, postReview } from "../../services/review";
import { toast } from "react-toastify";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { t, i18n } = useTranslation();
  const [writingReview, setWritingReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isReviewed, setIsReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showTrailer) {
          // First, close trailer if it's open
          setShowTrailer(false);
        } else if (writingReview) {
          // Then, exit review writing mode if active
          setWritingReview(false);
        } else if (showDetails) {
          // Then, exit details view if showing
          setShowDetails(false);
        } else {
          // Finally, close the entire modal
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, showTrailer, writingReview, showDetails]);

  useEffect(() => {
    const fetchReviewStatus = async () => {
      try {
        const statusData = await getReviewStatus(movie.movie_id);

        if (statusData && statusData.reviewed) {
          setIsReviewed(true);
        }
      } catch (error) {
        console.error("Failed to fetch review status:", error);
      }
    };

    fetchReviewStatus();
  }, [movie.movie_id]);

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  useEffect(() => {
    if (!movie.backdrop_path) {
      setLoading(true);
      return;
    }

    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    img.onload = () => setLoading(true);
  }, [movie.backdrop_path]);

  useEffect(() => {
    setError(null);
    setTextCount(reviewText.length);
  }, [reviewText, rating]);

  //to fetch trailer data
  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie.id) return;

      try {
        const trailerData = await getMovieTrailer(movie.movie_id, i18n.language);

        if (trailerData && trailerData.key) {
          setTrailerKey(trailerData.key);
        }
      } catch (error) {
        console.error("Failed to fetch trailer:", error);
      }
    };

    fetchTrailer();
  }, [movie.movie_id, i18n.language]);

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

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setError(t("Please select a rating before submitting your review."));
      return;
    }

    try {
      await postReview(movie, reviewText, rating);

      setWritingReview(false);
      setReviewText("");
      setRating(0);
      setIsReviewed(true);
      toast.success(t("Review submitted successfully!"));
    } catch (err: any) {
      if (err.response?.data?.review) {
        setError(t("Review over 400"));
      } else {
        setError(t("Failed to save the review. Please try again."));
      }
    }
  };

  const handleImageClick = () => {
    setShowDetails(true);
  };

  // Add helper function for back button behavior
  const handleBackButton = () => {
    if (showTrailer) {
      setShowTrailer(false);
    } else if (writingReview) {
      setWritingReview(false);
    } else if (showDetails) {
      setShowDetails(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={showTrailer ? undefined : onClose}>
      <div
        className={`${styles.modalContainer} ${styles.modalBackgroundImage} ${showDetails ? styles.blurred : ''}`}
        style={{
          backgroundImage: `url(${getImageUrl(isMobile ? movie.poster_path : (movie.backdrop_path || movie.poster_path))})`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Add global navigation buttons */}
        <div className={styles.navigationButtons}>
          {(showDetails || writingReview || showTrailer) && (
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

        {/* Rest of the existing UI */}
        {!loading ? (<div className={styles.spinner}></div>) : (
          <>
            {!showDetails ? (
              <div
                className={styles.clickableBackdrop}
                onClick={handleImageClick}
              >
                <div className={styles.tapToViewOverlay}>
                  <span>{t("Tap to view details")}</span>
                </div>
              </div>
            ) : !writingReview ? (
              <>
                <div className={styles.detailsContainer}>
                  <h2 className={styles.textBlock}>
                    {movie.title}
                  </h2>
                  <p className={styles.textBlock}>
                    <span style={{ opacity: 0.7 }}>{t("Director")}: </span>
                    <strong>
                      {Array.isArray(movie.directors)
                        ? movie.directors.join(", ")
                        : movie.directors || "Not found"}
                    </strong>
                  </p>
                  <p className={styles.textBlock}>
                    <span style={{ opacity: 0.7 }}>{t("Release Date")}: </span>
                    <strong>{movie.release_date || "Not found."}</strong>
                  </p>
                  <div className={styles.textBlock}>
                    <span style={{ opacity: 0.7 }}>{t("Overview")}: </span>
                    <div style={{ marginTop: "8px" }}>
                      <strong>{movie.overview}</strong>
                    </div>
                  </div>

                  {trailerKey && (
                    <button
                      className={`${styles.trailerButton}`}
                      onClick={() => setShowTrailer(true)}
                    >
                      {t("Watch Trailer")} <FaYoutube className={styles.trailerIcon} />
                    </button>
                  )}
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
                    {movie.original_title !== movie.title ? ` (${movie.original_title})` : ""}
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
                  <button className={`${styles.button} ${styles.closeButton}`} onClick={() => setWritingReview(false)}>
                    {t("Cancel")}
                  </button>
                  <button className={`${styles.button}`} onClick={handleSubmitReview}>
                    {t("Submit")}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>


      {showTrailer && trailerKey && (
        <div className={styles.trailerOverlay}>
          <div className={styles.trailerContainer} onClick={(e) => e.stopPropagation()}>
            <button
              className={`${styles.navButton} ${styles.closeTrailerButton}`}
              onClick={() => setShowTrailer(false)}
            >
              ×
            </button>
            <YouTube
              videoId={trailerKey}
              className={styles.youtubePlayer}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieModal;
