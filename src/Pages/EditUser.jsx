/* eslint-disable react/prop-types */
import { useState } from "react";

const EditUser = ({ user, onClose, onSave }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState(user?.password || "");
  const [role, setRole] = useState(user?.role || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (!username || !password || !role) {
      alert("All fields are required");
      return;
    }
    onSave({ ...user, username, password, role });
  };

  console.log(user);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Edit User Details
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="content writer">Conter Writer</option>
            <option value="designer">Designer</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
