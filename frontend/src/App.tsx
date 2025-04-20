import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./utils/authentications/useAuth";
import LoginPage from "./pages/authentications/LoginPage";
import RegisterPage from "./pages/authentications/RegisterPage";
import ActivationConfirmPage from "./pages/authentications/ActivationConfirmPage";
import PasswordResetPage from "./pages/authentications/PasswordResetPage";
import NewPasswordPage from "./pages/authentications/NewPasswordPage";
import ExplorePage from "./pages/ExplorePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/404/NotFoundPage";
import ProtectedRoute from "./utils/authentications/ProtectedRoute";
import PublicRoute from "./utils/authentications/PublicRoute";
import ReviewCollectionPage from "./pages/ReviewCollectionPage";
import MenuLayout from "./components/menuLayout/MenuLayout";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            {/* public access */}
            <Route element={<PublicRoute/>}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/*<Route path="/verify-email" element={<VerifyEmailPage />} />*/}
              <Route path="/activation-confirm" element={<ActivationConfirmPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/password-reset-complete" element={<NewPasswordPage />} />
            </Route>

            {/* Routes with MenuLayout */}
            <Route element={<MenuLayout><Outlet /></MenuLayout>}>
              {/* authenticated access */}
              <Route element={<ProtectedRoute />}>
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/reviews" element={<ReviewCollectionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* 404page */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
