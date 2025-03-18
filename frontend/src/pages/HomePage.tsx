import { Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import LogoutButton from "../components/LogoutButton";

const HomePage: React.FC = () => {
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/${username}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User Profile:", userData);
      } else {
        console.log("Failed to fetch user profile.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const username = localStorage.getItem("username");

  return (
    <div>
      <h1>Welcome to Dusted</h1>
      <p>
        You are logged in as <strong>{username}</strong>.
      </p>
      <div>
        <LogoutButton />
      </div>
    </div>
  )
};

export default HomePage;
