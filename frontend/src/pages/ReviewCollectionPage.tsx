import React, { useEffect, useState, useRef, useCallback } from "react";
import ReviewModal from "../components/movie/ReviewModal";
import styles from "./ReviewCollectionPage.module.css"
import { useTranslation } from "react-i18next";
import { FaArrowDownLong } from "react-icons/fa6";
import clapperboard from "../assets/clapperboard.png"
import { Review } from "../types/types";
import { getReviews } from "../services/review";

const ReviewCollectionPage: React.FC = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState("created_at");
  const [order, setOrder] = useState("dsc");
  let debounceTimeout: NodeJS.Timeout;
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchReviews();
    setPage(1);
  }, [query, sorting, order]);

  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedReview]);

  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedReview]);

  const fetchReviews = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const reviewData = await getReviews(page, query, sorting, order);

      const fetchedReviews = reviewData.results || [];

      if (page === 1) {
        setReviews(fetchedReviews);
      } else {
        setReviews(prev => [...prev, ...fetchedReviews]);
      }

      setHasMore(fetchedReviews.length > 0);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.Error || t("Failed to fetch reviews."));
    } finally {
      setLoading(false);
    }
  };

  // Set up intersection observer for potential infinite scroll (same as ExplorePage)
  const lastReviewElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setPage(1);
      setQuery(value);
    }, 300);
  };

  const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setSorting(e.target.value);
  };

  const handleOrder = async () => {
    setPage(1);
    setOrder(order === "dsc" ? "asc" : "dsc");
  }

  /* Modal button actions */
  const handleCloseModal = () => {
    setSelectedReview(null);
  }

  const handleEditSave = (updatedReview: Review) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
    //setSelectedReview(null);
  };

  const handleDelete = (deletedReview: Review) => {
    setReviews(prevReviews =>
      prevReviews.filter(review => review.id !== deletedReview.id)
    );
    setSelectedReview(null);
  };

  return (
    <div className={styles.container}>
      {/*<h1 className={styles.h1}>{t("ReviewsByUser", { username })}</h1>*/}

      <div className={styles.searchSection}>
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder={t("Search for reviews...")}
          className={styles.searchInput}
          aria-label="Search reviews"
        />

        <select
          className={styles.sortDropdown}
          value={sorting}
          onChange={handleSortingChange}
          aria-label="Sort reviews"
        >
          <option value="created_at">{t("by Created")}</option>
          <option value="rating">{t("by Rating")}</option>
          <option value="5">{t("5 Stars")}</option>
          <option value="4">{t("4 Stars")}</option>
          <option value="3">{t("3 Stars")}</option>
          <option value="2">{t("2 Stars")}</option>
          <option value="1">{t("1 Stars")}</option>
        </select>

        <div
          className={styles.sortIcon}
          onClick={handleOrder}
          role="button"
          aria-label={order === "dsc" ? "Sort ascending" : "Sort descending"}
        >
          <FaArrowDownLong
            size={20}
            className={order === "dsc" ? styles.rotateDown : styles.rotateUp}
          />
        </div>
      </div>

      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

      <div className={styles.grid}>
        {reviews.map((review, index) => {
          const isLastElement = index === reviews.length - 1;

          return (
            <div
              key={`${review.id}-${index}`}
              ref={isLastElement ? lastReviewElementRef : null}
              className={styles.card}
              onClick={() => handleReviewClick(review)}
            >
              <div
                className={styles.poster}
                style={{
                  backgroundImage: `url(${getImageUrl(review.poster_path || review.backdrop_path)})`
                }}
              >
                <div className={styles.ratingBadge}>
                  {review.rating.toFixed(1)}
                </div>
                <div className={styles.overlay}>
                  <h3>{review.title}</h3>
                  <p>{review.directors}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={handleCloseModal}
          onSave={handleEditSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReviewCollectionPage;
