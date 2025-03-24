import React, { useEffect, useState } from "react";
import { Container, Row, Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authentications/authFetch";

interface Review {
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
  const navigate = useNavigate();
  let debounceTimeout: NodeJS.Timeout;

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

  return (
    <Container fluid>
      <div style={{ position: "relative", marginBottom: "20px", minWidth: "" }}>
        <Button
          style={{
            position: "absolute",
            left: "0",
            transform: "translateY(-50%)",
            padding: "6px 12px",
            cursor: "pointer",
            border: "none",
            //backgroundColor: "#4CAF50",
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <h1 className="text-center mt-2">Reviews by {username}</h1>
      </div>

      <div className="text-center mb-5 d-flex justify-content-center align-items-center" style={{ marginBottom: "20px" }}>
        <input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for reviews..."
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />

        {/* Toggle Switch for Sorting */}
        <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
          <label style={{ marginRight: "10px" }}>Sort by Rating</label>
          <input
            type="checkbox"
            checked={sorting === "-rating"}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setPage(1); // Reset to first page
              setSorting(isChecked ? "-rating" : "-created_at");
            }}
          />
        </div>
      </div>

      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

      <Row
        className="mt-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {reviews.length === 0 && (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "#888",
            paddingTop: "20px",
            //width: "50vw",
          }}>
            No reviews found.
          </div>
        )}

        {reviews.map((review) => (
          <Card
            key={review.id}
            onClick={() => navigate(`/movie/${review.movie_id}`)}
            style={{
              backgroundImage: review.image_path
                ? `url(${review.image_path})`
                : "none",
              backgroundColor: review.image_path ? "transparent" : "#2a2a2a",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              color: "white",
              height: "250px",
              overflow: "hidden",
              borderRadius: "8px",
              maxWidth: "200px",
            }}
          >
            <CardBody>
              <CardTitle tag="h5">{review.title}</CardTitle>
              <CardText>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: star <= review.rating ? "#FFD700" : "#ccc",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <br />
                {review.review.substring(0, 50)}...
              </CardText>
              <CardText>
                <small className="text-muted">Posted on: {new Date(review.created_at).toLocaleDateString()}</small>
              </CardText>
            </CardBody>
          </Card>
        ))}
      </Row>

      <div className="text-center mt-4" style={{ paddingTop: "20px" }}>
        <Button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="me-2"
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            color={page === index + 1 ? "primary" : "secondary"}
            className="me-1"
            style={page === index + 1 ? { fontWeight: "bold", border: "2px solid #007bff" } : {}}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="ms-2"
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default ReviewCollectionPage;
