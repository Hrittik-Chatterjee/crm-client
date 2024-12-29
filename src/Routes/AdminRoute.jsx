/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import Loading from "../Components/Loading";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Display a loading spinner or a placeholder while user data is being fetched
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children; // Render children if the user is an admin
};

export default AdminRoute;
