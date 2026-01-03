import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../utils/auth";

export default function AdminRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const user = getCurrentUser();
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

