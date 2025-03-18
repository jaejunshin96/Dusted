import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string>("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      fetch(`http://127.0.0.1:8000/api/verify-email/?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.email || "Verification failed");
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
