import React, { useEffect, useState } from "react";
import ReviewModal from "../components/review/ReviewModal";
import styles from "./ReviewCollectionPage.module.css"
import { useTranslation } from "react-i18next";
import { Review } from "../types/types";
import { getReviews } from "../services/review";
import EmptyContainer from "../components/movie/EmptyContainer";
import ReviewGrid from "../components/review/ReviewGrid";
import FolderSlide from "../components/folder/FolderSlide";
import { deleteFolder } from "../services/folder";
import ReviewSearch from "../components/review/ReviewSearch";

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
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  let debounceTimeout: NodeJS.Timeout;

  useEffect(() => {
    setPage(1);
    fetchReviews();
    setReviews([]);
  }, [query, sorting, order, selectedFolderId]);

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
      const reviewData = await getReviews(page, query, sorting, order, selectedFolderId);

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

  const handleSortingChange = (newSorting: string) => {
    setPage(1);
    setSorting(newSorting);
  };

  const handleOrder = async () => {
    setPage(1);
    setOrder(order === "dsc" ? "asc" : "dsc");
  }

  const handleFolderSelect = (folderId: number | null) => {
    setSelectedFolderId(folderId);
    setPage(1);
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolderId) return;

    if (window.confirm(t("Are you sure you want to delete this folder?"))) {
      try {
        await deleteFolder(selectedFolderId);
        setSelectedFolderId(null);
        setPage(1);
        fetchReviews();
      } catch (err) {
        seterror(t("Failed to delete folder"));
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  }

  const handleEditSave = (updatedReview: Review) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const handleDelete = () => {
    if (!selectedReview) return;
    setReviews(prevReviews =>
      prevReviews.filter(review => review.id !== selectedReview.id)
    );
    setSelectedReview(null);
  };

  return (
    <div className={styles.container}>
      <FolderSlide
        onFolderSelect={handleFolderSelect}
        selectedFolderId={selectedFolderId}
        onOptionClicked={handleDeleteFolder}
      />

      <ReviewSearch
        inputValue={inputValue}
        onInputChange={handleInputChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        order={order}
        onOrderChange={handleOrder}
      />

      {error && <p className={styles.error}>{error}</p>}

      {!error && !loading && reviews.length === 0 && (
        <EmptyContainer
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
