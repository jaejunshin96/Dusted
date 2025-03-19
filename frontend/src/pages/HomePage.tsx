import LogoutButton from "../components/LogoutButton";
import MovieSearch from "../components/MovieSearch";

const HomePage: React.FC = () => {
  const username = localStorage.getItem("username");

  return (
    <div>
      <h1>Welcome to Dusted</h1>
      <p>
        You are logged in as <strong>{username}</strong>.
      </p>
      <MovieSearch />
      <div>
        <LogoutButton />
      </div>
    </div>
  )
};

export default HomePage;
