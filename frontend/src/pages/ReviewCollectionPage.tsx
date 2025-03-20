import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Url } from "url";

interface Review {
  id: number;
  movie_id: number;
  title: string;
  review: string;
  rating: number;
  image_path: Url | null;
  created_at: string;
}

const ReviewCollectionPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/review/reviews/", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setReviews(response.data.results); // Assuming paginated results
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setErrorMessage("Failed to load reviews. Please try again.");
      }
    };

    fetchReviews();
  }, []);

  return (
    <Container fluid>
      <h1 className="text-center mt-4">Reviews by {username}</h1>

      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

      <Row className="mt-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {reviews.slice(0, 9).map((review) => ( // Limiting to 9 items to form a perfect 3x3 grid
          <Card
            key={review.id}
            onClick={() => navigate(`/movie/${review.movie_id}`)}
            style={{
              backgroundImage: review.image_path
                ? `url(https://image.tmdb.org/t/p/original${review.image_path})`
                : "none",
              backgroundColor: review.image_path ? "transparent" : "#2a2a2a",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              color: "white",
              height: "250px",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <CardBody>
              <CardTitle tag="h5">{review.title}</CardTitle>
              <CardText>
                Rating: {review.rating} / 5
                <br />
                {review.review.substring(0, 100)}...
              </CardText>
              <CardText>
                <small className="text-muted">Posted on: {new Date(review.created_at).toLocaleDateString()}</small>
              </CardText>
            </CardBody>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default ReviewCollectionPage;
