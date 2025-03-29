import React, { useEffect, useState } from "react";
import { Container, Row, Card, CardBody, CardTitle, CardText } from "reactstrap";
import authAxios from "../utils/authentications/authFetch";
import ReviewDetailModal from "../components/ReviewDetailModal";
import styles from "./ReviewCollectionPage.module.css"
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [sorting, setSorting] = useState("");
  const username = localStorage.getItem("username");
  let debounceTimeout: NodeJS.Timeout;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleCloseModal = () => setSelectedReview(null);

  const fetchReviews = async (pageNumber: number, query: string = "", fetchMore: boolean = false) => {
    setLoading(true);
    setHasMore(false);
    try {
      const response = await authAxios(`${backendUrl}/api/review/reviews/`, {
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
      setErrorMessage(err.response?.data?.Error || t("Failed to fetch reviews."));
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

  const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setSorting(e.target.value);
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
      <h1 className={styles.h1}>{t("ReviewsByUser", { username })}</h1>

      <div className={styles.searchSection}>
        <input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={t("Search for reviews...")}
          className={styles.searchInput}
        />

        <select className={styles.sortDropdown} value={sorting} onChange={handleSortingChange}>
          <option value="">{t("by Created")}</option>
          {/*<option value="-rating">by Rating</option>*/}
          <option value="5">{t("5 Stars")}</option>
          <option value="4">{t("4 Stars")}</option>
          <option value="3">{t("3 Stars")}</option>
          <option value="2">{t("2 Stars")}</option>
          <option value="1">{t("1 Stars")}</option>
        </select>
      </div>

      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

      <div className={styles.bodyContainer}>
        <Row className={styles.rowContainer}>
          {reviews.length === 0 && (
            <div className={styles.noReviews}>
              {t("No reviews found.")}
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
              {loading ? t("Loading...") : t("Load More")}
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
