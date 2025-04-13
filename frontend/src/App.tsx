import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./pages/authentications/LoginPage";
import RegisterPage from "./pages/authentications/RegisterPage";
//import VerifyEmailPage from "./pages/authentications/VerifyEmailPage";
import ActivationConfirmPage from "./pages/authentications/ActivationConfirmPage";
import PasswordResetPage from "./pages/authentications/PasswordResetPage";
import NewPasswordPage from "./pages/authentications/NewPasswordPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/404/NotFoundPage";
import { AuthProvider } from "./utils/authentications/useAuth";
import ProtectedRoute from "./utils/authentications/ProtectedRoute";
import PublicRoute from "./utils/authentications/PublicRoute";
import ReviewCollectionPage from "./pages/ReviewCollectionPage";
//import Header from "./components/menuLayout/Header";
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
                <Route path="/" element={<HomePage />} />
                <Route path="/reviews" element={<ReviewCollectionPage />} />
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
