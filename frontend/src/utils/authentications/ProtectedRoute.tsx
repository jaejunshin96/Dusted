import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem("access_token");

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
