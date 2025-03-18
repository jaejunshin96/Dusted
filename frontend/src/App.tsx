import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ActivationConfirmPage from "./pages/ActivationConfirmPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./utils/useAuth";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* authenticated access */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* public access */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/activation-confirm" element={<ActivationConfirmPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/password-reset-complete" element={<NewPasswordPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
