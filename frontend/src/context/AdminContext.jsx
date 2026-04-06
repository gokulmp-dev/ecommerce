import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/" />;
  return children;
};