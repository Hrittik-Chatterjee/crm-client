import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home";
import Businesses from "../Pages/Businesses";
import Links from "../Pages/Links";
import AddRegularContent from "../Pages/AddRegularContent";
import Login from "../Pages/Login";

import AdminDashboard from "../Components/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../Pages/Unauthorized";
import AdminRoute from "./AdminRoute";
import AddBusiness from "../Pages/AddBusiness";
import CreateUser from "../Pages/CreateUser";
import EditBusiness from "../Pages/EditBusiness";
import Users from "../Pages/Users";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/businesses",
        element: (
          <ProtectedRoute>
            <Businesses />
          </ProtectedRoute>
        ),
      },
      {
        path: "/links",
        element: (
          <ProtectedRoute>
            <Links />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addregularcontent",
        element: (
          <ProtectedRoute>
            <AddRegularContent />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: (
          <ProtectedRoute>
            <Unauthorized />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      {
        path: "createuser",
        element: (
          <AdminRoute>
            <CreateUser />
          </AdminRoute>
        ),
      },
      {
        path: "addbusiness",
        element: (
          <AdminRoute>
            <AddBusiness />
          </AdminRoute>
        ),
      },
      {
        path: "editbusiness",
        element: (
          <AdminRoute>
            <EditBusiness />
          </AdminRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        ),
      },
    ],
  },
]);
