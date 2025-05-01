import React, { useCallback, useRef } from "react";
import { Review } from "../../types/types";
import styles from "./ReviewGrid.module.css";
import clapperboard from "../../assets/clapperboard.png";

interface ReviewGridProps {
  reviews: Review[];
  loading: boolean;
  hasMore: boolean;
  onReviewClick: (review: Review) => void;
  onLoadMore: () => void;
}

const ReviewGrid: React.FC<ReviewGridProps> = ({
  reviews,
  loading,
  hasMore,
  onReviewClick,
  onLoadMore,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const getImageUrl = (path: string | null) => {
    if (!path) return clapperboard;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  // Set up intersection observer for infinite scroll
  const lastReviewElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  return (
    <>
      <div className={styles.grid}>
        {reviews.map((review, index) => {
          const isLastElement = index === reviews.length - 1;

          return (
            <div
              key={`${review.id}-${index}`}
              ref={isLastElement ? lastReviewElementRef : null}
              className={styles.card}
              onClick={() => onReviewClick(review)}
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

      {loading && <div className={styles.spinner}></div>}
    </>
  );
};

export default ReviewGrid;
