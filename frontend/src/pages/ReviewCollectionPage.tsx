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
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [sorting, setSorting] = useState("-created_at");
  const username = localStorage.getItem("username") || "User";
  let debounceTimeout: NodeJS.Timeout;

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleCloseModal = () => setSelectedReview(null);

  const fetchReviews = async (pageNumber: number, query: string = "") => {
    setLoading(true);
    try {
      const response = await authAxios("http://localhost:8000/api/review/reviews/", {
        method: "GET",
        params: { page: pageNumber, query, sorting },
      });

      const fetchedReviews = response.data.results || [];
      setReviews(fetchedReviews);

      const totalReviews = response.data.count;
      setTotalPages(Math.ceil(totalReviews / 12));
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setErrorMessage("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page, currentQuery);
  }, [page, currentQuery, sorting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setPage(1); // Reset to the first page for new search
      setCurrentQuery(value);
    }, 300); // Adjust the delay as needed (300ms is a good starting point)
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  const handleEditSave = async () => {
    await fetchReviews(page, currentQuery);
    setSelectedReview(null);
  };

  return (
    <Container fluid style={{ marginTop: "30px" }}>
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

      <div className={styles.pageButtons}>
        <Button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="me-2"
          style={{
            marginRight: "10px"
          }}
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            color={page === index + 1 ? "primary" : "secondary"}
            className="me-1"
            style={page === index + 1 ? { fontWeight: "bold" } : {}}
          >
            {index + 1}
          </Button>
        ))}

        <Button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)} className="ms-2"
          style={{
            marginLeft: "10px"
          }}
        >
          Next
        </Button>

        {selectedReview && (
          <ReviewDetailModal
            review={selectedReview}
            onClose={handleCloseModal}
            onSave={handleEditSave}
          />
        )}
      </div>
    </Container>
  );
};

export default ReviewCollectionPage;
