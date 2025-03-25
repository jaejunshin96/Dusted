import React, { useState } from "react";
import { Review } from "../pages/ReviewCollectionPage";
import authAxios from "../utils/authentications/authFetch";

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onSave: () => void; // To refresh the list after editing
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.review);
  const [rating, setRating] = useState(review.rating);

  const handleSave = async () => {
    try {
      await authAxios("http://localhost:8000/api/review/reviews/", {
        method: "PATCH",
        data: {
            id: review.id,
            review: reviewText,
            rating: rating,
        }
      });
      onSave();  // Refresh the list after saving
      setIsEditing(false);  // Close editing mode
    } catch (error) {
      console.error("Failed to save the review.", error);
      alert("Failed to save the review. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await authAxios(`http://localhost:8000/api/review/reviews/`, {
          method: "DELETE",
          data: {
            id: review.id
          },
        });

        onSave();  // Refresh the list after deleting
        onClose(); // Close the modal
      } catch (error) {
        console.error("Failed to delete the review.", error);
        alert("Failed to delete the review. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundImage: review.image_path
            ? `url(https://image.tmdb.org/t/p/original${review.image_path})`
            : "none",
          backgroundColor: review.image_path ? "transparent" : "#2a2a2a",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "900px",
          height: "500px",
          textAlign: "left",
          color: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.7)",
          position: "relative",
          animation: "slideUp 1.0s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isEditing ? (
          <>
            <h2
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              {review.title}
            </h2>
            <br></br>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
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
            <br></br>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30%", // Takes up the full height of the modal
                padding: "20px",
              }}
            >
              <p
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  display: "inline-block",
                  maxWidth: "60%",
                  textAlign: "center",
                }}
              >
                "{review.review}"
              </p>
            </div>
            <div
              style={{
                position: "absolute", // Make it stick to the bottom
                bottom: "20px",        // Distance from the bottom of the modal
                left: "0",
                right: "0",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  marginRight: "10px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                Edit
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              Edit Review for {review.title}
            </h2>
            <br></br>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px"
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: star <= rating ? "#FFD700" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={7}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                resize: "vertical",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            />
            <div
              style={{
                position: "absolute", // Make it stick to the bottom
                bottom: "20px",        // Distance from the bottom of the modal
                left: "0",
                right: "0",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <button
                onClick={handleSave}
                style={{
                  marginRight: "10px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Cancel
              </button>
              {/* add Delete button */}
              <button
                onClick={handleDelete}
                style={{
                  marginLeft: "10px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#FF4444",
                  color: "white",
                  border: "none",
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailModal;
