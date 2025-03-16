import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ActivationConfirmPage from "./pages/ActivationConfirmPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

function App() {
	return (
	  <Router>
		<Routes>
		  <Route path="*" element={<NotFoundPage />} />
		  <Route path="/" element={<HomePage />} />
		  <Route path="/login" element={<LoginPage />} />
		  <Route path="/register" element={<RegisterPage />} />
		  <Route path="/verify-email" element={<VerifyEmailPage />} />
		  <Route path="/activation-confirm" element={<ActivationConfirmPage />} />
		  <Route path="/password-reset" element={<PasswordResetPage />} />
		  <Route path="/password-reset-complete" element={<NewPasswordPage />} />
		</Routes>
	  </Router>
	);
  }

  export default App;
