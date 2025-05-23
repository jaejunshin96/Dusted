import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./utils/authentications/useAuth";
import LoginPage from "./pages/authentications/LoginPage";
import RegisterPage from "./pages/authentications/RegisterPage";
import ActivationConfirmPage from "./pages/authentications/ActivationConfirmPage";
import PasswordResetPage from "./pages/authentications/PasswordResetPage";
import NewPasswordPage from "./pages/authentications/NewPasswordPage";
import ExplorePage from "./pages/ExplorePage";
import SearchPage from "./pages/SearchPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/404/NotFoundPage";
import ProtectedRoute from "./utils/authentications/ProtectedRoute";
import ReviewCollectionPage from "./pages/ReviewCollectionPage";
import PublicLayout from "./components/footer/PublicLayout";
import MenuLayout from "./components/menuLayout/MenuLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify.css';
import "./App.css";
import GoogleAuthCallback from './components/auth/GoogleAuthCallback';
import Terms from "./pages/terms/Terms";
import Privacy from "./pages/terms/Privacy";
import CookiePolicy from "./pages/terms/CookiePolicy";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public access */}
          <Route element={<PublicLayout><Outlet /></PublicLayout>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/*<Route path="/verify-email" element={<VerifyEmailPage />} />*/}
            <Route path="/activation-confirm" element={<ActivationConfirmPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/password-reset-complete" element={<NewPasswordPage />} />
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
          </Route>

          {/* authenticated access */}
          <Route element={<MenuLayout><Outlet /></MenuLayout>}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ExplorePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/reviews" element={<ReviewCollectionPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* 404page */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Terms footer pages */}
          <Route path="/terms_of_service" element={<Terms />} />
          <Route path="/privacy_policy" element={<Privacy />} />
          <Route path="/cookie_policy" element={<CookiePolicy />} />

        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000}/>
      </Router>
    </AuthProvider>
  );
}

export default App;
