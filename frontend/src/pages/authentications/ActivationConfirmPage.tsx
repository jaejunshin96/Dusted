import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ActivationConfirmPage: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setIsValid(false);
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    // Validate token with Axios
    axios
      .get(`http://127.0.0.1:8000/api/validate-activation-token/`, {
        params: { token }, // Pass token as query param
      })
      .then((response) => {
        if (response.data.success) {
          setIsValid(true);
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setIsValid(false);
          setTimeout(() => navigate("/"), 3000);
        }
      })
      .catch(() => {
        setIsValid(false);
        setTimeout(() => navigate("/"), 3000);
      });
  }, [location, navigate]);

  return (
    <div>
      {isValid === null && <p>Validating...</p>}
      {isValid === false && <p style={{ color: "red" }}>Invalid or expired activation link.</p>}
      {isValid === true && <p>Your email has been verified. Redirecting to login...</p>}
    </div>
  );
};

export default ActivationConfirmPage;
