import axios from "axios";
import { useEffect, useState } from "react";
import EditUser from "./EditUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authorization token found");
        return;
      }
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authorization token found");
        return;
      }

      await axios.delete(`https://crm-backend-cjyf.onrender.com/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  // Open the Edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Close the Edit modal
  const closeEditModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  // Save the updated user details
  const saveUpdatedUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authorization token found");
        return;
      }

      const { _id, ...dataToSend } = updatedUser; // Exclude `_id` from the payload
      const response = await axios.patch(
        `https://crm-backend-cjyf.onrender.com/users/${_id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === response.data._id ? response.data : user
        )
      );

      alert("User updated successfully");
      closeEditModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error.response || error);
      alert(error.response?.data?.error || "Failed to update user");
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <th>{user?.username}</th>
                <td>{user?.password}</td>
                <td>{user?.role}</td>
                <td>
                  <span
                    className="btn btn-primary"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </span>
                </td>
                <td>
                  <span
                    className="btn btn-warning"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Edit User Modal */}
        {isModalOpen && (
          <EditUser
            user={selectedUser}
            onClose={closeEditModal}
            onSave={saveUpdatedUser}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
