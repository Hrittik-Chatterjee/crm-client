import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home";
import Businesses from "../Pages/Businesses";
import Links from "../Pages/Links";
import AddRegularContent from "../Pages/AddRegularContent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/businesses",
        element: <Businesses />,
      },
      {
        path: "/links",
        element: <Links />,
      },
      {
        path: "/addregularcontent",
        element: <AddRegularContent />,
      },
      //   {
      //     path: "/login",
      //     element: <Login />,
      //   },
      //   {
      //     path: "/register",
      //     element: <Register />,
      //   },
    ],
  },
]);
