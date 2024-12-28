import { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token is required to create a new user.");
        return;
      }

      // Send data to the backend with the Authorization header
      const response = await axios.post(
        "https://crm-backend-cjyf.onrender.com/users",
        {
          username,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      setSuccess(response.data.message || "User registered successfully!");
      setError(""); // Clear any errors
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setSuccess(""); // Clear any success messages
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create New User
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="admin">Admin</option>
              <option value="normal user">Normal User</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Create
        </button>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default CreateUser;
