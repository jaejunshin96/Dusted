import React, { useEffect, useState } from "react";
import { Container, Row, Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import authAxios from "../utils/authentications/authFetch";
import ReviewDetailModal from "../components/ReviewDetailModal";
import styles from "./ReviewCollectionPage.module.css"

export interface Review {
  id: number;
  movie_id: number;
  title: string;
  review: string;
  rating: number;
  image_path: string | null;
  created_at: string;
}

const ReviewCollectionPage: React.FC = () => {

  const [reviews, setReviews] = useState<Review[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [sorting, setSorting] = useState("-created_at");
  const username = localStorage.getItem("username") || "User";
  let debounceTimeout: NodeJS.Timeout;

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleCloseModal = () => setSelectedReview(null);

  const fetchReviews = async (pageNumber: number, query: string = "", fetchMore: boolean = false) => {
    setLoading(true);
    setHasMore(false);
    try {
      const response = await authAxios("http://localhost:8000/api/review/reviews/", {
        method: "GET",
        params: {
          page: fetchMore ? pageNumber : 1,
          query,
          sorting
        },
      });

      const fetchedReviews = response.data.results || [];

      fetchMore ?
        setReviews(prevReviews => [...prevReviews, ...fetchedReviews]) :
        setReviews(fetchedReviews);

      setHasMore(fetchedReviews.length >= 12);

    } catch (err: any) {
      setErrorMessage(err.response?.data?.Error || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page, currentQuery);
  }, [currentQuery, sorting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setPage(1);
      setCurrentQuery(value);
    }, 300);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, currentQuery, true);
  };

  const handleEditSave = async () => {
    await fetchReviews(page, currentQuery);
    setSelectedReview(null);
  };

  return (
    <Container fluid className={styles.container}>
      <h1 className={styles.h1}>Reviews by {username}</h1>

      <div className={styles.searchSection}>
        <input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for reviews..."
          className={styles.searchInput}
        />

        <div className={styles.toggleSwitch}>
          <label style={{ marginRight: "10px", marginLeft: "20px" }}>Sort by Rating</label>
          <input
            type="checkbox"
            checked={sorting === "-rating"}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setPage(1);
              setSorting(isChecked ? "-rating" : "-created_at");
            }}
          />
        </div>
      </div>

      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

      <div className={styles.bodyContainer}>
        <Row className={styles.rowContainer}>
          {reviews.length === 0 && (
            <div className={styles.noReviews}>
              No reviews found.
            </div>
          )}

          {reviews.map((review) => (
            <Card
              key={review.id}
              onClick={() => setSelectedReview(review)}
              className={styles.card}
              style={{
                backgroundImage: review.image_path ? `url(${review.image_path})` : "none",
                backgroundColor: review.image_path ? "transparent" : "#2a2a2a",
              }}
            >
              <CardBody>
                <CardText>
                  <div className={styles.ratingBackground}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={styles.ratingStars}
                        style={{ color: star <= review.rating ? "#FFD700" : "#ccc" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <br />
                </CardText>
                <CardTitle tag="h5" className={styles.cardTitle}>
                  {review.title}
                </CardTitle>
              </CardBody>
            </Card>
          ))}
        </Row>

        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreButton} onClick={handleLoadMore}>
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={handleCloseModal}
          onSave={handleEditSave}
        />
      )}
    </Container>
  );
};

export default ReviewCollectionPage;
