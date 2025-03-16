import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ActivationConfirmPage: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setIsValid(false);
      setTimeout(() => navigate("/"), 3000); // Redirect to home if no token
      return;
    }

    // Validate token with backend
    fetch(`http://127.0.0.1:8000/api/validate-activation-token/?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsValid(true);
          setTimeout(() => navigate("/login"), 3000); // Redirect to login after confirmation
        } else {
          setIsValid(false);
          setTimeout(() => navigate("/"), 3000); // Redirect home if invalid
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
