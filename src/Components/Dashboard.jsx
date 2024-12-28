import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import axios from "axios";
import "react-day-picker/dist/style.css";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [regularContents, setRegularContents] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const { user } = useAuth();

  // Fetch businesses
  const getBusinesses = async () => {
    try {
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/businesses"
      );
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  useEffect(() => {
    getBusinesses();
  }, []);

  // Fetch regular contents
  const getRegularContents = async () => {
    try {
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/regularcontents"
      );
      setRegularContents(response.data);
    } catch (error) {
      console.error("Error fetching regular contents:", error);
    }
  };

  useEffect(() => {
    getRegularContents();
  }, []);

  // Filter businesses based on the search query
  const filteredBusinesses = businesses
    .filter((business) =>
      user.role === "admin" ? true : business.assignedTo === user.username
    )
    .filter((business) =>
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Filter contents based on selected business and date
  const filteredContents = regularContents.filter((content) => {
    if (user.role === 'admin') {
      return true; // Show all contents for admin
    }
    const isDateMatch =
      new Date(content.date).toLocaleDateString() ===
      selectedDate.toLocaleDateString();
    const isBusinessMatch =
      !selectedBusiness || content.name === selectedBusiness;
    const isUserMatch = user.username === content.addedBy;
    return isDateMatch && isBusinessMatch && isUserMatch;
  });
  
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  // Add the updated status change functionality
  const handleTickClick = async (id, currentStatus) => {
    if (!currentStatus) {
      // Change status from 'Processing' to 'Done'
      try {
        await axios.patch(
          `https://crm-backend-cjyf.onrender.com/regularcontents/${id}`,
          {
            status: true,
          }
        );
        setRegularContents((prev) =>
          prev.map((content) =>
            content._id === id ? { ...content, status: true } : content
          )
        );
      } catch (error) {
        console.error("Error updating status to 'Done':", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };

  const handleCrossClick = async (id, currentStatus) => {
    if (currentStatus) {
      // Change status from 'Done' to 'Processing'
      try {
        await axios.patch(
          `https://crm-backend-cjyf.onrender.com/regularcontents/${id}`,
          {
            status: false,
          }
        );
        setRegularContents((prev) =>
          prev.map((content) =>
            content._id === id ? { ...content, status: false } : content
          )
        );
      } catch (error) {
        console.error("Error updating status to 'Processing':", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://crm-backend-cjyf.onrender.com/regularcontents/${id}`
      );
      setRegularContents((prev) =>
        prev.filter((content) => content._id !== id)
      );
      alert("Content deleted successfully.");
    } catch (error) {
      console.error("Error deleting content from backend:", error);
      alert("Failed to delete content. Please try again.");
    }
  };

  const openViewModal = (content) => {
    setModalContent(content);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const openEditModal = (content) => {
    setEditFormData(content);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };
  const saveEditChanges = async () => {
    try {
      const { _id, ...updateData } = editFormData; // Exclude _id from the payload
      await axios.patch(
        `https://crm-backend-cjyf.onrender.com/regularcontents/${_id}`,
        updateData
      );
      setRegularContents((prev) =>
        prev.map((content) =>
          content._id === _id ? { ...content, ...updateData } : content
        )
      );
      alert("Content updated successfully.");
      closeEditModal();
    } catch (error) {
      console.error("Error saving changes to backend:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md">
        <div className="p-4">
          <button
            className="select select-primary w-full max-w-xs bg-slate-300"
            onClick={toggleDatePicker}
          >
            {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
          </button>

          {showDatePicker && (
            <div className="absolute mt-2 border rounded p-2 shadow bg-gray-800 text-white z-10">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2 w-full px-3 py-2 border rounded-md"
          />

          <ul className="mt-4 space-y-2">
            <li
              className={`cursor-pointer px-3 py-2 rounded-md ${
                !selectedBusiness ? "bg-purple-200" : "hover:bg-purple-100"
              }`}
              onClick={() => setSelectedBusiness(null)}
            >
              Show All Restaurants
            </li>
            {filteredBusinesses.map((business) => (
              <li
                key={business.businessName}
                className={`cursor-pointer px-3 py-2 rounded-md ${
                  selectedBusiness === business.businessName
                    ? "bg-purple-200"
                    : "hover:bg-purple-100"
                }`}
                onClick={() => setSelectedBusiness(business.businessName)}
              >
                {business.businessName}
              </li>
            ))}
            {filteredBusinesses.length === 0 && (
              <li className="px-3 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">
          Content → {selectedDate.toLocaleDateString() || "No Date Selected"}
        </h2>
        <table className="w-full bg-white shadow-md rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Business Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Change Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{content.name}</td>
                <td className="px-4 py-2">
                  {new Date(content.date).toLocaleDateString()}
                </td>
                <td
                  className={`px-4 py-2 ${
                    content.status ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {content.status ? "Done" : "Processing"}
                </td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  {/* Tick Button */}
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-md"
                    onClick={() => handleTickClick(content._id, content.status)}
                    disabled={content.status} // Disable if already 'Done'
                  >
                    ✓
                  </button>

                  {/* Cross Button */}
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded-md"
                    onClick={() =>
                      handleCrossClick(content._id, content.status)
                    }
                    disabled={!content.status} // Disable if already 'Processing'
                  >
                    ✕
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openEditModal(content)}
                    className="px-3 py-1 mr-2 bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openViewModal(content)}
                    className="                    px-3 py-1 mr-2 bg-yellow-500 text-white rounded-md"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(content._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredContents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-4 py-2 text-gray-500">
                  No content available for this selection
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative"
            style={{
              width: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 className="text-2xl font-bold mb-4">{modalContent.name}</h3>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(modalContent.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Post Material and Tags:</strong>{" "}
              {modalContent.posterAndTags}
            </p>
            <p>
              <strong>Poster Material:</strong> {modalContent.posterMaterial}
            </p>
            <p>
              <strong>Vision:</strong> {modalContent.vision}
            </p>

            <p>
              <strong>Comments:</strong> {modalContent.comments}
            </p>
            <p
              className={`mt-2 font-bold ${
                modalContent.status ? "text-green-500" : "text-red-500"
              }`}
            >
              Status: {modalContent.status ? "Done" : "Processing"}
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative"
            style={{
              width: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 className="text-2xl font-bold mb-4">Edit Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Post Material
                </label>
                <textarea
                  value={editFormData.postMaterial || ""}
                  onChange={(e) =>
                    handleEditChange("postMaterial", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Poster Material
                </label>
                <textarea
                  value={editFormData.posterMaterial || ""}
                  onChange={(e) =>
                    handleEditChange("posterMaterial", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vision
                </label>
                <textarea
                  value={editFormData.vision || ""}
                  onChange={(e) => handleEditChange("vision", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  value={editFormData.tags || ""}
                  onChange={(e) => handleEditChange("tags", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={saveEditChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
