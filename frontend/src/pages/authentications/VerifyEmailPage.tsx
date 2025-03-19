import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string>("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (token) {
      axios
        .get(`http://127.0.0.1:8000/api/verify-email/`, {
          params: { token }, // Pass token as a query parameter
        })
        .then((response) => {
          setMessage(response.data.email || "Verification failed");
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch(() => setMessage("Error verifying email"));
    } else {
      setMessage("Invalid verification link");
    }
  }, [location, navigate]);

  return <div>{message}</div>;
};

export default VerifyEmailPage;
