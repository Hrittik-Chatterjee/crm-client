/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner or some loading indicator until user data is ready
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if no user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children if user is authenticated
  return children;
};

export default ProtectedRoute;
