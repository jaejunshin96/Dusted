import React, { useEffect, useState } from "react";
import ReviewModal from "../components/movie/ReviewModal";
import styles from "./ReviewCollectionPage.module.css"
import { useTranslation } from "react-i18next";
import { FaArrowDownLong } from "react-icons/fa6";
import { Review } from "../types/types";
import { getReviews } from "../services/review";
import EmptyContainer from "../components/movie/EmptyContainer";
import ReviewGrid from "../components/movie/ReviewGrid";

const ReviewCollectionPage: React.FC = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState("created_at");
  const [order, setOrder] = useState("dsc");
  const [inputValue, setInputValue] = useState("");
  let debounceTimeout: NodeJS.Timeout;

  useEffect(() => {
    setPage(1);
    fetchReviews();
  }, [query, sorting, order]);

  useEffect(() => {
    if (page > 1) {
      fetchReviews();
    }
  }, [page]);

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
    seterror("");

    try {
      const reviewData = await getReviews(page, query, sorting, order);

      const fetchedReviews = reviewData.results || [];

      if (page === 1) {
        setReviews(fetchedReviews);
      } else {
        setReviews(prev => [...prev, ...fetchedReviews]);
      }

      const PAGE_SIZE = 18;
      setHasMore(fetchedReviews.length === PAGE_SIZE);
    } catch (err: any) {
      seterror(err.response?.data?.Error || t("Failed to fetch reviews."));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

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
      <div className={styles.searchSection}>
        <input
          type="search"
          value={inputValue}
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

      {error && <p className={styles.error}>{error}</p>}

      {!error && !loading && reviews.length === 0 && (
        <EmptyContainer
          icon="🎬"
          title={t("No reviews found")}
          text={t("Try searching with different keywords or check back later.")}
        />
      )}

      <ReviewGrid
        reviews={reviews}
        loading={loading}
        hasMore={hasMore}
        onReviewClick={handleReviewClick}
        onLoadMore={handleLoadMore}
      />

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
