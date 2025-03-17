import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Dusty</h1>
      <p>Please log in or register to continue.</p>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
      <div>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div>
          <GoogleLoginButton />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default HomePage;
