// useAuth.js
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

// Custom hook to access AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
