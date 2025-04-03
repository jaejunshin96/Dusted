import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = localStorage.getItem("access_token");

  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
