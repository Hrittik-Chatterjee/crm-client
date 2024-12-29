import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GoEyeClosed } from "react-icons/go";
import { FiEye } from "react-icons/fi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { user, setUser } = useAuth(); // Access setUser from context

  const handleLogin = async () => {
    setLoading(true); // Start loading

    try {
      // Send login request
      const response = await axios.post(
        "https://crm-backend-cjyf.onrender.com/login",
        {
          username,
          password,
        }
      );

      console.log("Login response:", response.data); // Debug response

      // Success message and clearing error
      setSuccess("Login successful!");
      setError("");

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Update the user context with full user data (e.g., username, role, etc.)
      setUser(response.data.user); // Directly use the user object from the response

      // Redirect to the home page or another route
      navigate("/");
    } catch (err) {
      // Display the error from the backend
      setError(err.response?.data?.error || "Invalid username or password");
      setSuccess(""); // Clear success message on error

      console.error("Error during login:", err.response?.data || err.message); // Debug error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  console.log(user?.role);

  return (
    <div className="flex items-center justify-center h-screen-navbar bg-gray-100 shadow-2xl">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          LOGIN
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l"></span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l"></span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full pl-4 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? <GoEyeClosed /> : <FiEye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className={`w-full py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-white bg-red-500 py-3 rounded-sm text-center uppercase">
            {error}
          </p>
        )}
        {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default Login;
