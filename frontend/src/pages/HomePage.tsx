import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import MovieSearch from "../components/MovieSearch";

const HomePage: React.FC = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dusted</h1>
      <p>
        Welcome, <strong>{username}</strong>
      </p>
      <div style={{
        width: "600px",
        maxWidth: "600px",     // Prevents the content from expanding too wide
        height: "40vh",
        margin: "auto",         // Centers the search box and list
      }}>
        <MovieSearch />
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/reviews")}
        >
          Reviews
        </button>

        <LogoutButton />
      </div>
    </div>
  )
};

export default HomePage;
