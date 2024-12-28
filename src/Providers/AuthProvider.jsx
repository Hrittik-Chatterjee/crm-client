/* eslint-disable react/prop-types */
import { useState, useEffect, createContext } from "react";
import axios from "axios";

// Create the AuthContext
export const AuthContext = createContext(null);

// AuthProvider component to wrap your app
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial state is null
  const [loading, setLoading] = useState(true); // Loading starts as true

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false); // If there's no token, stop loading and keep user null
        return;
      }

      try {
        const response = await axios.get("https://crm-backend-cjyf.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user); // Set the user data from backend
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null); // Reset user if there's an error
      } finally {
        setLoading(false); // End the loading state
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Provide the user, logout method, and loading state
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
