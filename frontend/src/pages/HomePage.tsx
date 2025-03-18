import LogoutButton from "../components/LogoutButton";

const HomePage: React.FC = () => {
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
